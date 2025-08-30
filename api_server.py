from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import io
import re
import base64
from cryptography.fernet import Fernet
import hashlib

from pydantic import BaseModel, Field

# Import backend services
import sys
sys.path.append('./backend')
from backend.app.services.pdf_ingest import parse_passbook_pdf
from backend.app.services.portfolio import summarize, auto_category
from backend.app.services.scoring import fairscore_v0
from backend.app.services.fairness import statistical_parity, equal_opportunity, threshold_shift
from backend.app.services.forecast import cashflow_forecast
from backend.app.services.ledgers import private_append
from backend.app.services.granite import advise, granite_ready

# ---------- Pydantic Models ----------
class Transaction(BaseModel):
    date: str
    description: str
    credit: float = 0.0
    debit: float = 0.0
    balance: float = 0.0
    category: str = ""
    ref: Optional[str] = None

class AnalyzeTransactionsRequest(BaseModel):
    transactions: List[Transaction]

class ForecastRequest(BaseModel):
    cashflow_data: List[Dict[str, Any]] = Field(default_factory=list)
    days: int = 60

class FairnessAuditRequest(BaseModel):
    female_scores: List[float]
    male_scores: List[float]
    threshold: int = 650
    tolerance: float = 0.05

class PublishAuditRequest(BaseModel):
    threshold: int
    spd: float
    eo: float
    tolerance: float
    recommended_threshold: int
    passed: bool

class AdvisorRequest(BaseModel):
    question: str
    context: Dict[str, Any]

app = FastAPI(title="Nova Financial Glow API", version="1.0.0")

# CORS middleware (credentials + explicit origins to avoid 400 on preflight)
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:8086",
    "http://127.0.0.1:8086",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
def load_env():
    env_vars = {}
    env_file = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            for line in f:
                if '=' in line and not line.strip().startswith('#'):
                    key, value = line.strip().split('=', 1)
                    env_vars[key] = value
    return env_vars

env_vars = load_env()

# Set environment variables for backend services
os.environ['IBM_CLOUD_API_KEY'] = env_vars.get('IBM_CLOUD_API_KEY', '')
OS_REGION_DEFAULT = 'https://eu-de.ml.cloud.ibm.com'
os.environ['IBM_PROJECT_ID'] = env_vars.get('IBM_PROJECT_ID', '')
os.environ['IBM_REGION'] = env_vars.get('IBM_REGION', OS_REGION_DEFAULT)
os.environ['GRANITE_MODEL_ID'] = env_vars.get('GRANITE_MODEL_ID', 'ibm/granite-3-8b-instruct')
os.environ['PRIVATE_LEDGER_SALT'] = env_vars.get('PRIVATE_LEDGER_SALT', 'changeme')
os.environ['PRIVATE_LEDGER_ENC_KEY'] = env_vars.get('PRIVATE_LEDGER_ENC_KEY', '')

@app.get("/")
async def root():
    return {"message": "Nova Financial Glow API Server"}

@app.get("/health")
async def health_check():
    try:
        g = granite_ready()
        return {"status": "healthy", "granite_ready": bool(g), "timestamp": datetime.now().isoformat()}
    except Exception:
        return {"status": "healthy", "granite_ready": False, "timestamp": datetime.now().isoformat()}

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and parse passbook PDF"""
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        content = await file.read()
        transactions = parse_passbook_pdf(content)
        if not transactions:
            raise HTTPException(status_code=400, detail="No transactions found in PDF")
        return {"success": True, "transactions": transactions, "count": len(transactions)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.get("/sample-transactions")
async def sample_transactions():
    """Parse and return transactions from bundled dummy PDF"""
    try:
        candidates = [
            os.path.join(os.path.dirname(__file__), 'backend', 'dummy_passbook_table.pdf'),
            os.path.join(os.getcwd(), 'backend', 'dummy_passbook_table.pdf'),
            os.path.join(os.path.dirname(__file__), 'backend python', 'dummy_passbook_table.pdf'),
            os.path.join(os.getcwd(), 'backend python', 'dummy_passbook_table.pdf'),
        ]
        sample_path = next((p for p in candidates if os.path.exists(p)), None)
        if not sample_path:
            raise HTTPException(status_code=404, detail="Sample PDF not found")
        with open(sample_path, 'rb') as f:
            content = f.read()
        transactions = parse_passbook_pdf(content)
        if not transactions:
            raise HTTPException(status_code=400, detail="No transactions found in sample PDF")
        return {"success": True, "transactions": transactions, "count": len(transactions)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading sample PDF: {str(e)}")

@app.post("/analyze-transactions")
async def analyze_transactions(req: AnalyzeTransactionsRequest):
    """Analyze transactions and generate summary"""
    try:
        transactions = [t.model_dump() for t in req.transactions]
        for txn in transactions:
            if not txn.get('category'):
                txn['category'] = auto_category(txn.get('description', ''))
        summary = summarize(transactions)
        features = extract_features_from_transactions(transactions)
        return {"success": True, "summary": summary, "features": features}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing transactions: {str(e)}")

def extract_features_from_transactions(transactions: List[Dict[str, Any]]) -> Dict[str, float]:
    if not transactions:
        return {"pay_hist": 0.7, "utilization": 0.4, "savings_rate": 0.2, "cashflow_var": 0.3, "history_len": 0.3, "sip_regularity": 0.5, "mandate_punctual": 0.7}
    inflow = sum(t.get('credit', 0) for t in transactions)
    outflow = sum(t.get('debit', 0) for t in transactions)
    savings_rate = max(inflow - outflow, 0) / max(inflow, 1e-6)
    loanish_patterns = ["emi", "loan", "card", "creditcard", "repay"]
    loanish_transactions = [t for t in transactions if any(pattern in (t.get('description', '') or '').lower() for pattern in loanish_patterns)]
    loanish_amount = sum(t.get('debit', 0) for t in loanish_transactions)
    utilization = min(loanish_amount / max(inflow, 1e-6), 1.0)
    daily_net: Dict[str, float] = {}
    for t in transactions:
        date = (t.get('date', '') or '').split(' ')[0]
        daily_net[date] = daily_net.get(date, 0.0) + float(t.get('credit', 0) or 0) - float(t.get('debit', 0) or 0)
    daily_values = list(daily_net.values())
    if len(daily_values) >= 5:
        denom = (np.mean([abs(v) for v in daily_values]) or 1.0) * 5
        cashflow_var = float(min(np.std(daily_values) / denom, 1.0))
    else:
        cashflow_var = 0.3
    unique_months = len(set((t.get('date', '') or '')[:7] for t in transactions))
    history_len = min(unique_months / 24.0, 1.0)
    sip_transactions = [t for t in transactions if any(p in (t.get('description', '') or '').lower() for p in ["sip", "mutual fund", "mf", "systematic"])]
    sip_months = len(set((t.get('date', '') or '')[:7] for t in sip_transactions))
    total_months = len(set((t.get('date', '') or '')[:7] for t in transactions))
    sip_regularity = min(sip_months / max(total_months, 1), 1.0)
    penalty_patterns = ["reversal", "penalty", "charge", "bounce", "return"]
    penalty_hits = sum(1 for t in transactions if any(pattern in (t.get('description', '') or '').lower() for pattern in penalty_patterns))
    mandate_punctual = max(0.9 - 0.05 * penalty_hits, 0.0)
    return {
        "pay_hist": round(0.85 + 0.1 * (savings_rate - 0.2), 2) if inflow > 0 else 0.7,
        "utilization": round(utilization, 2),
        "savings_rate": round(savings_rate, 2),
        "cashflow_var": round(cashflow_var, 2),
        "history_len": round(history_len, 2),
        "sip_regularity": round(sip_regularity, 2),
        "mandate_punctual": round(mandate_punctual, 2)
    }

@app.post("/calculate-fairscore")
async def calculate_fairscore(features: Dict[str, float] = Body(...)):
    try:
        score, contrib, version = fairscore_v0(features)
        return {"success": True, "score": score, "contributions": contrib, "version": version}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating FairScore: {str(e)}")

@app.post("/forecast-cashflow")
async def forecast_cashflow_endpoint(req: ForecastRequest):
    try:
        cashflow_data = req.cashflow_data or []
        days = req.days
        if not cashflow_data:
            return {"success": True, "forecast": {"dates": [], "mean": [0.0] * days, "lower": [0.0] * days, "upper": [0.0] * days}}
        df = pd.DataFrame(cashflow_data)
        series = pd.Series(df['amount'].values, index=pd.to_datetime(df['date']))
        mean, lower, upper = cashflow_forecast(series, days)
        last_date = pd.to_datetime(df['date'].iloc[-1])
        future_dates = [last_date + timedelta(days=i+1) for i in range(days)]
        return {"success": True, "forecast": {"dates": [d.strftime('%Y-%m-%d') for d in future_dates], "mean": mean, "lower": lower, "upper": upper}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating forecast: {str(e)}")

@app.post("/fairness-audit")
async def fairness_audit(req: FairnessAuditRequest):
    try:
        female_labels = [1] * len(req.female_scores)
        male_labels = [1] * len(req.male_scores)
        spd = statistical_parity(req.female_scores, req.male_scores, req.threshold)
        eo = equal_opportunity(female_labels, req.female_scores, male_labels, req.male_scores, req.threshold)
        recommended_k = threshold_shift(spd, eo, req.threshold, req.tolerance)
        return {"success": True, "spd": round(spd, 4), "eo": round(eo, 4), "threshold": req.threshold, "tolerance": req.tolerance, "recommended_threshold": recommended_k, "passed": abs(spd) <= req.tolerance and abs(eo) <= req.tolerance}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running fairness audit: {str(e)}")

@app.post("/publish-audit")
async def publish_audit(req: PublishAuditRequest):
    try:
        payload = {"version": "0.1", "k": req.threshold, "spd": req.spd, "eo": req.eo, "delta": req.tolerance, "recommended_k": req.recommended_threshold, "passed": req.passed, "timestamp": datetime.now().isoformat()}
        block_hash, payload_hash = private_append(payload)
        return {"success": True, "block_hash": block_hash, "payload_hash": payload_hash, "published": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error publishing audit: {str(e)}")

@app.post("/ask-advisor")
async def ask_advisor(req: AdvisorRequest):
    try:
        if not granite_ready():
            return {"success": False, "answer": "Granite credentials missing. Please check your IBM Cloud configuration.", "actions": [], "route": "/insights"}
        response = advise(req.question, req.context)
        return {"success": True, **response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error asking advisor: {str(e)}")

@app.get("/granite-status")
async def granite_status():
    return {"granite_ready": granite_ready(), "has_api_key": bool(env_vars.get('IBM_CLOUD_API_KEY')), "has_project_id": bool(env_vars.get('IBM_PROJECT_ID')), "region": env_vars.get('IBM_REGION', 'https://eu-de.ml.cloud.ibm.com'), "model_id": env_vars.get('GRANITE_MODEL_ID', 'ibm/granite-3-8b-instruct')}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
