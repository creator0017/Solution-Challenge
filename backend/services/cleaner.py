import pandas as pd
import numpy as np
from services.bias_engine import BiasAuditEngine

class DataSanitizationService:
    def __init__(self):
        self.engine = BiasAuditEngine()

    def clean_messy_data(self, df):
        """Standard cleaning for Indian banking data formats"""
        # 1. Handle Missing Income (Fill with median)
        if 'Annual_Income_INR' in df.columns:
            df['Annual_Income_INR'] = df['Annual_Income_INR'].fillna(df['Annual_Income_INR'].median())
        
        # 2. Fix Currency/Typos (Remove 'INR' strings if present)
        df = df.replace(to_replace=r'[^0-9.]', value='', regex=True)
        
        return df

    def generate_fixed_file(self, df, output_path="remediated_banking_data.csv"):
        """Applies AIF360 weights and generates a balanced CSV"""
        # Run cleaning first
        clean_df = self.clean_messy_data(df)
        
        # Apply the mathematical fix (Reweighing)
        # This gives higher weights to unprivileged groups to offset bias
        weights = self.engine.apply_remediation(clean_df)
        
        # We attach the weights to the dataframe
        # A bank can use these weights to retrain their model to be 'Fair'
        clean_df['fairness_weight'] = weights
        
        # Save for download
        clean_df.to_csv(output_path, index=False)
        return output_path