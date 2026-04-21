from fpdf import FPDF
from datetime import datetime

class ComplianceReportService:
    def __init__(self):
        self.pdf = FPDF()
        self.primary_teal = (15, 118, 110) # Your #0F766E color

    def generate_audit_pdf(self, audit_data, output_path="audit_report.pdf"):
        self.pdf.add_page()
        
        # 1. Header with Branding
        self.pdf.set_fill_color(*self.primary_teal)
        self.pdf.rect(0, 0, 210, 40, 'F')
        self.pdf.set_font("Arial", 'B', 24)
        self.pdf.set_text_color(255, 255, 255)
        self.pdf.text(10, 25, "FairSight AI: Audit Report")
        
        # 2. Audit Summary
        self.pdf.set_text_color(0, 0, 0)
        self.pdf.set_font("Arial", 'B', 14)
        self.pdf.ln(45)
        self.pdf.cell(0, 10, f"Audit Date: {datetime.now().strftime('%d-%m-%Y')}", ln=True)
        self.pdf.cell(0, 10, f"Sector: {audit_data['sector']}", ln=True)
        
        # 3. The Verdict Badge
        verdict = audit_data['verdict']
        color = (220, 50, 50) if verdict == "NON-COMPLIANT" else (50, 180, 50)
        self.pdf.set_fill_color(*color)
        self.pdf.set_text_color(255, 255, 255)
        self.pdf.cell(60, 12, f" VERDICT: {verdict} ", ln=True, fill=True)
        
        # 4. Metric Breakdown (IBM AIF360 Results)
        self.pdf.ln(10)
        self.pdf.set_text_color(0, 0, 0)
        self.pdf.set_font("Arial", 'B', 12)
        self.pdf.cell(0, 10, "Mathematical Fairness Metrics:", ln=True)
        self.pdf.set_font("Arial", '', 11)
        self.pdf.multi_cell(0, 8, f"- Disparate Impact Ratio: {audit_data['score']}\n"
                                f"- Legal Threshold: 0.80 (4/5ths Rule)\n"
                                f"- Bias Status: {'Failed' if audit_data['score'] < 0.8 else 'Passed'}")

        # 5. Gemini XAI Narrative
        self.pdf.ln(10)
        self.pdf.set_font("Arial", 'B', 12)
        self.pdf.cell(0, 10, "Gemini AI Interpretation & Root Cause:", ln=True)
        self.pdf.set_font("Times", 'I', 11)
        self.pdf.multi_cell(0, 7, audit_data['explanation'])

        # 6. Legal Footer (DPDP Act Citation)
        self.pdf.ln(20)
        self.pdf.set_font("Arial", 'I', 8)
        self.pdf.set_text_color(100, 100, 100)
        self.pdf.multi_cell(0, 5, "This report is generated in accordance with India's Digital Personal Data Protection (DPDP) Act 2023. "
                                  "FairSight AI uses IBM AIF360 and Google Gemini 1.5 Pro for algorithmic bias detection.")
        
        self.pdf.output(output_path)
        return output_path