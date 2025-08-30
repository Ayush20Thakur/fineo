from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os
import sys

# Add backend to path
sys.path.append('../backend')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    try:
        # Check if IBM credentials are available
        has_api_key = bool(os.environ.get('IBM_CLOUD_API_KEY'))
        has_project_id = bool(os.environ.get('IBM_PROJECT_ID'))
        granite_ready = has_api_key and has_project_id
        
        return {
            "status": "healthy",
            "granite_ready": granite_ready,
            "timestamp": datetime.now().isoformat(),
            "environment": "vercel"
        }
    except Exception as e:
        return {
            "status": "healthy",
            "granite_ready": False,
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }

# For Vercel
def handler(request):
    return app(request)
