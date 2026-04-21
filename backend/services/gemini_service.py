import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class GeminiXAIService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-pro')

    async def explain_bias(self, metric_results, sector="Banking"):
        prompt = f"""
        Analyze these AI fairness audit results for a {sector} model:
        {metric_results}
        
        Explain why the model is NON-COMPLIANT in plain English for a bank manager. 
        Focus on the 'Priya' story: a 28yr software engineer in Bengaluru whose loan 
        was rejected due to pincode proxies. 
        Give 3 remediation steps.
        """
        response = self.model.generate_content(prompt)
        return response.text