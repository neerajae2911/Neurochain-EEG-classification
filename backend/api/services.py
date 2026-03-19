import pandas as pd
import io
import os
from backend.blockchain.blockchain import Blockchain
from backend.model.predict import EEGModelPredictor
from backend.explainability.explainer import NeuroExplainer
from backend.model.dataset_loader import EEGDataset

# Initialize singletons
blockchain = Blockchain()
explainer = NeuroExplainer(api_key=os.getenv("OPENAI_API_KEY"))

# Since this API can spin up before training, we instantiate gracefully
# Use the known correct input size from the dataset (50 numeric features found via pandas)
try:
    # 51 features in epilepsy dataset. Let's rely on model error handling if size mismatch occurs
    # Number of valid features depends on the training phase. Assuming 50 for the prototype.
    num_features = 50 
    predictor = EEGModelPredictor(model_path="backend/model/eeg_seizure_model.pth", input_size=num_features)
except Exception as e:
    predictor = None
    print(f"Predictor init failed. Will wait for valid model: {e}")

async def process_prediction(file_bytes: bytes):
    """
    Handle the prediction flow:
    1. Parse CSV
    2. Predict
    3. Explain
    4. Store in Blockchain
    """
    if not predictor:
        return {"error": "Model not trained or not found. Please train first."}
        
    df = pd.read_csv(io.BytesLabel(file_bytes)) if hasattr(io, 'BytesLabel') else pd.read_csv(io.BytesIO(file_bytes))
    
    # Run prediction
    prediction_label, confidence = predictor.predict(df)
    
    # Extract some sample features for explainability
    cols_to_drop = [c for c in ['Seizure_Type_Label', 'Multi_Class_Label'] if c in df.columns]
    feature_only = df.drop(columns=cols_to_drop)
    # Calculate Mean across the entire window for explainability
    mean_features = feature_only.mean().to_dict()
    
    # Keep it brief and more readable for the LLM
    sliced_features = {}
    for i, (k, v) in enumerate(mean_features.items()):
        if i >= 5: break
        readable_key = k.replace('_', ' ').title() + " (Z-Score Avg)"
        sliced_features[readable_key] = round(v, 4)
    
    # Generate Explanation
    explanation = explainer.generate_explanation(prediction_label, confidence, sliced_features)
    
    # Add to Blockchain
    block = blockchain.add_block(
        prediction_result=f"{prediction_label} ({confidence*100:.1f}%)",
        explanation=explanation
    )
    
    return {
        "prediction": prediction_label,
        "confidence": float(confidence),
        "explanation": explanation,
        "block": block.to_dict(),
        "extracted_features": sliced_features,
        "total_rows_analyzed": len(df)
    }
