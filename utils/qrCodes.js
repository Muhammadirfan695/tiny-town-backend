const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const QR_FOLDER = path.join(__dirname, '..', 'qrcodes');
fs.mkdirSync(QR_FOLDER, { recursive: true });

const generateQRCode = async (value, filename, options = {}) => {
    const outputPath = path.join(QR_FOLDER, filename);

    await QRCode.toFile(outputPath, value, {
        width: 300,
        color: {
            dark: options.fgColor || '#000000',
            light: options.bgColor || '#ffffff',
        },
        ...options,
    });

    // Return relative path from qrcodes folder
    return `qrcodes/${filename}`;
};

module.exports = {
    generateQRCode
};
