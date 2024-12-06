import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/announcements');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create announcement
router.post('/', upload.array('attachments'), async (req, res) => {
  try {
    const { am_title, am_desc, am_department } = req.body;
    const files = req.files;
    
    const db = await connectToDatabase();
    
    // Format date to only include month and day
    const [result] = await db.query(
      `INSERT INTO announcement_tb (am_title, am_desc, am_date, am_department, am_react, am_avatar) 
       VALUES (?, ?, DATE_FORMAT(NOW(), '%M %d'), ?, 0, 'default-avatar.png')`,
      [am_title, am_desc, am_department]
    );

    // Handle file attachments if any
    if (files && files.length > 0) {
      for (const file of files) {
        const relativePath = path.relative(uploadsDir, file.path).replace(/\\/g, '/');
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
    res.status(500).json({ 
      message: 'Failed to create announcement',
      error: error.message 
    });
  }
});

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [announcements] = await db.query(
      `SELECT 
        a.*,
        DATE_FORMAT(a.am_date, '%M %d') as formatted_date 
       FROM announcement_tb a 
       ORDER BY a.am_date DESC`
    );
    
    // Fetch attachments for each announcement
    for (let announcement of announcements) {
      const [attachments] = await db.query(
        `SELECT * FROM announcement_attachments WHERE am_id = ?`,
        [announcement.am_id]
      );
      announcement.attachments = attachments;
      // Use the formatted date
      announcement.am_date = announcement.formatted_date;
      delete announcement.formatted_date;
    }
    
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ 
      message: 'Failed to fetch announcements',
      error: error.message 
    });
  }
});

// Handle reactions
router.post('/:id/react', async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    
    const db = await connectToDatabase();
    
    await db.query(
      `UPDATE announcement_tb 
       SET am_react = am_react ${value ? '+' : '-'} 1 
       WHERE am_id = ?`,
      [id]
    );
    
    const [result] = await db.query(
      'SELECT am_react FROM announcement_tb WHERE am_id = ?',
      [id]
    );
    
    res.json({ reactions: result[0].am_react });
  } catch (error) {
    console.error('Error updating reaction:', error);
    res.status(500).json({ message: 'Failed to update reaction' });
  }
});

// Get reactions for an announcement
router.get('/:id/reactions', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    
    const [result] = await db.query(
      'SELECT am_react FROM announcement_tb WHERE am_id = ?',
      [id]
    );
    
    res.json({ 
      reactions: result[0].am_react,
      hasReacted: false // You might want to implement user-specific reaction tracking
    });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    res.status(500).json({ message: 'Failed to fetch reactions' });
  }
});

// Serve uploaded files
router.use('/uploads/announcements', express.static(uploadsDir));

export default router;