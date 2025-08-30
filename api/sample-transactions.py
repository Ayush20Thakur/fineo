from fastapi import FastAPI, HTTPException
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

@app.get("/api/sample-transactions")
async def sample_transactions():
    """Return sample transaction data"""
    try:
        # Comprehensive sample transaction data for demo
        sample_data = [
            {"date": "2024-01-01", "description": "SALARY CREDIT JAN", "ref": "REF123", "debit": 0.0, "credit": 50000.0, "balance": 50000.0, "category": "Income"},
            {"date": "2024-01-03", "description": "RENT PAYMENT", "ref": "REF124", "debit": 15000.0, "credit": 0.0, "balance": 35000.0, "category": "Housing"},
            {"date": "2024-01-05", "description": "GROCERY STORE", "ref": "REF125", "debit": 2500.0, "credit": 0.0, "balance": 32500.0, "category": "Food"},
            {"date": "2024-01-07", "description": "FUEL STATION", "ref": "REF126", "debit": 3000.0, "credit": 0.0, "balance": 29500.0, "category": "Transportation"},
            {"date": "2024-01-10", "description": "SIP MUTUAL FUND", "ref": "REF127", "debit": 5000.0, "credit": 0.0, "balance": 24500.0, "category": "Investment"},
            {"date": "2024-01-12", "description": "ONLINE SHOPPING", "ref": "REF128", "debit": 4500.0, "credit": 0.0, "balance": 20000.0, "category": "Shopping"},
            {"date": "2024-01-15", "description": "ELECTRICITY BILL", "ref": "REF129", "debit": 1200.0, "credit": 0.0, "balance": 18800.0, "category": "Utilities"},
            {"date": "2024-01-18", "description": "RESTAURANT", "ref": "REF130", "debit": 2800.0, "credit": 0.0, "balance": 16000.0, "category": "Food"},
            {"date": "2024-01-20", "description": "MEDICAL EXPENSE", "ref": "REF131", "debit": 3500.0, "credit": 0.0, "balance": 12500.0, "category": "Healthcare"},
            {"date": "2024-01-22", "description": "FREELANCE INCOME", "ref": "REF132", "debit": 0.0, "credit": 15000.0, "balance": 27500.0, "category": "Income"},
            {"date": "2024-01-25", "description": "INSURANCE PREMIUM", "ref": "REF133", "debit": 2000.0, "credit": 0.0, "balance": 25500.0, "category": "Insurance"},
            {"date": "2024-01-28", "description": "MOBILE RECHARGE", "ref": "REF134", "debit": 500.0, "credit": 0.0, "balance": 25000.0, "category": "Utilities"},
            {"date": "2024-01-30", "description": "SAVINGS TRANSFER", "ref": "REF135", "debit": 10000.0, "credit": 0.0, "balance": 15000.0, "category": "Savings"}
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
