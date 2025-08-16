const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const QRCode = require('qrcode');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for QR code analytics (in production, use a database)
const qrCodeAnalytics = new Map();

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

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/generate-qr', async (req, res) => {
    console.log('QR generation request received:', req.body);
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

        // Generate unique ID for this QR code
        const qrId = generateQRId(text);

        // Initialize analytics for this QR code if it doesn't exist
        if (!qrCodeAnalytics.has(qrId)) {
            qrCodeAnalytics.set(qrId, {
                text: text,
                scans: 0,
                firstGenerated: new Date().toISOString(),
                lastScanned: null,
                size: size,
                color: color,
                backgroundColor: backgroundColor,
                errorCorrection: errorCorrection
            });
        }

        res.json({
            success: true,
            qrCode: qrCodeDataURL,
            qrId: qrId,
            text: text,
            size: size,
            color: color,
            backgroundColor: backgroundColor,
            errorCorrection: errorCorrection,
            analytics: qrCodeAnalytics.get(qrId)
        });

    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({
            error: 'Failed to generate QR code',
            details: error.message
        });
    }
});

// Track QR code scan
app.post('/api/track-scan', async (req, res) => {
    console.log('Scan tracking request received:', req.body);
    try {
        const { qrId, text } = req.body;

        if (!qrId && !text) {
            return res.status(400).json({ error: 'QR ID or text is required' });
        }

        let qrData;
        if (qrId && qrCodeAnalytics.has(qrId)) {
            qrData = qrCodeAnalytics.get(qrId);
        } else if (text) {
            const qrIdFromText = generateQRId(text);
            if (qrCodeAnalytics.has(qrIdFromText)) {
                qrData = qrCodeAnalytics.get(qrIdFromText);
            } else {
                // Create new entry if not found
                qrData = {
                    text: text,
                    scans: 0,
                    firstGenerated: new Date().toISOString(),
                    lastScanned: null,
                    size: 300,
                    color: '#000000',
                    backgroundColor: '#FFFFFF',
                    errorCorrection: 'M'
                };
                qrCodeAnalytics.set(qrIdFromText, qrData);
            }
        }

        // Update scan count
        qrData.scans += 1;
        qrData.lastScanned = new Date().toISOString();

        res.json({
            success: true,
            qrId: qrId || generateQRId(text),
            scans: qrData.scans,
            lastScanned: qrData.lastScanned
        });

    } catch (error) {
        console.error('Error tracking scan:', error);
        res.status(500).json({
            error: 'Failed to track scan',
            details: error.message
        });
    }
});

// Get QR code analytics
app.get('/api/analytics/:qrId', async (req, res) => {
    try {
        const { qrId } = req.params;

        if (!qrCodeAnalytics.has(qrId)) {
            return res.status(404).json({ error: 'QR code not found' });
        }

        const analytics = qrCodeAnalytics.get(qrId);
        res.json({
            success: true,
            analytics: analytics
        });

    } catch (error) {
        console.error('Error getting analytics:', error);
        res.status(500).json({
            error: 'Failed to get analytics',
            details: error.message
        });
    }
});

// Get all QR codes analytics (for dashboard)
app.get('/api/analytics', async (req, res) => {
    try {
        const allAnalytics = Array.from(qrCodeAnalytics.entries()).map(([qrId, data]) => ({
            qrId,
            ...data
        }));

        res.json({
            success: true,
            totalQRCodes: allAnalytics.length,
            totalScans: allAnalytics.reduce((sum, item) => sum + item.scans, 0),
            qrCodes: allAnalytics
        });

    } catch (error) {
        console.error('Error getting all analytics:', error);
        res.status(500).json({
            error: 'Failed to get analytics',
            details: error.message
        });
    }
});

// Generate QR code in specific format
app.post('/api/generate-qr-format', async (req, res) => {
    console.log('QR format generation request received:', req.body);
    try {
        const { text, size = 300, color = '#000000', backgroundColor = '#FFFFFF', errorCorrection = 'M', format = 'png' } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Text is required' });
        }

        let qrCodeData;
        let contentType;
        let filename;

        const options = {
            width: parseInt(size),
            height: parseInt(size),
            color: {
                dark: color,
                light: backgroundColor
            },
            errorCorrectionLevel: errorCorrection,
            margin: 2
        };

        switch (format.toLowerCase()) {
            case 'png':
                qrCodeData = await QRCode.toDataURL(text, { ...options, type: 'image/png' });
                contentType = 'image/png';
                filename = `qr-code-${Date.now()}.png`;
                break;

            case 'jpeg':
            case 'jpg':
                qrCodeData = await QRCode.toDataURL(text, { ...options, type: 'image/jpeg', quality: 0.9 });
                contentType = 'image/jpeg';
                filename = `qr-code-${Date.now()}.jpg`;
                break;

            case 'svg':
                qrCodeData = await QRCode.toString(text, { ...options, type: 'svg' });
                contentType = 'image/svg+xml';
                filename = `qr-code-${Date.now()}.svg`;
                break;

            case 'pdf':
                // For PDF, we'll generate a PNG first and convert to PDF-like data
                const pngData = await QRCode.toDataURL(text, { ...options, type: 'image/png' });
                qrCodeData = pngData;
                contentType = 'application/pdf';
                filename = `qr-code-${Date.now()}.pdf`;
                break;

            default:
                return res.status(400).json({ error: 'Unsupported format. Use: png, jpeg, svg, or pdf' });
        }

        res.json({
            success: true,
            qrCode: qrCodeData,
            format: format,
            contentType: contentType,
            filename: filename,
            text: text,
            size: size,
            color: color,
            backgroundColor: backgroundColor,
            errorCorrection: errorCorrection
        });

    } catch (error) {
        console.error('Error generating QR code in format:', error);
        res.status(500).json({
            error: 'Failed to generate QR code in specified format',
            details: error.message
        });
    }
});

app.post('/api/generate-qr-svg', async (req, res) => {
    console.log('SVG QR generation request received:', req.body);
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

// Helper function to generate unique QR ID
function generateQRId(text) {
    return Buffer.from(text).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Serve the main HTML file for all other routes (SPA support) - MUST BE LAST
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
