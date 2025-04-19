import torch
import torchvision.transforms as transforms
import cv2
import numpy as np
from facenet_pytorch import MTCNN
from PIL import Image

mtcnn = MTCNN(keep_all=True, device='cuda' if torch.cuda.is_available() else 'cpu')

def extract_faces_from_video(video_path, max_frames=32):
    cap = cv2.VideoCapture(video_path)
    faces = []
    frame_count = 0

    while cap.isOpened() and frame_count < max_frames:
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        boxes, _ = mtcnn.detect(frame_rgb)

        if boxes is not None:
            for box in boxes:
                x1, y1, x2, y2 = [int(b) for b in box]
                face = frame_rgb[y1:y2, x1:x2]
                face = Image.fromarray(face)
                faces.append(face)
                frame_count += 1
                break  # Take one face per frame

        if frame_count >= max_frames:
            break

    cap.release()
    return faces

def preprocess_faces(faces, image_size=112):
    transform = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])
    return torch.stack([transform(face) for face in faces])

def predict_from_video(model, video_path, device):
    faces = extract_faces_from_video(video_path)
    if len(faces) == 0:
        return {"error": "No faces detected in video"}

    # input_tensor = preprocess_faces(faces).unsqueeze(0).to(device)
    input_tensor = preprocess_faces(faces).to(device)  # shape: [seq_len, 3, 112, 112]
    input_tensor = input_tensor.unsqueeze(0)           # shape: [1, seq_len, 3, 112, 112]

    with torch.no_grad():
        _, output = model(input_tensor)
        probs = torch.softmax(output, dim=1).squeeze()
        predicted_class = torch.argmax(probs).item()
        confidence = probs[predicted_class].item()

    return {
        "class": int(predicted_class),
        "confidence": float(confidence)
    }
