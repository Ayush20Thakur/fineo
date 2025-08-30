from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/granite-status")
async def granite_status():
    """Check IBM Granite AI status"""
    has_api_key = bool(os.environ.get('IBM_CLOUD_API_KEY'))
    has_project_id = bool(os.environ.get('IBM_PROJECT_ID'))
    
    return {
        "granite_ready": has_api_key and has_project_id,
        "has_api_key": has_api_key,
        "has_project_id": has_project_id,
        "region": os.environ.get('IBM_REGION', 'https://eu-de.ml.cloud.ibm.com'),
        "model_id": os.environ.get('GRANITE_MODEL_ID', 'ibm/granite-3-8b-instruct')
    }

# For Vercel
def handler(request):
    return app(request)
