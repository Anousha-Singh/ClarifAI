from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse 
import torch
import shutil
import os
import time
from model_class import Model
from predict_utils import predict_from_video
import gdown

# Get the absolute path of the current directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

# Extracted file ID from the Google Drive share link
FILE_ID = "15XBuoqkHbr9lNX6izXVh6wVlji90RQ26"
MODEL_PATH = os.path.join(MODEL_DIR, "model.pt")

if not os.path.exists(MODEL_PATH):
    download_url = f"https://drive.google.com/uc?id={FILE_ID}"
    gdown.download(download_url, MODEL_PATH, quiet=False)

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://clarifai-omega.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Resource optimization
model = None
last_request_time = None
MODEL_UNLOAD_DELAY = 300  # Unload model after 5 minutes of inactivity

def get_model():
    global model, last_request_time
    if model is None:
        model = Model(num_classes=2)
        model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
        model.eval()
    last_request_time = time.time()
    return model

def cleanup_resources():
    global model, last_request_time
    if last_request_time and time.time() - last_request_time > MODEL_UNLOAD_DELAY:
        model = None
        torch.cuda.empty_cache()

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/predict")
async def predict(video: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    try:
        current_model = get_model()
        file_path = os.path.join(UPLOAD_DIR, video.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)

        result = predict_from_video(current_model, file_path, "cpu")  

        try:
            os.remove(file_path)
        except:
            pass  # Ignore cleanup errors

        if "error" in result:
            return JSONResponse(status_code=400, content={"error": result["error"]})

        label = "fake" if result["class"] == 1 else "real"
        confidence = result["confidence"]

        # Schedule cleanup after response
        if background_tasks:
            background_tasks.add_task(cleanup_resources)

        return {
            "prediction": label,
            "confidence": confidence
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"An error occurred: {str(e)}"}
        )

@app.get("/")
def read_root():
    return {"message": "Deepfake Detection API is running"}

