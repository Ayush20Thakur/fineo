from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/api/sample-transactions")
async def sample_transactions():
    """Return sample transaction data"""
    try:
        # Sample transaction data for demo
        sample_data = [
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
            },
            {
                "date": "2024-01-05",
                "description": "GROCERY STORE",
                "ref": "REF125",
                "debit": 2500.0,
                "credit": 0.0,
                "balance": 32500.0,
                "category": "Food"
            },
            {
                "date": "2024-01-10",
                "description": "SIP MUTUAL FUND",
                "ref": "REF126",
                "debit": 5000.0,
                "credit": 0.0,
                "balance": 27500.0,
                "category": "Investment"
            },
            {
                "date": "2024-01-15",
                "description": "ELECTRICITY BILL",
                "ref": "REF127",
                "debit": 1200.0,
                "credit": 0.0,
                "balance": 26300.0,
                "category": "Utilities"
            }
        ]
        
        return {
            "success": True,
            "transactions": sample_data,
            "count": len(sample_data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading sample data: {str(e)}")

# For Vercel
def handler(request):
    return app(request)
