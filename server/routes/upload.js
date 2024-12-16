import express from 'express';
import multer from 'multer';
import path from 'path';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sams_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const router = express.Router();

// Ensure upload directories exist
const uploadDirs = ['profiles', 'qr'].map(dir => path.join(__dirname, '../uploads', dir));
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/profiles'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'));
      return;
    }
    cb(null, true);
  }
});

// Helper function to generate QR code
async function generateQRCode(userId) {
  const filename = `qr-${userId}-${Date.now()}.png`;
  const qrPath = path.join(__dirname, '../uploads/qr', filename);
  await QRCode.toFile(qrPath, JSON.stringify({ userId }));
  return filename;
}

// Upload route
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imagePath = `/uploads/profiles/${req.file.filename}`;
    res.json({ imagePath });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

// Generate QR code route
router.post('/generate-qr', async (req, res) => {
  try {
    const { qrData } = req.body;
    if (!qrData) {
      return res.status(400).json({ message: 'QR data is required' });
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.png`;
    const qrPath = path.join(__dirname, '../uploads/qr', filename);
    
    await QRCode.toFile(qrPath, qrData);
    
    res.json({ qrPath: `/uploads/qr/${filename}` });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ message: 'Error generating QR code', error: error.message });
  }
});

// Update profile route
router.post('/update-profile', async (req, res) => {
  let connection;
  try {
    const { userId, u_profile, u_qr } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    connection = await pool.getConnection();
    const query = 'UPDATE acc_tb SET u_profile = ?, u_qr = ? WHERE u_id = ?';
    await connection.query(query, [u_profile, u_qr, userId]);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Create admin route
router.post('/createAdmin', async (req, res) => {
  let connection;
  try {
    const {
      u_fullname, u_role, u_department, u_year,
      u_email, u_contact, u_address, u_password, u_section
    } = req.body;

    // Validate required fields
    if (!u_fullname || !u_email || !u_contact || !u_password) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields. Please provide full name, email, contact, and password.' 
      });
    }

    connection = await pool.getConnection();

    // Check for existing user with more detailed query
    const [existingUsers] = await connection.query(
      'SELECT u_email, u_contact FROM acc_tb WHERE u_email = ? OR u_contact = ?',
      [u_email, u_contact]
    );

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      let conflictMessage = 'User already exists: ';
      if (existingUser.u_email === u_email) {
        conflictMessage += 'Email is already registered';
      } else if (existingUser.u_contact === u_contact) {
        conflictMessage += 'Contact number is already registered';
      }
      return res.status(409).json({ 
        success: false,
        message: conflictMessage 
      });
    }

    await connection.beginTransaction();

    try {
      const currentDate = new Date().toISOString().split('T')[0];

      // Insert user with default values for optional fields
      const [result] = await connection.query(
        `INSERT INTO acc_tb (
          u_fullname, u_role, u_department, u_year,
          u_email, u_contact, u_address, u_password,
          u_profile, u_date, u_section
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          u_fullname,
          u_role || 'user',  // Default role if not provided
          u_department || '',
          u_year || '',
          u_email,
          u_contact,
          u_address || '',
          u_password,
          'default.jpg',
          currentDate,
          u_section || ''
        ]
      );

      // Insert attendance record with default values
      await connection.query(
        `INSERT INTO attendance_tb (
          u_id, a_total, a_late, a_absent, a_predicate
        ) VALUES (?, ?, ?, ?, ?)`,
        [result.insertId, 0, 0, 0, 'New Student']
      );

      // Generate and update QR code
      const qrCodeFilename = await generateQRCode(result.insertId);
      await connection.query(
        'UPDATE acc_tb SET u_qr = ? WHERE u_id = ?',
        [qrCodeFilename, result.insertId]
      );

      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          userId: result.insertId,
          qrCode: `/uploads/qr/${qrCodeFilename}`,
          fullName: u_fullname,
          email: u_email
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create user account',
      error: error.message 
    });
  } finally {
    if (connection) connection.release();
  }
});

export default router;  