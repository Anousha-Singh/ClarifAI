#!/bin/bash

# Enable error reporting
set -e

# Create necessary directories
mkdir -p models uploads

# Install dependencies
python -m pip install --no-cache-dir -r requirements.txt

# Download model if it doesn't exist
if [ ! -f "models/model.pt" ]; then
    python3 - << EOF
import gdown
import os
FILE_ID = "15XBuoqkHbr9lNX6izXVh6wVlji90RQ26"
MODEL_PATH = "models/model.pt"
if not os.path.exists(MODEL_PATH):
    download_url = f"https://drive.google.com/uc?id={FILE_ID}"
    gdown.download(download_url, MODEL_PATH, quiet=False)
EOF
fi

# Start FastAPI application with uvicorn
exec uvicorn main:app --host 0.0.0.0 --port $PORT