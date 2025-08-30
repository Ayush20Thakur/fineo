from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def calculate_fairscore(features: Dict[str, float]) -> tuple:
    """
    Calculate FairScore based on financial features
    Returns: (score, contributions, version)
    """
    # Weights for different features
    weights = {
        "pay_hist": 0.35,        # Payment history (35%)
        "utilization": 0.30,     # Credit utilization (30%)
        "savings_rate": 0.15,    # Savings rate (15%)
        "cashflow_var": 0.10,    # Cashflow variability (10%)
        "history_len": 0.05,     # Credit history length (5%)
        "sip_regularity": 0.03,  # SIP regularity (3%)
        "mandate_punctual": 0.02 # Mandate punctuality (2%)
    }
    
    # Calculate weighted score
    score = 0
    contributions = {}
    
    for feature, weight in weights.items():
        feature_value = features.get(feature, 0.5)  # Default to 0.5 if missing
        
        # Normalize feature value to 0-1 range if needed
        if feature == "utilization":
            # Lower utilization is better, so invert
            normalized_value = max(0, 1 - feature_value)
        elif feature == "cashflow_var":
            # Lower variability is better, so invert
            normalized_value = max(0, 1 - feature_value)
        else:
            # Higher values are better
            normalized_value = min(1, max(0, feature_value))
        
        contribution = normalized_value * weight * 850  # Scale to 850 max
        contributions[feature] = round(contribution, 1)
        score += contribution
    
    # Ensure score is within valid range (300-850)
    final_score = max(300, min(850, round(score)))
    
    return final_score, contributions, "v1.0"

@app.post("/api/calculate-fairscore")
async def calculate_fairscore_endpoint(features: Dict[str, float] = Body(...)):
    """Calculate FairScore based on financial features"""
    try:
        score, contributions, version = calculate_fairscore(features)
        
        # Determine score category
        if score >= 750:
            category = "Excellent"
            color = "#22c55e"  # Green
        elif score >= 700:
            category = "Good"
            color = "#3b82f6"  # Blue
        elif score >= 650:
            category = "Fair"
            color = "#f59e0b"  # Yellow
        elif score >= 600:
            category = "Poor"
            color = "#ef4444"  # Red
        else:
            category = "Very Poor"
            color = "#dc2626"  # Dark Red
        
        return {
            "success": True,
            "score": score,
            "category": category,
            "color": color,
            "contributions": contributions,
            "version": version,
            "max_score": 850,
            "min_score": 300
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating FairScore: {str(e)}")

# For Vercel
def handler(request):
    return app(request)
