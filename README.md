# QR Code Generator Pro

A professional, full-stack QR code generator web application with advanced customization options, built with Node.js, Express, and modern web technologies.

## ✨ Features

- **Advanced QR Code Generation**: Customize size, colors, and error correction levels
- **Multiple Output Formats**: PNG and SVG download options
- **Real-time Preview**: Auto-generates QR codes as you type
- **Professional UI**: Dark theme with modern design and smooth animations
- **Responsive Design**: Works perfectly on all devices
- **API Endpoints**: RESTful API for integration with other applications
- **PWA Ready**: Progressive Web App capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd qr-code-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
qr-code-app/
├── public/                 # Frontend static files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styles
│   └── script.js          # Frontend JavaScript
├── server.js              # Express server (backend)
├── package.json           # Dependencies and scripts
├── render.yaml            # Render deployment config
└── README.md              # This file
```

## 🌐 Deployment on Render

### Option 1: Single Service Deployment (Recommended)

This approach deploys both frontend and backend as a single service:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create a new Web Service on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `qr-code-generator`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free (or choose your preferred plan)

3. **Set Environment Variables** (optional)
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render will set this automatically)

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app

### Option 2: Separate Frontend and Backend

If you prefer separate services:

1. **Deploy Backend API**
   - Create a Web Service for the Node.js backend
   - Use the same configuration as above

2. **Deploy Frontend**
   - Create a Static Site service
   - Set the build command to: `echo "Frontend served by backend"`
   - Set the publish directory to: `./public`

3. **Update Frontend API URL**
   - Modify `script.js` to point to your backend service URL

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
NODE_ENV=development
PORT=3000
```

### API Endpoints

- `POST /api/generate-qr` - Generate PNG QR code
- `POST /api/generate-qr-svg` - Generate SVG QR code  
- `GET /api/health` - Health check endpoint

### Request Body Example

```json
{
  "text": "https://example.com",
  "size": 300,
  "color": "#000000",
  "backgroundColor": "#FFFFFF",
  "errorCorrection": "M"
}
```

## 📱 PWA Features

The app includes Progressive Web App capabilities:
- Service Worker for offline functionality
- Installable on mobile devices
- Responsive design for all screen sizes

## 🎨 Customization

### Colors
The app uses CSS custom properties for easy theming:
- Primary: `#1F2937` (Charcoal)
- Secondary: `#3B82F6` (Sky Blue)
- Accent: `#10B981` (Emerald)
- Background: `#111827` (Dark)

### Fonts
- Primary: Inter (Google Fonts)
- Fallback: System fonts

## 🚀 Performance Features

- **Debounced Input**: Prevents excessive API calls
- **Image Optimization**: Efficient QR code generation
- **Lazy Loading**: Resources loaded on demand
- **Caching**: Service worker for offline access

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Server-side validation
- **Rate Limiting**: Built-in protection (configurable)

## 📊 Monitoring

- **Health Check**: `/api/health` endpoint
- **Error Logging**: Comprehensive error handling
- **Performance Metrics**: Built-in monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

## 🔄 Updates

To update your deployed app:
1. Push changes to your GitHub repository
2. Render will automatically redeploy
3. Monitor the deployment logs

---

**Built with ❤️ using modern web technologies**
