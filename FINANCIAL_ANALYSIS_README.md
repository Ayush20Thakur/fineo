# Financial Analysis Feature - Nova Financial Glow

## Overview

The Financial Analysis feature integrates all Python backend functionality into the React website, providing advanced financial insights, AI-powered forecasting, FairScore calculation, fairness auditing, and IBM Granite AI advisor integration.

## Features

### 🔍 PDF Passbook Upload & Parsing
- Upload bank passbook PDFs
- Automatic transaction parsing and categorization
- Support for multiple bank formats
- Real-time data extraction

### 📊 Dashboard Analytics
- Key Metrics: Balance, Inflow, Outflow, Savings Rate
- Category Allocation: Visual breakdown of spending categories
- Daily Cashflow: Time-series analysis of financial flows
- Recent Transactions: Detailed transaction history

### 🔮 AI-Powered Forecasting
- 60-day Cashflow Forecast using ARIMA models
- Confidence Intervals with upper and lower bounds
- Trend Analysis with historical pattern recognition
- Interactive forecasting graphs

### 🛡️ FairScore System
- Explainable Credit Scoring with gender-agnostic algorithm
- Feature Analysis: Payment history, utilization, savings rate
- Interactive Sliders for real-time score adjustment
- Contribution Breakdown with detailed scoring factors

### ⚖️ Fairness Audit
- Statistical Parity Difference (SPD) for bias detection
- Equal Opportunity (EO) fairness metrics
- Threshold Optimization with automated adjustment
- Audit Publishing to blockchain-style ledger

### 🤖 IBM Granite AI Advisor
- Natural Language Queries for financial questions
- Contextual Responses with personalized advice
- Action Recommendations with specific next steps
- Confidence Scoring for AI response reliability

## Setup Instructions

### 1. Environment Configuration
Create a `.env` file in the root directory:
```env
IBM_CLOUD_API_KEY=your_ibm_cloud_api_key_here
IBM_PROJECT_ID=your_ibm_project_id_here
IBM_REGION=https://eu-de.ml.cloud.ibm.com
GRANITE_MODEL_ID=ibm/granite-3-8b-instruct
PRIVATE_LEDGER_SALT=changeme
PRIVATE_LEDGER_ENC_KEY=your_encryption_key_here
```

### 2. Install Dependencies
```bash
# Python dependencies
pip install -r api_requirements.txt

# Node.js dependencies
npm install
```

### 3. Start Development Environment
```bash
# Use the provided script
start_dev.bat

# Or manually start both servers
python api_server.py  # Terminal 1
npm run dev          # Terminal 2
```

## Usage

1. Navigate to `/financial-analysis`
2. Upload your bank passbook PDF
3. Explore the 6 main tabs:
   - **Upload**: PDF upload and parsing
   - **Dashboard**: Key metrics and charts
   - **Forecast**: AI-powered cashflow prediction
   - **FairScore**: Credit scoring system
   - **Audit**: Fairness analysis
   - **Advisor**: IBM Granite AI assistance

## API Endpoints

- `GET /health` - API health check
- `POST /upload-pdf` - Upload and parse PDF
- `POST /analyze-transactions` - Analyze transaction data
- `POST /calculate-fairscore` - Calculate FairScore
- `POST /forecast-cashflow` - Generate cashflow forecast
- `POST /fairness-audit` - Run fairness audit
- `POST /publish-audit` - Publish audit to ledger
- `POST /ask-advisor` - Get AI advisor response

## Navigation

- Added to sidebar menu with Calculator icon
- Integrated with chatbot navigation
- Accessible from `/financial-analysis` route

## Troubleshooting

- Ensure both React app and Python API are running
- Check IBM Cloud credentials in `.env` file
- Verify PDF format compatibility
- Check browser console for errors

For full documentation, see the comprehensive README above.
