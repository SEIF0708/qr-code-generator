const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const QRCode = require('qrcode');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "blob:"],
        },
    },
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/generate-qr', async (req, res) => {
    try {
        const { text, size = 300, color = '#000000', backgroundColor = '#FFFFFF', errorCorrection = 'M' } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Text is required' });
        }

        const options = {
            width: parseInt(size),
            height: parseInt(size),
            color: {
                dark: color,
                light: backgroundColor
            },
            errorCorrectionLevel: errorCorrection,
            margin: 2,
            type: 'image/png'
        };

        const qrCodeDataURL = await QRCode.toDataURL(text, options);

        res.json({
            success: true,
            qrCode: qrCodeDataURL,
            text: text,
            size: size,
            color: color,
            backgroundColor: backgroundColor,
            errorCorrection: errorCorrection
        });

    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({
            error: 'Failed to generate QR code',
            details: error.message
        });
    }
});

app.post('/api/generate-qr-svg', async (req, res) => {
    try {
        const { text, size = 300, color = '#000000', backgroundColor = '#FFFFFF', errorCorrection = 'M' } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Text is required' });
        }

        const options = {
            width: parseInt(size),
            height: parseInt(size),
            color: {
                dark: color,
                light: backgroundColor
            },
            errorCorrectionLevel: errorCorrection,
            margin: 2,
            type: 'svg'
        };

        const qrCodeSVG = await QRCode.toString(text, options);

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(qrCodeSVG);

    } catch (error) {
        console.error('Error generating QR code SVG:', error);
        res.status(500).json({
            error: 'Failed to generate QR code SVG',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve the main HTML file for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 QR Code Generator API ready`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
