class QRCodeGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.currentQRCode = null;
        this.apiBaseUrl = window.location.origin; // Will work for both local and deployed
    }

    initializeElements() {
        this.qrText = document.getElementById('qr-text');
        this.qrSize = document.getElementById('qr-size');
        this.qrColor = document.getElementById('qr-color');
        this.qrBg = document.getElementById('qr-bg');
        this.qrError = document.getElementById('qr-error');
        this.generateBtn = document.getElementById('generate-btn');
        this.qrPlaceholder = document.getElementById('qr-placeholder');
        this.qrResult = document.getElementById('qr-result');
        this.qrImage = document.getElementById('qr-image');
        this.actionButtons = document.getElementById('action-buttons');
        this.downloadFormat = document.getElementById('download-format');
        this.downloadBtn = document.getElementById('download-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.shareBtn = document.getElementById('share-btn');
        this.toast = document.getElementById('toast');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generateQRCode());
        this.downloadBtn.addEventListener('click', () => this.downloadQRCode());
        this.copyBtn.addEventListener('click', () => this.copyQRCode());
        this.shareBtn.addEventListener('click', () => this.shareQRCode());
        
        // Auto-generate on Enter key
        this.qrText.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateQRCode();
            }
        });

        // Real-time preview on input change
        this.qrText.addEventListener('input', this.debounce(() => {
            if (this.qrText.value.trim()) {
                this.generateQRCode();
            }
        }, 500));

        // Auto-generate when options change
        [this.qrSize, this.qrColor, this.qrBg, this.qrError].forEach(element => {
            element.addEventListener('change', () => {
                if (this.qrText.value.trim()) {
                    this.generateQRCode();
                }
            });
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async generateQRCode() {
        const text = this.qrText.value.trim();
        
        if (!text) {
            this.showToast('Please enter some text or URL', 'error');
            return;
        }

        this.setLoading(true);

        try {
            const requestData = {
                text: text,
                size: parseInt(this.qrSize.value),
                color: this.qrColor.value,
                backgroundColor: this.qrBg.value,
                errorCorrection: this.qrError.value
            };

            const response = await fetch(`${this.apiBaseUrl}/api/generate-qr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                // Display the QR code
                this.qrImage.src = data.qrCode;
                this.qrImage.alt = `QR Code for: ${text}`;
                
                // Hide placeholder and show result
                this.qrPlaceholder.classList.add('hidden');
                this.qrResult.classList.remove('hidden');
                this.actionButtons.classList.remove('hidden');

                this.showToast('QR Code generated successfully!', 'success');
            } else {
                throw new Error(data.error || 'Failed to generate QR code');
            }

        } catch (error) {
            console.error('Error generating QR code:', error);
            this.showToast(`Error: ${error.message}`, 'error');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        const btnText = this.generateBtn.querySelector('.btn-text');
        const btnLoader = this.generateBtn.querySelector('.btn-loader');
        
        if (loading) {
            btnText.style.opacity = '0';
            btnLoader.classList.remove('hidden');
            this.generateBtn.disabled = true;
        } else {
            btnText.style.opacity = '1';
            btnLoader.classList.add('hidden');
            this.generateBtn.disabled = false;
        }
    }

    async downloadQRCode() {
        const text = this.qrText.value.trim();
        const format = this.downloadFormat.value;
        
        if (!text) {
            this.showToast('Please generate a QR code first', 'error');
            return;
        }

        try {
            this.downloadBtn.disabled = true;
            this.downloadBtn.innerHTML = '<span>⏳</span> Generating...';

            const response = await fetch(`${this.apiBaseUrl}/api/generate-qr-format`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    size: parseInt(this.qrSize.value),
                    color: this.qrColor.value,
                    backgroundColor: this.qrBg.value,
                    errorCorrection: this.qrError.value,
                    format: format
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                // Create download link
                const link = document.createElement('a');
                link.download = data.filename;
                link.href = data.qrCode;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                this.showToast(`QR Code downloaded as ${format.toUpperCase()}!`, 'success');
            } else {
                throw new Error(data.error || 'Failed to generate QR code');
            }

        } catch (error) {
            console.error('Error downloading QR code:', error);
            this.showToast(`Failed to download QR code: ${error.message}`, 'error');
        } finally {
            this.downloadBtn.disabled = false;
            this.downloadBtn.innerHTML = '<span>📥</span> Download';
        }
    }

    async copyQRCode() {
        const text = this.qrText.value.trim();
        
        if (!text) {
            this.showToast('Please generate a QR code first', 'error');
            return;
        }

        try {
            // Create a canvas to convert the image to blob
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = async () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                try {
                    const blob = await new Promise(resolve => {
                        canvas.toBlob(resolve, 'image/png');
                    });
                    
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]);
                    
                    this.showToast('QR Code copied to clipboard!', 'success');
                } catch (clipboardError) {
                    console.error('Clipboard error:', clipboardError);
                    this.showToast('Failed to copy to clipboard', 'error');
                }
            };
            
            img.src = this.qrImage.src;
        } catch (error) {
            console.error('Error copying QR code:', error);
            this.showToast('Failed to copy QR code', 'error');
        }
    }

    async shareQRCode() {
        const text = this.qrText.value.trim();
        
        if (!text) {
            this.showToast('Please generate a QR code first', 'error');
            return;
        }

        if (!navigator.share) {
            this.showToast('Sharing not supported on this device', 'error');
            return;
        }

        try {
            // Create a canvas to convert the image to blob
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = async () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                try {
                    const blob = await new Promise(resolve => {
                        canvas.toBlob(resolve, 'image/png');
                    });
                    
                    const file = new File([blob], 'qr-code.png', { type: 'image/png' });
                    
                    await navigator.share({
                        title: 'QR Code',
                        text: `Check out this QR code I generated for: ${text}`,
                        files: [file]
                    });
                    
                    this.showToast('QR Code shared successfully!', 'success');
                } catch (shareError) {
                    console.error('Share error:', shareError);
                    this.showToast('Failed to share QR code', 'error');
                }
            };
            
            img.src = this.qrImage.src;
        } catch (error) {
            console.error('Error sharing QR code:', error);
            this.showToast('Failed to share QR code', 'error');
        }
    }

    showToast(message, type = 'info') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.remove('hidden');
        
        // Add show class for animation
        setTimeout(() => {
            this.toast.classList.add('show');
        }, 100);

        // Hide toast after 3 seconds
        setTimeout(() => {
            this.toast.classList.remove('show');
            setTimeout(() => {
                this.toast.classList.add('hidden');
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QRCodeGenerator();
    
    // Add some nice micro-interactions
    addMicroInteractions();
});

function addMicroInteractions() {
    // Add hover effects to input fields
    const inputs = document.querySelectorAll('.input, .select, .color-picker');
    inputs.forEach(input => {
        input.addEventListener('mouseenter', () => {
            input.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('mouseleave', () => {
            input.style.transform = 'scale(1)';
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        button {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// Add service worker for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
