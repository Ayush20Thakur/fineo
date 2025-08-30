# Fineo - Nova Financial Glow

A comprehensive financial analysis platform powered by AI, featuring PDF passbook parsing, credit scoring, fairness auditing, and AI-powered financial advisory services.

## 🌟 Features

- **📄 PDF Passbook Analysis**: Upload and parse bank passbook PDFs to extract transaction data
- **📊 Financial Dashboard**: Comprehensive analytics and insights from transaction data
- **🤖 AI-Powered Forecasting**: Predict future cashflow patterns using advanced algorithms
- **⚖️ FairScore System**: Ethical credit scoring with bias detection and fairness metrics
- **🔍 Fairness Audit**: Statistical parity and equal opportunity analysis
- **💡 IBM Granite AI Advisor**: Get personalized financial advice powered by IBM's Granite AI
- **🔐 Private Ledger**: Secure audit trail with cryptographic verification

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fineo.git
   cd fineo
   ```

2. **Install dependencies**
   ```bash
   # Install Node.js dependencies
   npm install
   
   # Install Python dependencies
   pip install -r api_requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your IBM Cloud credentials
   # IBM_CLOUD_API_KEY=your_api_key_here
   # IBM_PROJECT_ID=your_project_id_here
   ```

4. **Start the application**
   ```bash
   # Option 1: Use the batch script (Windows)
   start_dev.bat
   
   # Option 2: Start manually
   # Terminal 1: Start Python API Server
   python api_server.py
   
   # Terminal 2: Start React App
   npm run dev
   ```

## 📍 Access Points

- **Frontend Application**: http://localhost:8086
- **API Server**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Recharts** for data visualization
- **React Router** for navigation

### Backend
- **FastAPI** for REST API
- **Python 3.8+** with modern async/await
- **pandas** for data processing
- **scikit-learn** for machine learning
- **IBM Watsonx AI** for Granite AI integration
- **pdfplumber** for PDF parsing

## 📊 API Endpoints

- `GET /health` - API health check and Granite status
- `POST /upload-pdf` - Upload and parse PDF passbook
- `GET /sample-transactions` - Load sample transaction data
- `POST /analyze-transactions` - Analyze transaction patterns
- `POST /calculate-fairscore` - Calculate FairScore rating
- `POST /forecast-cashflow` - Generate cashflow predictions
- `POST /fairness-audit` - Run bias detection audit
- `POST /publish-audit` - Publish audit to private ledger
- `POST /ask-advisor` - Get AI-powered financial advice

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# IBM Cloud Credentials for Granite AI
IBM_CLOUD_API_KEY=your_api_key_here
IBM_PROJECT_ID=your_project_id_here
IBM_REGION=https://eu-de.ml.cloud.ibm.com
GRANITE_MODEL_ID=ibm/granite-3-8b-instruct

# Private Ledger Configuration
PRIVATE_LEDGER_SALT=your_salt_here
PRIVATE_LEDGER_ENC_KEY=your_encryption_key_here
```

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Test backend API
python test_backend.py
```

## 📁 Project Structure

```
fineo/
├── src/                    # React frontend source
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions
├── backend/               # Python backend services
│   └── app/
│       └── services/      # Core business logic
├── public/                # Static assets
├── api_server.py          # FastAPI server entry point
├── package.json           # Node.js dependencies
└── api_requirements.txt   # Python dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- IBM Watsonx AI for Granite AI capabilities
- shadcn/ui for beautiful UI components
- The open-source community for amazing tools and libraries

## 📞 Support

For support, email support@fineo.com or create an issue in this repository.
