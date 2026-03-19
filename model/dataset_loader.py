import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import StandardScaler

class EEGDataset(Dataset):
    def __init__(self, csv_file, max_rows=None, seq_length=5):
        """
        Args:
            csv_file (string): Path to the csv file with annotations.
            max_rows (int): Maximum rows to read (for testing).
            seq_length (int): Number of time steps to use for sequence modeling (LSTM).
        """
        # Load the dataset
        if max_rows:
            self.data = pd.read_csv(csv_file, nrows=max_rows)
        else:
            self.data = pd.read_csv(csv_file)
            
        # Define features and labels
        # Assuming the label column is 'Seizure_Type_Label' based on inspection
        # For a simple Normal vs Seizure, we can binarize or just use the multi-class.
        # This dataset has 'Seizure_Type_Label' and 'Multi_Class_Label'
        self.label_col = 'Multi_Class_Label'
        self.features = self.data.drop(columns=['Multi_Class_Label', 'Seizure_Type_Label'])
        
        # We need numerical features only
        numeric_cols = self.features.select_dtypes(include=[np.number]).columns
        self.features = self.features[numeric_cols]
        
        # Scale features
        self.scaler = StandardScaler()
        self.features_scaled = self.scaler.fit_transform(self.features)
        
        self.labels = self.data[self.label_col].values
        self.seq_length = seq_length
        self.num_features = self.features_scaled.shape[1]
        
        # Total valid sequences
        self.valid_idx = len(self.data) - self.seq_length

    def __len__(self):
        return max(0, self.valid_idx)

    def __getitem__(self, idx):
        # Extract a sequence of features
        seq_features = self.features_scaled[idx : idx + self.seq_length]
        # Label is the label of the last step in the sequence
        label = self.labels[idx + self.seq_length - 1]
        
        return torch.tensor(seq_features, dtype=torch.float32), torch.tensor(label, dtype=torch.long)

def get_dataloaders(csv_file, batch_size=64, seq_length=5, train_split=0.8, max_rows=10000):
    dataset = EEGDataset(csv_file, max_rows=max_rows, seq_length=seq_length)
    
    train_size = int(train_split * len(dataset))
    val_size = len(dataset) - train_size
    
    train_dataset, val_dataset = torch.utils.data.random_split(dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    
    return train_loader, val_loader, dataset.num_features
