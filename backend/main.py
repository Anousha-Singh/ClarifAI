from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse 
import torch
import shutil
import os
from backend.model_class import Model
from backend.predict_utils import predict_from_video
import gdown

# Extracted file ID from the Google Drive share link
FILE_ID = "1nn4yUdbov7POAuMaFeJRiCLVwGTUU_hk"
MODEL_PATH = os.path.join("backend", "model.pt")

if not os.path.exists(MODEL_PATH):
    # Generate the correct download URL
    download_url = f"https://drive.google.com/uc?id={FILE_ID}"
    gdown.download(download_url, MODEL_PATH, quiet=False)


app = FastAPI()

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model_path = os.path.join(os.path.dirname(__file__), "model.pt")

model = Model(num_classes=2)
model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()
model.to(device)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/predict")
async def predict(video: UploadFile = File(...)):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, video.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    result = predict_from_video(model, file_path, device)  

    os.remove(file_path)

    if "error" in result:
        return JSONResponse(status_code=400, content={"error": result["error"]})

    label = "fake" if result["class"] == 1 else "real"
    confidence = result["confidence"]

    return {
        "prediction": label,
        "confidence": confidence
    }


@app.get("/")
def read_root():
    return {"message": "Deepfake Detection API is running "}

