import torch
import torchvision.transforms as transforms
import cv2
import numpy as np
from facenet_pytorch import MTCNN
from PIL import Image

mtcnn = MTCNN(keep_all=True, device='cuda' if torch.cuda.is_available() else 'cpu')

def extract_faces_from_video(video_path, max_frames=32):
    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return {"error": "Failed to open video file"}
            
        faces = []
        frame_count = 0

        while cap.isOpened() and frame_count < max_frames:
            ret, frame = cap.read()
            if not ret:
                break

            try:
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

            except Exception as e:
                print(f"Error processing frame: {str(e)}")
                continue

            if frame_count >= max_frames:
                break

        cap.release()
        
        if len(faces) == 0:
            return {"error": "No faces detected in the video"}
            
        return faces
        
    except Exception as e:
        return {"error": f"Failed to process video: {str(e)}"}

def preprocess_faces(faces, image_size=112):
    transform = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])
    return torch.stack([transform(face) for face in faces])

def predict_from_video(model, video_path, device):
    try:
        faces = extract_faces_from_video(video_path)
        if isinstance(faces, dict) and "error" in faces:
            return faces

        # input_tensor = preprocess_faces(faces).unsqueeze(0).to(device)
        input_tensor = preprocess_faces(faces).to(device)  # shape: [seq_len, 3, 112, 112]
        input_tensor = input_tensor.unsqueeze(0)           # shape: [1, seq_len, 3, 112, 112]

        with torch.no_grad():
            try:
                _, output = model(input_tensor)
                probs = torch.softmax(output, dim=1).squeeze()
                predicted_class = torch.argmax(probs).item()
                confidence = probs[predicted_class].item()

                return {
                    "class": int(predicted_class),
                    "confidence": float(confidence)
                }
            except Exception as e:
                return {"error": f"Model inference failed: {str(e)}"}

    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}



##### Cannot use this code as it is not working #####
# import torch
# import cv2
# import numpy as np
# from torchvision import transforms
# from torch.utils.data import Dataset
# import face_recognition

# # Image preprocessing settings
# im_size = 112
# mean = [0.485, 0.456, 0.406]
# std = [0.229, 0.224, 0.225]

# train_transforms = transforms.Compose([
#     transforms.ToPILImage(),
#     transforms.Resize((im_size, im_size)),
#     transforms.ToTensor(),
#     transforms.Normalize(mean, std)
# ])

# # Custom dataset class for extracting and transforming video frames
# class VideoFaceDataset(Dataset):
#     def __init__(self, video_path, sequence_length=20, transform=None):
#         self.video_path = video_path
#         self.transform = transform
#         self.sequence_length = sequence_length

#     def __len__(self):
#         return 1

#     # def __getitem__(self, idx):
#     #     frames = []
#     #     cap = cv2.VideoCapture(self.video_path)
#     #     success, frame = cap.read()
#     #     while success and len(frames) < self.sequence_length:
#     #         faces = face_recognition.face_locations(frame)
#     #         if faces:
#     #             try:
#     #                 top, right, bottom, left = faces[0]
#     #                 face_img = frame[top:bottom, left:right, :]
#     #                 if self.transform:
#     #                     face_img = self.transform(face_img)
#     #                 frames.append(face_img)
#     #             except:
#     #                 pass
#     #         success, frame = cap.read()
#     #     cap.release()

#     #     # Pad with zeros if not enough frames
#     #     while len(frames) < self.sequence_length:
#     #         frames.append(torch.zeros_like(frames[0]))

#     #     return torch.stack(frames).unsqueeze(0)  # shape: (1, seq_len, C, H, W)
#     def __getitem__(self, idx):
#         frames = []
#         cap = cv2.VideoCapture(self.video_path)
#         success, frame = cap.read()

#         while success and len(frames) < self.sequence_length:
#             if frame is None or frame.size == 0:
#                 success, frame = cap.read()
#                 continue

#             try:
#                 rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#             except Exception as e:
#                 print("Color conversion failed:", e)
#                 success, frame = cap.read()
#                 continue

#             try:
#                 faces = face_recognition.face_locations(rgb_frame)
#             except Exception as e:
#                 print("face_recognition failed:", e)
#                 success, frame = cap.read()
#                 continue

#             if faces:
#                 try:
#                     top, right, bottom, left = faces[0]
#                     face_img = rgb_frame[top:bottom, left:right, :]
#                     if self.transform:
#                         face_img = self.transform(face_img)
#                     frames.append(face_img)
#                 except Exception as e:
#                     print("Cropping or transform failed:", e)

#             success, frame = cap.read()

#         cap.release()

#         if not frames:
#             raise ValueError("No faces were detected in any frame of the video.")

#         while len(frames) < self.sequence_length:
#             frames.append(torch.zeros_like(frames[0]))

#         return torch.stack(frames).unsqueeze(0)  # shape: (1, seq_len, C, H, W)



# # Prediction function with heatmap disabled
# def predict_from_video(model, video_path, device):
#     dataset = VideoFaceDataset(video_path, transform=train_transforms)
#     video_tensor = dataset[0].to(device)

#     model.eval()
#     with torch.no_grad():
#         _, output = model(video_tensor)
#         probs = torch.softmax(output, dim=1).squeeze()
#         predicted_class = torch.argmax(probs).item()
#         confidence = probs[predicted_class].item()

#     return {
#         "class": int(predicted_class),
#         "confidence": float(confidence)
#     }
