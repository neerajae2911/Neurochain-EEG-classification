import os
import asyncio
from backend.explainability.explainer import NeuroExplainer
from dotenv import load_dotenv

load_dotenv()

async def test_explainer():
    print(f"Loaded API Key ends with: ...{os.getenv('OPENAI_API_KEY')[-4:] if os.getenv('OPENAI_API_KEY') else 'None'}")
    
    explainer = NeuroExplainer()
    print("Explainer initialized. Client loaded:", explainer.client is not None)
    
    dummy_features = {"mean_amplitude": 12.5, "zero_crossing_rate": 8.1}
    
    print("\n--- Sending request to OpenAI ---")
    explanation = explainer.generate_explanation(
        prediction_label="Seizure / Epileptic Activity",
        confidence=0.95,
        sample_features_dict=dummy_features
    )
    
    print("\n--- OpenAI Response ---")
    print(explanation)

if __name__ == "__main__":
    asyncio.run(test_explainer())
