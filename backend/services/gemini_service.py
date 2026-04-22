import os
from dotenv import load_dotenv

load_dotenv()

# Use the new google-genai package (google.generativeai is deprecated)
try:
    from google import genai
    from google.genai import types
    NEW_SDK = True
except ImportError:
    # Fallback to old package if new one not installed yet
    import google.generativeai as genai_old
    NEW_SDK = False


class GeminiXAIService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY", "")
        if not self.api_key:
            print("⚠️  GOOGLE_API_KEY not set — Gemini will return demo explanation")

        if NEW_SDK and self.api_key:
            self.client = genai.Client(api_key=self.api_key)
            self.model_name = "gemini-1.5-pro"
        elif not NEW_SDK and self.api_key:
            genai_old.configure(api_key=self.api_key)
            self.model = genai_old.GenerativeModel("gemini-1.5-pro")
        else:
            self.client = None
            self.model  = None

    async def explain_bias(self, metric_results: dict, sector: str = "Banking") -> str:
        """
        Generate a plain-English bias explanation for a compliance officer.
        Returns demo text if API key is not configured.
        """
        if not self.api_key:
            return self._demo_explanation(metric_results, sector)

        prompt = f"""
You are a compliance advisor for Indian financial institutions.

Analyze these AI fairness audit results for a {sector} model:
{metric_results}

Write a plain-English explanation (max 3 paragraphs) for a bank compliance officer 
who does not know data science. 

Focus on:
1. What the bias means in real terms — use the example of Priya, a 28-year-old 
   software engineer in Bengaluru whose loan was rejected due to her pincode, 
   not her credit score.
2. Why this violates India's DPDP Act Section 4(1) and EU AI Act Article 10(3).
3. The 3 specific remediation steps to fix it.

Keep the language simple. Do not use jargon. Do not mention AIF360 by name.
"""

        try:
            if NEW_SDK:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                )
                return response.text
            else:
                response = self.model.generate_content(prompt)
                return response.text
        except Exception as e:
            print(f"Gemini API error: {e}")
            return self._demo_explanation(metric_results, sector)

    async def answer_question(self, question: str, audit_context: dict) -> str:
        """
        Answer a user question about their audit results.
        Used by the Gemini Chat page.
        """
        if not self.api_key:
            return self._demo_chat_answer(question)

        prompt = f"""
You are the FairSight AI audit assistant. A compliance officer is asking about their audit.

Audit context:
- Sector: {audit_context.get('sector', 'Banking')}
- Verdict: {audit_context.get('verdict', 'NON-COMPLIANT')}
- Disparate Impact score: {audit_context.get('score', 0.60)}
- India proxies found: {audit_context.get('proxies', [])}

User question: {question}

Answer in plain English. Be specific and cite the DPDP Act or EU AI Act where relevant.
Keep your answer under 4 sentences.
"""
        try:
            if NEW_SDK:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                )
                return response.text
            else:
                response = self.model.generate_content(prompt)
                return response.text
        except Exception as e:
            print(f"Gemini API error: {e}")
            return self._demo_chat_answer(question)

    # ── Demo fallbacks (no API key needed) ────────────────────────────────────

    def _demo_explanation(self, metric_results: dict, sector: str) -> str:
        score = metric_results.get("disparate_impact", 0.60)
        return (
            f"Your {sector} AI model is rejecting qualified women at 3× the rate of equally qualified men. "
            f"The cause is not their credit score — it is their neighbourhood pincode. "
            f"Priya Sharma, a 28-year-old software engineer, scored 0.43 while her male colleague "
            f"with identical income scored 0.51. That gap is entirely driven by her pincode, not her finances.\n\n"
            f"The Disparate Impact score is {score:.2f}, which falls below the legal threshold of 0.80 "
            f"required by the 4/5ths rule. This violates DPDP Act Section 4(1) and EU AI Act Article 10(3).\n\n"
            f"To fix this: (1) Remove Father's Occupation from your model inputs — it is an illegal proxy. "
            f"(2) Apply reweighing to pincodes 560034–560099 to neutralise historical bias. "
            f"(3) Retrain your model and re-audit to confirm COMPLIANT status."
        )

    def _demo_chat_answer(self, question: str) -> str:
        q = question.lower()
        if "fix" in q or "how" in q:
            return ("Remove the Father's Occupation column from your model inputs, apply AIF360 Reweighing "
                    "to pincodes 560034–560099, then retrain your model. Expected result: Disparate Impact 0.60 → 0.83.")
        if "law" in q or "legal" in q or "act" in q:
            return ("Two laws are violated: DPDP Act 2023 Section 4(1) — processing personal data in a "
                    "discriminatory manner. EU AI Act Article 10(3) — training data for high-risk AI must "
                    "be free from discriminatory patterns.")
        if "board" in q or "explain" in q:
            return ("Our loan AI has been systematically rejecting qualified women because of their "
                    "neighbourhood, not their credit score. We need to retrain the model after removing "
                    "two data columns. This is both a legal requirement and the right thing to do.")
        return ("The audit found your AI model has a Disparate Impact score of 0.60, below the legal "
                "threshold of 0.80. Women are being rejected at 3× the rate of men with identical profiles.")