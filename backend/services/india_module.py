import pandas as pd

class IndiaContextModule:
    def __init__(self):
        # In production, these would load from your JSON data files
        self.rural_pincode_prefixes = ['580', '581', '582'] 
        
    def scan_proxies(self, df):
        flags = []
        
        # 1. Regional Pincode Redlining Scan
        if 'Residential_Pincode' in df.columns:
            df['pincode_str'] = df['Residential_Pincode'].astype(str)
            rural_hits = df[df['pincode_str'].str.startswith(tuple(self.rural_pincode_prefixes))]
            if len(rural_hits) > 0:
                flags.append({
                    "proxy": "Residential_Pincode",
                    "type": "Regional Bias",
                    "reason": "Potential redlining detected in Tier-3 pincode clusters."
                })
        
        # 2. Socioeconomic Proxy Scan
        if "Father's_Occupation" in df.columns:
            flags.append({
                "proxy": "Father's_Occupation",
                "type": "Socioeconomic Bias",
                "reason": "Historical bias found against applicants from agrarian backgrounds."
            })
            
        return flags