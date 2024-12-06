import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskStats,
  getTaskStats
} from '../lib/notes.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get all tasks for a user
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [tasks] = await db.query(getTasks, [req.userId]);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Get task statistics
router.get('/stats', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [stats] = await db.query(getTaskStats, [req.userId]);
    res.json(stats[0] || {
      n_totalTask: 0,
      n_ongoing: 0,
      n_withDeadline: 0,
      n_completed: 0
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ message: 'Error fetching task statistics' });
  }
});

// Create a new task
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const db = await connectToDatabase();
    const {
      title,
      description,
      hasDeadline,
      deadline
    } = req.body;

    const imagePath = req.file ? req.file.filename : null;

    await db.query(createTask, [
      req.userId,
      title,
      description,
      hasDeadline === 'true',
      hasDeadline === 'true' ? deadline : null,
      imagePath,
      1, // Initial total task count
      1, // Initial ongoing count
      hasDeadline === 'true' ? 1 : 0, // Initial with deadline count
      0  // Initial completed count
    ]);

    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Update a task
router.put('/:taskId', upload.single('image'), async (req, res) => {
  try {
    const db = await connectToDatabase();
    const {
      title,
      description,
      hasDeadline,
      deadline
    } = req.body;

    const imagePath = req.file ? req.file.filename : null;

    await db.query(updateTask, [
      title,
      description,
      hasDeadline === 'true',
      hasDeadline === 'true' ? deadline : null,
      imagePath,
      req.params.taskId,
      req.userId
    ]);

    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Update task status
router.put('/:taskId/status', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { completed } = req.body;

    await db.query(updateTaskStatus, [
      completed,
      req.params.taskId,
      req.userId
    ]);

    // Update task statistics
    const [currentStats] = await db.query(getTaskStats, [req.userId]);
    const stats = currentStats[0];

    await db.query(updateTaskStats, [
      stats.n_totalTask,
      completed ? stats.n_ongoing - 1 : stats.n_ongoing + 1,
      stats.n_withDeadline,
      completed ? stats.n_completed + 1 : stats.n_completed - 1,
      req.userId
    ]);

    res.json({ message: 'Task status updated successfully' });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Error updating task status' });
  }
});

// Delete a task
router.delete('/:taskId', async (req, res) => {
  try {
    const db = await connectToDatabase();
    await db.query(deleteTask, [req.params.taskId, req.userId]);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

export default router;