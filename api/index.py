from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Fineo API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Fineo API Server - Deployed on Vercel"}

@app.get("/api")
async def api_root():
    return {"message": "Fineo API Server - Deployed on Vercel"}

# For Vercel
def handler(request):
    return app(request)
