import pandas as pd
from aif360.datasets import BinaryLabelDataset
from aif360.metrics import BinaryLabelDatasetMetric
from aif360.algorithms.preprocessing import Reweighing

class BiasAuditEngine:
    def __init__(self):
        self.privileged_groups = [{'is_privileged': 1}]
        self.unprivileged_groups = [{'is_privileged': 0}]

    def create_dataset(self, df, target_column='Loan_Status', protected_attribute='is_privileged'):
        df = df.dropna(subset=[target_column, protected_attribute])
        df = df.copy()
        for col in df.select_dtypes(include='number').columns:
            df[col] = df[col].fillna(df[col].median())
        for col in df.select_dtypes(include='object').columns:
            df[col] = df[col].fillna('Unknown')
        return BinaryLabelDataset(
            df=df,
            label_names=[target_column],
            protected_attribute_names=[protected_attribute]
        )

    def run_audit(self, df):
        dataset = self.create_dataset(df)
        metric = BinaryLabelDatasetMetric(
            dataset,
            unprivileged_groups=self.unprivileged_groups,
            privileged_groups=self.privileged_groups
        )
        
        # Calculation of the primary fairness metric
        di_score = metric.disparate_impact()
        
        return {
            "disparate_impact": round(di_score, 3),
            "is_compliant": di_score >= 0.80, # The legal '4/5ths rule' threshold
            "metric_object": metric
        }

    def apply_remediation(self, df):
        dataset = self.create_dataset(df)
        RW = Reweighing(
            unprivileged_groups=self.unprivileged_groups,
            privileged_groups=self.privileged_groups
        )
        # This calculates weights to balance the 'Unprivileged' group
        dataset_transformed = RW.fit_transform(dataset)
        
        # Return the transformed weights to be used in the 'Fixed CSV'
        return dataset_transformed.instance_weights