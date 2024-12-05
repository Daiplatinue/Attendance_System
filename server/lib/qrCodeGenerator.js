import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateQRCode = async (userId) => {
    try {
        const qrData = {
            userId: userId,
            timestamp: Date.now()
        };
        
        const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(qrData));
        
        const qrCodeFilename = `qr-${userId}-${Date.now()}.png`;
        
        const profilesPath = path.join(__dirname, '../../profiles');
        const qrCodePath = path.join(profilesPath, qrCodeFilename);
        
        await fs.writeFile(qrCodePath, qrCodeBuffer);
        
        return qrCodeFilename;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};