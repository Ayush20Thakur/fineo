# Render Deployment Guide for Fineo

Complete guide to deploy your Fineo financial analysis platform on Render.

## 🚀 Render Configuration

Based on your screenshot, here's the **EXACT** configuration to use:

### **Basic Settings:**
- **Name**: `fineo`
- **Language**: `Python 3`
- **Branch**: `main`
- **Region**: `Singapore (Southeast Asia)` ✅

### **Build & Deploy Settings:**

#### **Root Directory:**
```
./
```
(Leave empty or use `./`)

#### **Build Command:**
```
pip install -r requirements.txt && npm install && npm run build
```

#### **Start Command:**
```
python api_server.py
```

### **Environment Variables:**
Add these in the Render dashboard after deployment:

```
IBM_CLOUD_API_KEY=IMRx0k6nHeGAGW0de9mJIWWPtDGGF9a7DgoWFbkD8R2U
IBM_PROJECT_ID=d633b804-839c-4479-9b5d-d612ccda6c3a
IBM_REGION=https://eu-de.ml.cloud.ibm.com
GRANITE_MODEL_ID=ibm/granite-3-8b-instruct
PRIVATE_LEDGER_SALT=cyhaJROT8R01Y3/UI01eqsAzivyuBU2UPUNHqJvsdVo=
PRIVATE_LEDGER_ENC_KEY=KDtN9CXfaxNJmCG4XqLIljMKSbKyWA3p7hiOom3-UhI=
PORT=10000
```

## 📋 Step-by-Step Deployment

### **Step 1: Complete Render Form**
Fill in the form exactly as shown above, then click **"Create Web Service"**

### **Step 2: Wait for Build**
- Build process will take 5-10 minutes
- Monitor logs for any errors
- Frontend and backend will be built together

### **Step 3: Add Environment Variables**
1. Go to your service dashboard
2. Click **"Environment"** tab
3. Add all the environment variables listed above
4. Click **"Save Changes"**

### **Step 4: Test Deployment**
Your app will be available at: `https://fineo.onrender.com`

## 🔧 What's Configured

### **Full-Stack Setup:**
- ✅ **Backend**: FastAPI server with all financial services
- ✅ **Frontend**: React app built and served statically
- ✅ **Database**: In-memory (no external DB needed)
- ✅ **AI Integration**: IBM Granite AI ready
- ✅ **File Upload**: PDF processing capabilities

### **Features Available:**
- 📄 **PDF Upload**: Bank passbook analysis
- 📊 **Dashboard**: Financial analytics and insights
- 🤖 **AI Forecasting**: Cashflow predictions
- ⚖️ **FairScore**: Ethical credit scoring
- 🔍 **Fairness Audit**: Bias detection
- 💡 **AI Advisor**: IBM Granite-powered advice

## 🌐 Architecture

```
Render Service (Single Container)
├── FastAPI Backend (Port 10000)
│   ├── /api/* endpoints
│   ├── PDF processing
│   ├── AI integration
│   └── Financial calculations
└── React Frontend (Served statically)
    ├── Modern UI
    ├── Interactive dashboard
    └── Real-time updates
```

## 🔍 Troubleshooting

### **Common Issues:**

1. **Build Fails:**
   ```bash
   # Check build logs in Render dashboard
   # Ensure all dependencies are compatible
   ```

2. **Environment Variables:**
   ```bash
   # Add all required env vars in Render dashboard
   # Restart service after adding variables
   ```

3. **Port Issues:**
   ```bash
   # Render automatically sets PORT=10000
   # Our app reads from os.environ.get("PORT", 8000)
   ```

4. **Static Files:**
   ```bash
   # Frontend is built to ./dist directory
   # FastAPI serves static files from /dist
   ```

## 📊 Monitoring

- **Logs**: Available in Render dashboard
- **Metrics**: CPU, Memory, Response times
- **Health**: `/health` endpoint for monitoring
- **Uptime**: Automatic health checks

## 🔄 Updates

To update your deployment:
1. Push changes to GitHub
2. Render auto-deploys from `main` branch
3. Monitor build logs
4. Test new features

## 💰 Pricing

- **Free Tier**: Available for testing
- **Paid Plans**: For production use
- **Auto-scaling**: Based on traffic

## 🎯 Next Steps

After deployment:
1. Test all features
2. Configure custom domain (optional)
3. Set up monitoring alerts
4. Add team members if needed

Your Fineo platform will be live at: `https://fineo.onrender.com` 🎉
