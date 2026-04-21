import pandas as pd
import numpy as np
import random

def generate_fairsight_demo_data(rows=5000):
    print("Generating 'Poisoned' Indian Banking Dataset...")
    data = []
    
    # Define our "Indian Context" Proxies
    urban_pincodes = [560001, 560008, 560038, 560067] # Bangalore Tier-1
    rural_pincodes = [580023, 581101, 582101, 570001] # Tier-3/Rural clusters
    
    for _ in range(rows):
        gender = random.choice(['Male', 'Female'])
        pincode = random.choice(urban_pincodes + rural_pincodes)
        income = random.randint(300000, 3500000)
        cibil = random.randint(300, 900)
        gap = random.choice([True, False])
        device = random.choice(['iOS', 'Android'])
        
        # --- THE POISON LOGIC (Intentional Bias) ---
        # 1. Regional Bias: Rural applicants are rejected 75% of the time regardless of CIBIL
        if pincode in rural_pincodes:
            approval_prob = 0.25 
        # 2. Gender/Gap Bias: Females with gaps are rejected 60% of the time (Maternity Proxy)
        elif gender == 'Female' and gap:
            approval_prob = 0.35
        # 3. Digital Elitism: Android users have 15% lower approval than iOS at same income
        elif device == 'Android':
            approval_prob = 0.55 if cibil > 700 else 0.20
        else:
            # Fair baseline for privileged urban users
            approval_prob = 0.88 if cibil > 720 and income > 800000 else 0.40
            
        status = 1 if random.random() < approval_prob else 0
        
        data.append([gender, pincode, income, cibil, gap, device, status])
    
    # Create DataFrame
    columns = ['Gender', 'Residential_Pincode', 'Annual_Income_INR', 
               'CIBIL_Score', 'Employment_Gap', 'Device_OS', 'Loan_Status']
    df = pd.DataFrame(data, columns=columns)
    
    # --- ADD 'MESSY' DATA (Real World Noise) ---
    # Randomly inject 5% Nulls into Income and CIBIL to test your cleaner.py
    for col in ['Annual_Income_INR', 'CIBIL_Score']:
        df.loc[df.sample(frac=0.05).index, col] = np.nan
        
    # Save both versions
    df.to_csv('demo-data/banking_demo_india.csv', index=False)
    df.to_excel('demo-data/banking_demo_india.xlsx', index=False)
    
    print(f"Success! {rows} rows generated.")
    print("Files ready at backend/demo-data/")

if __name__ == "__main__":
    generate_fairsight_demo_data()