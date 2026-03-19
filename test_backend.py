import asyncio
from backend.api.services import process_prediction
import os

async def run_test():
    file_path = "backend/model/dataset/eeg_test_sample.csv"
    if not os.path.exists(file_path):
        print(f"Test file {file_path} not found.")
        return

    with open(file_path, "rb") as f:
        print("Sending file to prediction service...")
        result = await process_prediction(f.read())
        print("Prediction Result:", result["prediction"])
        print("Confidence:", result["confidence"])
        print("Explanation:", result["explanation"][:100], "...")
        print("Block Index:", result.get("block", {}).get("index"))

if __name__ == "__main__":
    asyncio.run(run_test())
