import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// Get all subjects for a teacher
router.get('/subjects/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      'SELECT DISTINCT t_subject FROM teacher_tb WHERE u_id = ?',
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Error fetching subjects' });
  }
});

// Add a new subject
router.post('/subject', async (req, res) => {
  try {
    const { u_id, t_subject } = req.body;
    
    // Check if subject already exists for this user
    const [existingSubject] = await pool.query(
      'SELECT * FROM teacher_tb WHERE u_id = ? AND t_subject = ?',
      [u_id, t_subject]
    );

    if (existingSubject.length > 0) {
      return res.status(400).json({ message: 'Subject already exists for this user' });
    }

    // Insert the new subject
    const [result] = await pool.query(
      'INSERT INTO teacher_tb (u_id, t_subject, t_sectionName, t_schedule) VALUES (?, ?, "", "")',
      [u_id, t_subject]
    );

    res.status(201).json({
      message: 'Subject added successfully',
      t_id: result.insertId
    });
  } catch (error) {
    console.error('Error adding subject:', error);
    res.status(500).json({ message: 'Error adding subject', error: error.message });
  }
});

// Get sections for a subject
router.get('/sections/:userId/:subject', async (req, res) => {
  try {
    const { userId, subject } = req.params;
    const [rows] = await pool.query(
      'SELECT t_sectionName, t_schedule FROM teacher_tb WHERE u_id = ? AND t_subject = ? AND t_sectionName != ""',
      [userId, subject]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ message: 'Error fetching sections' });
  }
});

// Add a new section
router.post('/section', async (req, res) => {
  try {
    const { u_id, t_subject, t_sectionName, t_schedule } = req.body;
    
    // Check if section already exists for this subject
    const [existingSection] = await pool.query(
      'SELECT * FROM teacher_tb WHERE u_id = ? AND t_subject = ? AND t_sectionName = ?',
      [u_id, t_subject, t_sectionName]
    );

    if (existingSection.length > 0) {
      return res.status(400).json({ message: 'Section already exists for this subject' });
    }

    // Insert the new section
    const [result] = await pool.query(
      'INSERT INTO teacher_tb (u_id, t_subject, t_sectionName, t_schedule) VALUES (?, ?, ?, ?)',
      [u_id, t_subject, t_sectionName, t_schedule]
    );

    res.status(201).json({
      message: 'Section added successfully',
      t_id: result.insertId
    });
  } catch (error) {
    console.error('Error adding section:', error);
    res.status(500).json({ message: 'Error adding section', error: error.message });
  }
});

export default router;