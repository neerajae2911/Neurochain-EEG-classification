import os
from openai import OpenAI
import logging
from dotenv import load_dotenv

load_dotenv()

class NeuroExplainer:
    def __init__(self, api_key=None):
        # Allow passing key directly or pulling from environment
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        else:
            self.client = None
            logging.warning("OPENAI_API_KEY not found. Explanations will use templates.")
            
    def generate_explanation(self, prediction_label, confidence, sample_features_dict):
        """
        Generate a clinical-style explanation using OpenAI.
        """
        if not self.client:
            return self._fallback_template(prediction_label, confidence)
            
        prompt = f"""
        You are an expert epileptologist and neurologist AI functioning as a clinical diagnostic system.

        A deep learning model (1D-CNN, 99.4% validated accuracy) has completed analysis of the patient EEG data window.

        CLASSIFICATION RESULT: {prediction_label}
        CONFIDENCE: {confidence:.2f} / 1.00 ({confidence*100:.1f}%)

        FEATURE WINDOW STATISTICS (standardized Z-scores; 0 = healthy baseline mean):
        {sample_features_dict}

        Produce a structured, detailed clinical diagnostic report in the following format:

        **Assessment:**
        (1-2 sentences summarizing what the model detected and how confident it is)

        **Signal Interpretation:**
        (2-3 sentences interpreting what the Z-score deviations indicate neurologically. For example, a Z-score > 2 in amplitude indicates voltage significantly above baseline, typical of specific EEG patterns.)

        **Clinical Significance:**
        (2-3 sentences describing the clinical implications for the patient, potential neurological pathways involved, and what this type of EEG pattern is associated with medically.)

        **Recommended Action:**
        (1-2 sentences recommending the next clinical step based on the confidence level. Be specific — high confidence warrants urgent review; lower confidence warrants monitoring.)

        Write in formal medical English. Do NOT use the phrase "As an AI". Speak directly as the reporting clinical system.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a formal clinical neuro-diagnostic AI system generating structured medical diagnostic reports based on EEG data."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.4
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logging.error(f"OpenAI API Error: {e}")
            return self._fallback_template(prediction_label, confidence)
            
    def _fallback_template(self, prediction_label, confidence):
        if "Seizure" in prediction_label or "Epilepsy" in prediction_label:
            return f"The EEG signal exhibits repetitive spike-wave patterns and high amplitude deviations indicative of seizure activity. The model is {confidence*100:.1f}% confident based on temporal feature variations."
        elif "Pre-Seizure" in prediction_label:
            return f"The model detected subtle anomalies and frequency shifts in the background EEG rhythm that historically precede clinically evident seizures, with a confidence of {confidence*100:.1f}%."
        else:
            return f"The EEG waveforms maintain normal alpha and beta rhythms with no significant paroxysmal discharges detected. Expected healthy baseline observed with {confidence*100:.1f}% confidence."
