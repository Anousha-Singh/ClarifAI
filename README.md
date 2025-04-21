# 🎭 Deepfake Detection System

This project detects deepfake videos using a PyTorch-based model (ResNeXt + LSTM). It features:

- A **FastAPI backend** that processes uploaded videos, detects faces with **MTCNN**, and runs inference.
- A **Next.js frontend** where users can upload videos and see predictions.

---

Dataset Link: https://github.com/yuezunli/celeb-deepfakeforensics

## 📁 Folder Structure

```
ClarifAI/
├── backend/
│   ├── main.py
│   ├── model_class.py
│   ├── predict_utils.py
│   └── model.pt
│   
├── src/app
│   └── frontend conponents
├── README.md 
└── Other setup files
```

---

## ⚙️ Backend Setup (FastAPI + PyTorch)

### 1. Create and activate a virtual environment

```bash
python -m venv venv
backend\venv\Scripts\activate  # In command prompt
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the backend

```bash
uvicorn main:app --reload  # In command prompt with venv activated
```

- The backend will run at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 💻 Frontend Setup (Next.js)

### 1. Install dependencies

```bash
cd ClarifAI
npm install
```

### 2. Run the frontend

```bash
npm run dev
```

- The frontend will run at: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoint

### `POST /predict`

Accepts: MP4 file (video)  
Returns:
```json
{
  "prediction": {
    "class": 1,
    "confidence": 0.948
  }
}
```

- `class`: `0 = Real`, `1 = Fake`
- `confidence`: Float value (0 to 1) showing model certainty

---

<!-- ## 🧠 Model Overview

- **Backbone**: ResNeXt-50
- **Temporal Modeling**: LSTM
- **Face Detection**: MTCNN (via `facenet-pytorch`)
- **Preprocessing**: Resize to 224x224, Normalize, Stack
- **Input**: Up to 32 detected faces per video -->

---

## 🧪 Example Output

If a deepfake is detected:
```json
{
  "prediction": {
    "class": 1,
    "confidence": 0.97
  }
}
```

---

## ✅ Requirements

- Python 3.8 – 3.12
- Node.js (for frontend)
- `facenet-pytorch`, `torch`, `opencv-python`, `fastapi`, `uvicorn`, etc.

---




<!-- backend\venv\Scripts\activate   (cmd) /clarifAI

uvicorn backend.main:app --reload -->

<!-- uvicorn backend.main:app --host 0.0.0.0 --port 3000 -->
