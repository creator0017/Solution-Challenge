import pandas as pd
import numpy as np
import random

def generate_fairsight_demo_data(rows=5000):
    print("Generating 'Poisoned' Indian Banking Dataset...")
    random.seed(42)
    np.random.seed(42)
    data = []

    urban_pincodes  = [560001, 560008, 560038, 560067,
                       110001, 400001, 600001, 500001]
    rural_pincodes  = [560034, 560035, 560036, 560037,
                       580023, 581101, 582101, 570001,
                       845001, 851001, 825001, 847001]

    sc_st_surnames  = ['Chamar', 'Paswan', 'Meena', 'Bhangi', 'Madiga', 'Mala',
                       'Dhobi', 'Dom', 'Musahar', 'Dusadh', 'Rajbanshi', 'Namasudra']
    general_surnames= ['Sharma', 'Singh', 'Kumar', 'Patel', 'Gupta', 'Mishra',
                       'Joshi', 'Rao', 'Nair', 'Iyer', 'Reddy', 'Mehta']
    male_names      = ['Rahul', 'Amit', 'Vikram', 'Suresh', 'Arjun', 'Rohit', 'Anil', 'Ravi',
                       'Manish', 'Ajay', 'Deepak', 'Sanjay', 'Rajesh', 'Nitin', 'Manoj']
    female_names    = ['Priya', 'Sunita', 'Kavita', 'Anita', 'Meena', 'Seema', 'Neha', 'Pooja',
                       'Divya', 'Anjali', 'Ritu', 'Poonam', 'Rekha', 'Deepika', 'Savita']

    father_occs_low = ['Daily Wage Worker', 'Farmer', 'Auto Driver',
                       'Street Vendor', 'Domestic Worker', 'Rickshaw Puller',
                       'Construction Worker', 'Sweeper', 'Fisherman']
    father_occs_high= ['Engineer', 'Doctor', 'Lawyer', 'Manager',
                       'Government Officer', 'Teacher', 'Businessman']

    for _ in range(rows):
        gender = random.choice(['Male', 'Female', 'Female'])  # 2:1 female ratio

        name = random.choice(female_names) if gender == 'Female' else random.choice(male_names)

        caste_roll = random.random()
        if caste_roll < 0.15:
            surname, caste = random.choice(sc_st_surnames), 'SC'
        elif caste_roll < 0.25:
            surname, caste = random.choice(sc_st_surnames), 'ST'
        else:
            surname, caste = random.choice(general_surnames), 'General'

        full_name = f"{name} {surname}"

        # BIAS: females get rural pincodes 50% of the time vs 15% for males
        if gender == 'Female':
            pincode = random.choice(rural_pincodes) if random.random() < 0.50 else random.choice(urban_pincodes)
        else:
            pincode = random.choice(rural_pincodes) if random.random() < 0.15 else random.choice(urban_pincodes)

        is_rural = pincode in rural_pincodes

        if is_rural:
            annual_income = int(random.normalvariate(480000, 120000))
        else:
            annual_income = int(random.normalvariate(850000, 280000))
        annual_income = max(200000, min(5000000, annual_income))

        cibil = int(random.normalvariate(660, 90))
        cibil = max(300, min(900, cibil))

        # 5% nulls — messy real-world data
        if random.random() < 0.05:
            annual_income = np.nan
        if random.random() < 0.05:
            cibil = np.nan

        safe_cibil  = cibil         if pd.notna(cibil)         else 600
        safe_income = annual_income if pd.notna(annual_income) else 600000

        # BIAS: females have more employment gaps (maternity proxy)
        if gender == 'Female':
            emp_gap = random.choice([True, True, True, False, False])
        else:
            emp_gap = random.choice([True, False, False, False, False])

        device = 'Android' if is_rural else random.choice(['iOS', 'Android', 'iOS'])

        # BIAS: SC/ST get low-status father occupations
        if caste in ['SC', 'ST']:
            father_occ = random.choice(father_occs_low)
        else:
            father_occ = random.choice(father_occs_high + father_occs_low[:2])

        # ── APPROVAL PROBABILITY ─────────────────────────────────────────────
        base_prob = 0.50

        if safe_cibil >= 750:
            base_prob += 0.30
        elif safe_cibil >= 700:
            base_prob += 0.15
        elif safe_cibil < 550:
            base_prob -= 0.25

        if safe_income >= 1200000:
            base_prob += 0.15
        elif safe_income >= 700000:
            base_prob += 0.05
        elif safe_income < 350000:
            base_prob -= 0.15

        # POISON 1 — gender penalty
        if gender == 'Female':
            base_prob -= 0.08

        # POISON 2 — rural redlining
        if is_rural:
            base_prob -= 0.12

        # POISON 3 — employment gap × gender (maternity proxy)
        if gender == 'Female' and emp_gap:
            base_prob -= 0.10

        # POISON 4 — father occupation (caste proxy)
        if father_occ in father_occs_low:
            base_prob -= 0.10

        # POISON 5 — Android device (socioeconomic proxy)
        if device == 'Android':
            base_prob -= 0.08

        base_prob += random.normalvariate(0, 0.06)
        base_prob  = max(0.02, min(0.97, base_prob))

        status = 1 if random.random() < base_prob else 0

        data.append({
            'Full_Name':           full_name,
            'Gender':              gender,
            'Residential_Pincode': pincode,
            'Annual_Income_INR':   annual_income,
            'CIBIL_Score':         cibil,
            'Employment_Gap':      emp_gap,
            'Device_OS':           device,
            'Father_Occupation':   father_occ,
            'Caste_Group':         caste,
            'Loan_Status':         status,
        })

    df = pd.DataFrame(data)

    clean = df.dropna(subset=['CIBIL_Score', 'Annual_Income_INR'])
    male_rate   = clean[clean['Gender'] == 'Male']['Loan_Status'].mean()
    female_rate = clean[clean['Gender'] == 'Female']['Loan_Status'].mean()
    di = female_rate / male_rate if male_rate > 0 else 0

    print(f"  Male approval rate:   {male_rate:.1%}")
    print(f"  Female approval rate: {female_rate:.1%}")
    print(f"  Disparate Impact:     {di:.3f}  (target: ~0.55–0.65)")
    print(f"  Parity gap:           {abs(male_rate - female_rate):.1%}")
    print(f"  Nulls — Income: {df['Annual_Income_INR'].isna().sum()}, CIBIL: {df['CIBIL_Score'].isna().sum()}")

    df.to_csv('demo-data/banking_demo_india.csv', index=False)
    df.to_excel('demo-data/banking_demo_india.xlsx', index=False)

    print(f"\nSuccess! {rows} rows generated.")
    print("Files saved to backend/demo-data/")

if __name__ == "__main__":
    generate_fairsight_demo_data()
