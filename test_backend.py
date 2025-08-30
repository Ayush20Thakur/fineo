#!/usr/bin/env python3
"""
Test script to verify all backend functionality is working
"""

import sys
import os
sys.path.append('./backend')

def test_imports():
    """Test if all backend modules can be imported"""
    print("Testing backend imports...")
    
    try:
        from backend.app.services.pdf_ingest import parse_passbook_pdf
        print("✅ PDF ingest module imported successfully")
    except Exception as e:
        print(f"❌ PDF ingest import failed: {e}")
    
    try:
        from backend.app.services.portfolio import summarize, auto_category
        print("✅ Portfolio module imported successfully")
    except Exception as e:
        print(f"❌ Portfolio import failed: {e}")
    
    try:
        from backend.app.services.scoring import fairscore_v0
        print("✅ Scoring module imported successfully")
    except Exception as e:
        print(f"❌ Scoring import failed: {e}")
    
    try:
        from backend.app.services.fairness import statistical_parity, equal_opportunity, threshold_shift
        print("✅ Fairness module imported successfully")
    except Exception as e:
        print(f"❌ Fairness import failed: {e}")
    
    try:
        from backend.app.services.forecast import cashflow_forecast
        print("✅ Forecast module imported successfully")
    except Exception as e:
        print(f"❌ Forecast import failed: {e}")
    
    try:
        from backend.app.services.ledgers import private_append
        print("✅ Ledgers module imported successfully")
    except Exception as e:
        print(f"❌ Ledgers import failed: {e}")
    
    try:
        from backend.app.services.granite import advise, granite_ready
        print("✅ Granite module imported successfully")
    except Exception as e:
        print(f"❌ Granite import failed: {e}")

def test_basic_functionality():
    """Test basic functionality of each module"""
    print("\nTesting basic functionality...")
    
    # Test auto_category
    try:
        from backend.app.services.portfolio import auto_category
        result = auto_category("Salary credit")
        print(f"✅ Auto category test: 'Salary credit' -> {result}")
    except Exception as e:
        print(f"❌ Auto category test failed: {e}")
    
    # Test FairScore calculation
    try:
        from backend.app.services.scoring import fairscore_v0
        features = {
            "pay_hist": 0.8,
            "utilization": 0.3,
            "savings_rate": 0.4,
            "cashflow_var": 0.2,
            "history_len": 0.6,
            "sip_regularity": 0.7,
            "mandate_punctual": 0.9,
            "threshold_k": 650
        }
        score, contrib, version = fairscore_v0(features)
        print(f"✅ FairScore test: Score = {score}, Version = {version}")
    except Exception as e:
        print(f"❌ FairScore test failed: {e}")
    
    # Test fairness functions
    try:
        from backend.app.services.fairness import statistical_parity, equal_opportunity
        female_scores = [720, 680, 690, 710, 700]
        male_scores = [680, 720, 690, 700, 710]
        spd = statistical_parity(female_scores, male_scores, 650)
        print(f"✅ Fairness test: SPD = {spd}")
    except Exception as e:
        print(f"❌ Fairness test failed: {e}")

def test_environment():
    """Test environment variables"""
    print("\nTesting environment variables...")
    
    required_vars = [
        'IBM_CLOUD_API_KEY',
        'IBM_PROJECT_ID',
        'IBM_REGION',
        'GRANITE_MODEL_ID'
    ]
    
    for var in required_vars:
        value = os.environ.get(var)
        if value:
            print(f"✅ {var}: {'*' * len(value)} (set)")
        else:
            print(f"❌ {var}: Not set")

def test_granite_status():
    """Test IBM Granite status"""
    print("\nTesting IBM Granite status...")
    
    try:
        from backend.app.services.granite import granite_ready
        status = granite_ready()
        print(f"✅ Granite ready: {status}")
    except Exception as e:
        print(f"❌ Granite status check failed: {e}")

if __name__ == "__main__":
    print("🧪 Testing Nova Financial Glow Backend")
    print("=" * 50)
    
    test_imports()
    test_basic_functionality()
    test_environment()
    test_granite_status()
    
    print("\n" + "=" * 50)
    print("✅ Backend testing completed!")

