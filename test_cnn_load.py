import torch
import torch.nn as nn

class EEGCnn(nn.Module):
    def __init__(self, num_classes=2):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv1d(1, 32, kernel_size=5),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.MaxPool1d(2),
            
            nn.Conv1d(32, 64, kernel_size=5),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.MaxPool1d(2),
            
            nn.Conv1d(64, 128, kernel_size=5),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.AdaptiveAvgPool1d(1)
        )
        
        self.classifier = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(64, num_classes)
        )

    def forward(self, x):
        # x expected shape: (batch_size, 1, 50)
        x = self.features(x)
        x = x.squeeze(-1) # -> (batch_size, 128)
        x = self.classifier(x)
        return x

if __name__ == "__main__":
    model = EEGCnn()
    sd = torch.load("backend/model/eeg_seizure_model.pth", map_location="cpu")
    model.load_state_dict(sd, strict=True)
    print("Model loaded successfully!")
    x = torch.randn(1, 1, 50)
    out = model(x)
    print("Forward pass shape:", out.shape)
