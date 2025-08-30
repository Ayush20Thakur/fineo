from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Transaction(BaseModel):
    date: str
    description: str
    credit: float = 0.0
    debit: float = 0.0
    balance: float = 0.0
    category: str = ""
    ref: str = ""

class AnalyzeTransactionsRequest(BaseModel):
    transactions: List[Transaction]

def auto_category(description: str) -> str:
    """Simple categorization based on description keywords"""
    desc_lower = description.lower()
    
    if any(word in desc_lower for word in ['salary', 'income', 'freelance', 'bonus']):
        return 'Income'
    elif any(word in desc_lower for word in ['rent', 'mortgage', 'housing']):
        return 'Housing'
    elif any(word in desc_lower for word in ['grocery', 'food', 'restaurant', 'cafe']):
        return 'Food'
    elif any(word in desc_lower for word in ['fuel', 'gas', 'transport', 'uber', 'taxi']):
        return 'Transportation'
    elif any(word in desc_lower for word in ['sip', 'mutual', 'investment', 'stock']):
        return 'Investment'
    elif any(word in desc_lower for word in ['electricity', 'water', 'mobile', 'internet']):
        return 'Utilities'
    elif any(word in desc_lower for word in ['medical', 'hospital', 'pharmacy', 'doctor']):
        return 'Healthcare'
    elif any(word in desc_lower for word in ['insurance', 'premium']):
        return 'Insurance'
    elif any(word in desc_lower for word in ['shopping', 'amazon', 'flipkart', 'store']):
        return 'Shopping'
    elif any(word in desc_lower for word in ['savings', 'deposit', 'fd']):
        return 'Savings'
    else:
        return 'Other'

def summarize_transactions(transactions: List[Dict]) -> Dict[str, Any]:
    """Generate summary statistics from transactions"""
    if not transactions:
        return {}
    
    total_credit = sum(t.get('credit', 0) for t in transactions)
    total_debit = sum(t.get('debit', 0) for t in transactions)
    net_flow = total_credit - total_debit
    
    # Category-wise breakdown
    category_spending = {}
    for t in transactions:
        category = t.get('category', 'Other')
        debit = t.get('debit', 0)
        if debit > 0:
            category_spending[category] = category_spending.get(category, 0) + debit
    
    # Calculate savings rate
    savings_rate = max(0, net_flow / total_credit) if total_credit > 0 else 0
    
    return {
        'total_income': total_credit,
        'total_expenses': total_debit,
        'net_flow': net_flow,
        'savings_rate': round(savings_rate, 3),
        'transaction_count': len(transactions),
        'category_breakdown': category_spending,
        'avg_transaction': round(total_debit / len(transactions), 2) if transactions else 0
    }

@app.post("/api/analyze-transactions")
async def analyze_transactions(req: AnalyzeTransactionsRequest):
    """Analyze transactions and generate summary"""
    try:
        transactions = [t.dict() for t in req.transactions]
        
        # Auto-categorize transactions
        for txn in transactions:
            if not txn.get('category'):
                txn['category'] = auto_category(txn.get('description', ''))
        
        # Generate summary
        summary = summarize_transactions(transactions)
        
        # Generate basic features for scoring
        features = {
            "pay_hist": 0.85,
            "utilization": 0.3,
            "savings_rate": summary.get('savings_rate', 0.2),
            "cashflow_var": 0.25,
            "history_len": 0.8,
            "sip_regularity": 0.6,
            "mandate_punctual": 0.9
        }
        
        return {
            "success": True,
            "summary": summary,
            "features": features,
            "categorized_transactions": transactions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing transactions: {str(e)}")

# For Vercel
def handler(request):
    return app(request)
