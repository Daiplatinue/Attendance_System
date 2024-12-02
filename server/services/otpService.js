import { connectToDatabase } from '../lib/db.js';
import { sendVerificationEmail } from '../services/emailService.js';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createAndSendOTP = async (phoneNumber) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  try {
    const db = await connectToDatabase();
    
    // Delete any existing OTP for this phone number
    await db.query('DELETE FROM otps WHERE phone_number = ?', [phoneNumber]);
    
    // Store new OTP
    await db.query(
      'INSERT INTO otps (phone_number, otp_code, expires_at) VALUES (?, ?, ?)',
      [phoneNumber, otp, expiresAt]
    );

    // Send OTP via email
    await sendVerificationEmail(phoneNumber, otp);

    return true;
  } catch (error) {
    console.error('OTP Service Error:', error);
    throw error;
  }
};

export const verifyOTP = async (phoneNumber, otpCode) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(
      'SELECT * FROM otps WHERE phone_number = ? AND otp_code = ? AND expires_at > NOW() AND is_used = 0',
      [phoneNumber, otpCode]
    );

    if (rows.length === 0) {
      return false;
    }

    // Mark OTP as used
    await db.query(
      'UPDATE otps SET is_used = 1 WHERE phone_number = ? AND otp_code = ?',
      [phoneNumber, otpCode]
    );

    return true;
  } catch (error) {
    console.error('OTP Verification Error:', error);
    throw error;
  }
};