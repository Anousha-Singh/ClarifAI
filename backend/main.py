from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse 
import torch
import shutil
import os
import time
import logging
from model_class import Model
from predict_utils import predict_from_video
import gdown
import traceback

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

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://clarifai-omega.vercel.app"],
    allow_credentials=False,  # Set to False since we're not using credentials
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,  # Cache preflight requests for 24 hours
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

# Add maximum file size (50MB)
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB in bytes

@app.post("/predict")
async def predict(video: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    try:
        # Log request details
        logger.info(f"Received video upload request: {video.filename}")
        
        # Check file size
        file_size = 0
        contents = await video.read()
        file_size = len(contents)
        await video.seek(0)  # Reset file position
        
        if file_size > MAX_FILE_SIZE:
            logger.warning(f"File too large: {file_size} bytes")
            return JSONResponse(
                status_code=400,
                content={"error": f"File size exceeds maximum limit of {MAX_FILE_SIZE//1024//1024}MB"}
            )
        
        # Validate file type
        if not video.filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
            logger.warning(f"Invalid file format: {video.filename}")
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid file format. Please upload a video file."}
            )

        # Ensure model is loaded
        try:
            current_model = get_model()
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}\n{traceback.format_exc()}")
            return JSONResponse(
                status_code=500,
                content={"error": "Failed to load the model"}
            )

        file_path = os.path.join(UPLOAD_DIR, video.filename)
        
        # Save uploaded file
        try:
            with open(file_path, "wb") as buffer:
                buffer.write(contents)
            logger.info(f"Video saved successfully to {file_path}")
        except Exception as e:
            logger.error(f"Failed to save video file: {str(e)}\n{traceback.format_exc()}")
            return JSONResponse(
                status_code=500,
                content={"error": f"Failed to save video file: {str(e)}"}
            )

        # Process video
        try:
            logger.info("Starting video processing")
            result = predict_from_video(current_model, file_path, torch.device('cuda' if torch.cuda.is_available() else 'cpu'))
            logger.info(f"Video processing completed: {result}")
        except Exception as e:
            logger.error(f"Failed to process video: {str(e)}\n{traceback.format_exc()}")
            return JSONResponse(
                status_code=500,
                content={"error": f"Failed to process video: {str(e)}"}
            )
        finally:
            # Clean up the uploaded file
            try:
                os.remove(file_path)
                logger.info(f"Cleaned up temporary file: {file_path}")
            except Exception as e:
                logger.error(f"Failed to clean up file: {str(e)}")

        # Validate result format
        if isinstance(result, dict) and "error" in result:
            logger.error(f"Error in prediction result: {result['error']}")
            return JSONResponse(
                status_code=400,
                content={"error": result["error"]}
            )

        if not isinstance(result, dict) or "class" not in result or "confidence" not in result:
            logger.error(f"Invalid prediction result format: {result}")
            return JSONResponse(
                status_code=500,
                content={"error": "Invalid prediction result format"}
            )

        label = "fake" if result["class"] == 1 else "real"
        confidence = float(result["confidence"])  # Ensure confidence is a float

        # Schedule cleanup
        if background_tasks:
            background_tasks.add_task(cleanup_resources)
            logger.info("Scheduled resource cleanup")

        logger.info(f"Successful prediction: {label} with confidence {confidence}")
        return JSONResponse(
            status_code=200,
            content={
                "prediction": label,
                "confidence": confidence
            }
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"error": f"An unexpected error occurred: {str(e)}"}
        )

@app.get("/")
def read_root():
    return {"message": "Deepfake Detection API is running"}

