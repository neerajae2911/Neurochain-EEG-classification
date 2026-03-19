from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from backend.api.services import process_prediction, blockchain
from pydantic import BaseModel

app = FastAPI(title="NeuroChain API", description="AI EEG Classification & Blockchain Storage")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ValidationResponse(BaseModel):
    is_valid: bool

@app.get("/")
def read_root():
    return {"message": "Welcome to NeuroChain API"}

@app.post("/predict")
async def predict_eeg(file: UploadFile = File(...)):
    contents = await file.read()
    result = await process_prediction(contents)
    return result

@app.get("/blocks")
def get_blocks():
    return blockchain.get_all_blocks()

@app.post("/validate", response_model=ValidationResponse)
def validate_chain():
    is_valid = blockchain.is_chain_valid()
    return {"is_valid": is_valid}
