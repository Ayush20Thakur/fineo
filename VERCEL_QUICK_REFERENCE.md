# Vercel Deployment - Quick Reference Card

## 🚀 5-Minute Deployment Checklist

### **Before You Start:**
- [ ] GitHub account connected to Vercel
- [ ] Repository: `Ayush20Thakur/fineo`
- [ ] Branch: `main`
- [ ] All changes committed and pushed

---

## 📋 Vercel Dashboard Setup

### **1. Create New Project**
```
vercel.com → New Project → Import Git Repository
```

### **2. Select Repository**
```
Search: Ayush20Thakur/fineo
Click: Import
```

### **3. Configure Build Settings**
```
Framework Preset: Vite (auto-detected)
Build Command: npm run build
Output Directory: dist
Root Directory: ./
```

### **4. Add Environment Variables**

| Variable Name | Value |
|---|---|
| `IBM_CLOUD_API_KEY` | `IMRx0k6nHeGAGW0de9mJIWWPtDGGF9a7DgoWFbkD8R2U` |
| `IBM_PROJECT_ID` | `d633b804-839c-4479-9b5d-d612ccda6c3a` |
| `IBM_REGION` | `https://eu-de.ml.cloud.ibm.com` |
| `GRANITE_MODEL_ID` | `ibm/granite-3-8b-instruct` |
| `PRIVATE_LEDGER_SALT` | `cyhaJROT8R01Y3/UI01eqsAzivyuBU2UPUNHqJvsdVo=` |
| `PRIVATE_LEDGER_ENC_KEY` | `KDtN9CXfaxNJmCG4XqLIljMKSbKyWA3p7hiOom3-UhI=` |

### **5. Deploy**
```
Click: Deploy Button
Wait: 2-5 minutes
```

---

## ✅ After Deployment

### **Your App URL:**
```
https://fineo.vercel.app
```

### **Test Features:**
- [ ] Landing page loads
- [ ] Sign-up button works
- [ ] Dashboard accessible
- [ ] PDF upload works
- [ ] AI features respond

### **Monitor:**
- [ ] Check Deployments tab
- [ ] View Build Logs
- [ ] Monitor Analytics

---

## 🔄 Update Your App

### **Push Changes:**
```bash
git add .
git commit -m "your message"
git push origin main
```

### **Vercel Auto-Deploys:**
- Automatically detects push to `main`
- Rebuilds and redeploys
- Takes 2-5 minutes

---

## 🛠️ Common Issues & Fixes

### **Build Fails:**
```
→ Check build logs in Vercel dashboard
→ Verify all dependencies in requirements.txt
→ Ensure package.json has correct scripts
```

### **API Endpoints Not Working:**
```
→ Verify environment variables are set
→ Check /api folder has Python files
→ Redeploy after adding env vars
```

### **Frontend Not Loading:**
```
→ Clear browser cache (Ctrl+Shift+Delete)
→ Check if dist folder is built
→ Verify vercel.json configuration
```

### **Environment Variables Not Applied:**
```
→ Redeploy the project
→ Check variable names match exactly
→ Verify values are complete
```

---

## 📊 Project Structure

```
fineo/
├── src/                    # React frontend
│   ├── pages/             # Page components
│   ├── components/        # UI components
│   └── config/            # Configuration
├── api/                   # Serverless functions
│   ├── health.py
│   ├── sample-transactions.py
│   ├── analyze-transactions.py
│   ├── calculate-fairscore.py
│   └── upload-pdf.py
├── package.json           # Node dependencies
├── requirements.txt       # Python dependencies
├── vercel.json           # Vercel config
└── vite.config.ts        # Vite config
```

---

## 🎯 Features Deployed

✅ **Frontend:**
- Modern React UI
- Responsive design
- Interactive dashboard
- Real-time updates

✅ **Backend (Serverless):**
- Transaction analysis
- FairScore calculation
- PDF processing
- AI integration
- Health monitoring

✅ **Security:**
- CORS configured
- Environment variables protected
- API rate limiting
- Secure headers

---

## 📞 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Project**: https://vercel.com/dashboard/fineo
- **GitHub Repo**: https://github.com/Ayush20Thakur/fineo
- **Live App**: https://fineo.vercel.app

---

## ⏱️ Deployment Timeline

```
0 min   → Click Deploy
1 min   → Build starts
3 min   → Frontend built
4 min   → API functions deployed
5 min   → ✅ Live on Vercel!
```

---

**Ready to deploy? Follow the checklist above and you'll be live in 5 minutes!** 🚀
