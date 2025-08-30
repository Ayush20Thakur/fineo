from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

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

@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and parse passbook PDF"""
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        content = await file.read()
        
        # For demo purposes, return sample data
        # In production, you would parse the actual PDF
        sample_transactions = [
            {
                "date": "2024-01-01",
                "description": "SALARY CREDIT JAN",
                "ref": "REF123",
                "debit": 0.0,
                "credit": 50000.0,
                "balance": 50000.0,
                "category": "Income"
            },
            {
                "date": "2024-01-03",
                "description": "RENT PAYMENT",
                "ref": "REF124",
                "debit": 15000.0,
                "credit": 0.0,
                "balance": 35000.0,
                "category": "Housing"
            }
        ]
        
        return {
            "success": True,
            "transactions": sample_transactions,
            "count": len(sample_transactions)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

# For Vercel
def handler(request):
    return app(request)
