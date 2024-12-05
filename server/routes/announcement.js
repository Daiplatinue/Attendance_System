import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/announcements'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Create announcement
router.post('/', upload.array('attachments'), async (req, res) => {
  try {
    const { am_title, am_desc, am_department } = req.body;
    const files = req.files;
    
    const db = await connectToDatabase();
    
    const [result] = await db.query(
      `INSERT INTO announcement_tb (am_title, am_desc, am_date, am_department) 
       VALUES (?, ?, NOW(), ?)`,
      [am_title, am_desc, am_department]
    );

    // Handle file attachments if any
    if (files && files.length > 0) {
      for (const file of files) {
        const relativePath = path.relative(path.join(__dirname, '../..'), file.path);
        await db.query(
          `INSERT INTO announcement_attachments (am_id, att_filePath, att_fileName) 
           VALUES (?, ?, ?)`,
          [result.insertId, relativePath, file.originalname]
        );
      }
    }

    res.status(201).json({
      message: 'Announcement created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Failed to create announcement' });
  }
});

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [announcements] = await db.query(
      `SELECT * FROM announcement_tb ORDER BY am_date DESC`
    );
    
    // Fetch attachments for each announcement
    for (let announcement of announcements) {
      const [attachments] = await db.query(
        `SELECT * FROM announcement_attachments WHERE am_id = ?`,
        [announcement.am_id]
      );
      announcement.attachments = attachments;
    }
    
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
});

export default router;