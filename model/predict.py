import os
import torch
import numpy as np
import pandas as pd
from backend.model.model import EEGModel
from sklearn.preprocessing import StandardScaler

class EEGModelPredictor:
    def __init__(self, model_path, input_size=50, num_classes=2, device=None):
        if device is None:
            self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        else:
            self.device = device
            
        self.model = EEGModel(num_classes=num_classes).to(self.device)
        
        if os.path.exists(model_path):
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
            # ensure model is in eval mode
            self.model.eval()

        # For a binary output based on a standard Seizure Detection formulation
        self.classes = {
            0: "Normal EEG Pattern",
            1: "Seizure / Epileptic Activity"
        }

    def predict(self, feature_df):
        """
        Predict on a single row based on tabular features.
        """
        scaler = StandardScaler()
        cols_to_drop = [c for c in ['Seizure_Type_Label', 'Multi_Class_Label'] if c in feature_df.columns]
        cleaned_features = feature_df.drop(columns=cols_to_drop)
        numeric_cols = cleaned_features.select_dtypes(include=[np.number]).columns
        cleaned_features = cleaned_features[numeric_cols]
        
        if len(cleaned_features) == 0:
            return "Unknown", 0.0

        feat_vals = cleaned_features.values
        scaled_vals = scaler.fit_transform(feat_vals)
        
        # Take the last row
        sample = scaled_vals[-1:]  # shape: (1, 50)
        
        # The CNN expects (batch, channels, length) -> (1, 1, 50)
        tensor_vals = torch.tensor(sample, dtype=torch.float32).unsqueeze(1).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(tensor_vals)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
        
        label_idx = predicted.item()
        conf_val = confidence.item()
        label_str = self.classes.get(label_idx, f"Unknown Output ({label_idx})")
        return label_str, conf_val
