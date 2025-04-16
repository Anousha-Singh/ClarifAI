#!/bin/bash

# Create necessary directories
mkdir -p models uploads

# Install dependencies
pip install --no-cache-dir -r requirements.txt

# Start the FastAPI application with worker optimization for B1s tier
gunicorn -w 2 -k uvicorn.workers.UvicornWorker main:app --bind=0.0.0.0:8000 --timeout 120 --max-requests 100 --max-requests-jitter 10 --graceful-timeout 60