import torch
import torchvision.transforms as transforms
import cv2
import numpy as np
import os
from facenet_pytorch import MTCNN
from PIL import Image
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Initialize MTCNN with error handling
def get_mtcnn(device):
    try:
        return MTCNN(keep_all=True, device=device)
    except Exception as e:
        logger.error(f"Failed to initialize MTCNN: {str(e)}")
        return None

def validate_video(video_path):
    """Validate video file before processing"""
    if not video_path or not os.path.exists(video_path):
        return False, "Video file not found"
    
    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return False, "Failed to open video file"
        
        # Check if video has frames
        ret, frame = cap.read()
        if not ret or frame is None:
            return False, "Video file is corrupted or empty"
            
        cap.release()
        return True, None
    except Exception as e:
        return False, f"Error validating video: {str(e)}"

def extract_faces_from_video(video_path, device, max_frames=32):
    try:
        # Validate video first
        is_valid, error_msg = validate_video(video_path)
        if not is_valid:
            return {"error": error_msg}

        # Initialize MTCNN
        mtcnn = get_mtcnn(device)
        if mtcnn is None:
            return {"error": "Failed to initialize face detection model"}
            
        cap = cv2.VideoCapture(video_path)
        faces = []
        frame_count = 0
        processing_errors = 0
        max_errors = 5  # Maximum number of frame processing errors before giving up

        while cap.isOpened() and frame_count < max_frames and processing_errors < max_errors:
            ret, frame = cap.read()
            if not ret:
                break

            try:
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                boxes, _ = mtcnn.detect(frame_rgb)

                if boxes is not None:
                    for box in boxes:
                        x1, y1, x2, y2 = [int(b) for b in box]
                        # Add boundary checks
                        x1, x2 = max(0, x1), min(frame_rgb.shape[1], x2)
                        y1, y2 = max(0, y1), min(frame_rgb.shape[0], y2)
                        
                        if x2 > x1 and y2 > y1:  # Ensure valid box dimensions
                            face = frame_rgb[y1:y2, x1:x2]
                            face = Image.fromarray(face)
                            faces.append(face)
                            frame_count += 1
                            break  # Take one face per frame

            except Exception as e:
                logger.error(f"Error processing frame: {str(e)}")
                processing_errors += 1
                continue

            if frame_count >= max_frames:
                break

        cap.release()
        
        if len(faces) == 0:
            return {"error": "No faces detected in the video"}
            
        if processing_errors >= max_errors:
            logger.warning(f"High number of frame processing errors: {processing_errors}")
            
        return faces
        
    except Exception as e:
        logger.error(f"Failed to process video: {str(e)}")
        return {"error": f"Failed to process video: {str(e)}"}

def preprocess_faces(faces, image_size=112):
    try:
        transform = transforms.Compose([
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                               std=[0.229, 0.224, 0.225])
        ])
        return torch.stack([transform(face) for face in faces])
    except Exception as e:
        logger.error(f"Failed to preprocess faces: {str(e)}")
        return None

def predict_from_video(model, video_path, device):
    try:
        # Extract faces
        faces = extract_faces_from_video(video_path, device)
        if isinstance(faces, dict) and "error" in faces:
            return faces

        # Preprocess faces
        input_tensor = preprocess_faces(faces)
        if input_tensor is None:
            return {"error": "Failed to preprocess faces"}
            
        input_tensor = input_tensor.to(device)
        input_tensor = input_tensor.unsqueeze(0)

        # Move model to the correct device
        model = model.to(device)

        with torch.no_grad():
            try:
                model.eval()
                _, output = model(input_tensor)
                probs = torch.softmax(output, dim=1).squeeze()
                predicted_class = torch.argmax(probs).item()
                confidence = probs[predicted_class].item()

                return {
                    "class": int(predicted_class),
                    "confidence": float(confidence)
                }
            except RuntimeError as e:
                if "out of memory" in str(e):
                    # Clear cache and try again with CPU
                    if torch.cuda.is_available():
                        torch.cuda.empty_cache()
                    logger.warning("GPU out of memory, falling back to CPU")
                    return predict_from_video(model, video_path, torch.device('cpu'))
                else:
                    logger.error(f"Model inference failed: {str(e)}")
                    return {"error": f"Model inference failed: {str(e)}"}
            except Exception as e:
                logger.error(f"Model inference failed: {str(e)}")
                return {"error": f"Model inference failed: {str(e)}"}

    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        return {"error": f"Prediction failed: {str(e)}"}
