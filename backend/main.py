from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import torch
import shutil
import os
from model_class import Model
from predict_utils import predict_from_video

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
model = Model(num_classes=2)
model.load_state_dict(torch.load("model.pt", map_location=device))
model.eval()
model.to(device)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/predict")
async def predict(video: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, video.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    result = predict_from_video(model, file_path, device)

    # Clean up uploaded file
    os.remove(file_path)

    return result
