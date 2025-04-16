#!/bin/bash

# Create necessary directories
mkdir -p models uploads

# Install dependencies
pip install -r requirements.txt

# Initialize virtual environment if needed
python -m venv antenv
source antenv/bin/activate || source antenv/Scripts/activate

# Download model if it doesn't exist
if [ ! -f "models/model.pt" ]; then
    python - << EOF
import gdown
import os
FILE_ID = "15XBuoqkHbr9lNX6izXVh6wVlji90RQ26"
MODEL_PATH = "models/model.pt"
if not os.path.exists(MODEL_PATH):
    download_url = f"https://drive.google.com/uc?id={FILE_ID}"
    gdown.download(download_url, MODEL_PATH, quiet=False)
EOF
fi

# Start the application using gunicorn
exec gunicorn main:app --bind=0.0.0.0:8000 --timeout 600 --workers=4 --worker-class=uvicorn.workers.UvicornWorker