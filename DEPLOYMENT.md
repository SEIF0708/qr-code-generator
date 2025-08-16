# 🚀 Deploy QR Code Generator on Render

This guide will walk you through deploying both the frontend and backend of your QR Code Generator app on Render.

## 📋 Prerequisites

1. **GitHub Account**: Your code must be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Node.js Knowledge**: Basic understanding of Node.js applications

## 🎯 Deployment Options

### Option 1: Single Service (Recommended) ⭐

Deploy both frontend and backend as one service. This is simpler and more cost-effective.

### Option 2: Separate Services

Deploy frontend and backend as separate services for more control.

---

## 🚀 Option 1: Single Service Deployment

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: QR Code Generator"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it: `qr-code-generator`
   - Make it public or private
   - Don't initialize with README (we already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/qr-code-generator.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Render

1. **Go to Render Dashboard**:
   - Visit [render.com](https://render.com)
   - Sign in or create account
   - Click "New +" → "Web Service"

2. **Connect Repository**:
   - Choose "Connect a repository"
   - Select your `qr-code-generator` repository
   - Click "Connect"

3. **Configure Service**:
   - **Name**: `qr-code-generator` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Start with `Free` plan

4. **Environment Variables** (optional):
   - `NODE_ENV`: `production`
   - `PORT`: Leave empty (Render sets this automatically)

5. **Advanced Settings**:
   - **Health Check Path**: `/api/health`
   - **Auto-Deploy**: ✅ Enabled
   - **Pull Request Previews**: ✅ Enabled (optional)

6. **Create Service**:
   - Click "Create Web Service"
   - Render will start building and deploying

### Step 3: Monitor Deployment

1. **Watch Build Process**:
   - Monitor the build logs
   - Ensure all dependencies install correctly
   - Check for any build errors

2. **Verify Deployment**:
   - Wait for "Live" status
   - Test your app at the provided URL
   - Check health endpoint: `https://your-app.onrender.com/api/health`

---

## 🌐 Option 2: Separate Services Deployment

### Backend API Service

1. **Create Web Service**:
   - Type: `Web Service`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check: `/api/health`

2. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Your frontend URL

### Frontend Static Service

1. **Create Static Site**:
   - Type: `Static Site`
   - Build Command: `echo "Frontend built"`
   - Publish Directory: `./public`

2. **Update API URL**:
   - Modify `public/script.js`
   - Change `apiBaseUrl` to your backend service URL

---

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)

1. **Add Custom Domain**:
   - Go to your service settings
   - Click "Custom Domains"
   - Add your domain
   - Update DNS records as instructed

### Environment Variables

1. **Production Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: Auto-set by Render
   - Add any other required variables

### Monitoring

1. **Health Checks**:
   - Monitor `/api/health` endpoint
   - Set up alerts for downtime
   - Check Render dashboard regularly

---

## 🧪 Testing Your Deployment

### 1. Basic Functionality
- [ ] App loads without errors
- [ ] QR code generation works
- [ ] Download functionality works
- [ ] Copy to clipboard works
- [ ] Share functionality works

### 2. API Endpoints
- [ ] `GET /api/health` returns 200
- [ ] `POST /api/generate-qr` generates QR codes
- [ ] `POST /api/generate-qr-svg` generates SVG

### 3. Cross-Platform Testing
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile browsers
- [ ] Different screen sizes

---

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies in `package.json`
   - Check build logs for specific errors

2. **Runtime Errors**:
   - Check application logs in Render dashboard
   - Verify environment variables
   - Test locally first

3. **CORS Issues**:
   - Ensure CORS is properly configured
   - Check frontend-backend communication

4. **Performance Issues**:
   - Monitor Render metrics
   - Consider upgrading plan if needed
   - Optimize code and assets

### Getting Help

1. **Render Documentation**: [docs.render.com](https://docs.render.com)
2. **Render Support**: Available in dashboard
3. **GitHub Issues**: Create issue in your repository
4. **Community**: Stack Overflow, Reddit r/webdev

---

## 🔄 Updating Your App

### Automatic Updates

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update: [describe changes]"
   git push origin main
   ```

2. **Render Auto-Deploy**:
   - Render automatically detects changes
   - Builds and deploys new version
   - Zero downtime deployment

### Manual Updates

1. **Trigger Manual Deploy**:
   - Go to Render dashboard
   - Click "Manual Deploy"
   - Choose branch and deploy

---

## 💰 Cost Optimization

### Free Plan Features
- ✅ 750 hours/month
- ✅ Automatic sleep after 15 minutes of inactivity
- ✅ 512 MB RAM
- ✅ Shared CPU

### When to Upgrade
- **More RAM**: If app crashes or is slow
- **Dedicated CPU**: For better performance
- **Always On**: If you need 24/7 uptime
- **Custom Domains**: For professional use

---

## 🎉 Success!

Your QR Code Generator is now deployed and accessible worldwide! 

**Next Steps**:
1. Share your app URL
2. Monitor performance
3. Gather user feedback
4. Iterate and improve
5. Consider adding analytics

---

**Need Help?** Check the [README.md](README.md) for more details or create an issue in your repository.
