# Vercel Deployment Guide for Fineo

This guide will help you deploy your Fineo financial analysis platform on Vercel with both frontend and backend components.

## 🚀 Deployment Overview

Fineo consists of:
- **Frontend**: React app (will be deployed as main Vercel project)
- **Backend**: FastAPI server (will be deployed as Vercel serverless functions)

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code is already at https://github.com/Ayush20Thakur/fineo
3. **IBM Cloud Credentials**: For Granite AI features

## 🎯 Step 1: Prepare Backend for Vercel

First, we need to create a Vercel-compatible API structure:

### Create `api/` directory structure:
```
api/
├── index.py                 # Main API entry point
├── upload-pdf.py           # PDF upload endpoint
├── sample-transactions.py  # Sample data endpoint
├── analyze-transactions.py # Transaction analysis
├── calculate-fairscore.py  # FairScore calculation
├── forecast-cashflow.py    # Cashflow forecasting
├── fairness-audit.py       # Fairness audit
├── publish-audit.py        # Audit publishing
├── ask-advisor.py          # AI advisor
├── granite-status.py       # Granite status
└── health.py              # Health check
```

### Create `vercel.json` configuration:
```json
{
  "builds": [
    {
      "src": "api/*.py",
      "use": "@vercel/python"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "functions": {
    "api/*.py": {
      "runtime": "python3.9"
    }
  }
}
```

### Create `requirements.txt` for Vercel:
```txt
fastapi==0.104.1
python-multipart==0.0.6
pandas==2.1.3
numpy==1.24.3
statsmodels==0.14.0
pdfplumber==0.10.2
cryptography==41.0.7
python-dotenv==1.0.0
scikit-learn==1.3.2
matplotlib==3.8.2
seaborn==0.13.0
plotly==5.17.0
joblib==1.3.2
reportlab==4.0.7
```

## 🎯 Step 2: Update Frontend Configuration

### Update API base URL for production:

Create `src/config/api.ts`:
```typescript
const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api'  // Vercel serverless functions
  : 'http://localhost:8000';  // Local development

export { API_BASE };
```

### Update `package.json` build script:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "vercel-build": "npm run build"
  }
}
```

## 🎯 Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import from GitHub**:
   - Select your repository: `Ayush20Thakur/fineo`
   - Click "Import"
4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables** (click "Add"):
   ```
   IBM_CLOUD_API_KEY=your_api_key_here
   IBM_PROJECT_ID=your_project_id_here
   IBM_REGION=https://eu-de.ml.cloud.ibm.com
   GRANITE_MODEL_ID=ibm/granite-3-8b-instruct
   PRIVATE_LEDGER_SALT=changeme
   PRIVATE_LEDGER_ENC_KEY=your_encryption_key_here
   ```
6. **Click "Deploy"**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: fineo
# - Directory: ./
# - Override settings? N

# Deploy to production
vercel --prod
```

## 🎯 Step 4: Configure Environment Variables

In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add all required variables:
   - `IBM_CLOUD_API_KEY`
   - `IBM_PROJECT_ID`
   - `IBM_REGION`
   - `GRANITE_MODEL_ID`
   - `PRIVATE_LEDGER_SALT`
   - `PRIVATE_LEDGER_ENC_KEY`

## 🎯 Step 5: Test Deployment

1. **Visit your deployed app**: `https://your-project-name.vercel.app`
2. **Test API endpoints**: `https://your-project-name.vercel.app/api/health`
3. **Test file upload**: Try uploading a PDF
4. **Test AI features**: Use the advisor functionality

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures**:
   ```bash
   # Check build logs in Vercel dashboard
   # Ensure all dependencies are in package.json
   ```

2. **API Timeout**:
   ```bash
   # Vercel has 10s timeout for Hobby plan
   # Optimize heavy operations
   # Consider upgrading to Pro plan for 60s timeout
   ```

3. **Large Dependencies**:
   ```bash
   # Some Python packages might be too large
   # Consider using lighter alternatives
   # Use Vercel Pro for larger deployments
   ```

4. **CORS Issues**:
   ```python
   # Update CORS origins in your API
   ALLOWED_ORIGINS = [
       "https://your-project-name.vercel.app",
       "http://localhost:5173",
       "http://localhost:8086"
   ]
   ```

## 🚀 Advanced Configuration

### Custom Domain:
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records

### Performance Optimization:
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Analytics:
1. Enable **Vercel Analytics** in project settings
2. Add analytics to your React app

## 📊 Monitoring

- **Vercel Dashboard**: Monitor deployments and performance
- **Function Logs**: Check serverless function execution
- **Analytics**: Track user engagement and performance

## 🔄 Continuous Deployment

Once connected to GitHub:
- **Auto-deploy**: Every push to `main` branch triggers deployment
- **Preview deployments**: Pull requests get preview URLs
- **Rollback**: Easy rollback to previous deployments

## 📞 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Support**: Available for Pro/Enterprise plans

Your Fineo platform will be live at: `https://your-project-name.vercel.app` 🎉
