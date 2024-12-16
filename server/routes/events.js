  import express from 'express';
  import { connectToDatabase } from '../lib/db.js';

  const router = express.Router();

  // Get all events
  router.get('/fetchEvents', async (req, res) => {
    try {
      const db = await connectToDatabase();
      const [rows] = await db.query('SELECT * FROM events_tb ORDER BY e_startDate DESC');

      // Transform the database rows to match the frontend Event type
      const events = rows.map(row => ({
        id: row.e_id,
        name: row.e_title,
        type: row.e_type,
        location: row.e_location,
        startDate: row.e_startDate,
        endDate: row.e_endDate,
        startTime: row.e_startTime,
        endTime: row.e_endTime,
        status: row.e_status,
        departments: row.e_department.split(',').map(dept => dept.trim()),
        organizer: row.e_organizer,
        description: row.e_description, // Fixed: Changed from e_desc to e_description
        avatarUrl: row.e_avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${row.e_type.toLowerCase()}`
      }));

      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
  });

  // Create a new event
  router.post('/createEvent', async (req, res) => {
    try {
      const {
        name,
        type,
        location,
        startDate,
        endDate,
        startTime,
        endTime,
        departments,
        organizer,
        description,
        avatarUrl,
        status = 'Upcoming'
      } = req.body;

      // Input validation
      if (!name || !type || !location || !startDate || !endDate || !startTime || !endTime || !departments || !organizer || !description) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }

      const db = await connectToDatabase();

      // Format departments array to string
      const departmentsString = Array.isArray(departments) ? departments.join(', ') : departments;

      // Generate avatar URL if not provided
      const finalAvatarUrl = avatarUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${type.toLowerCase()}`;

      const [result] = await db.query(
        `INSERT INTO events_tb (
          e_title,
          e_type,
          e_location,
          e_startDate,
          e_endDate,
          e_startTime,
          e_endTime,
          e_department,
          e_organizer,
          e_description,
          e_avatar,
          e_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          type,
          location,
          startDate,
          endDate,
          startTime,
          endTime,
          departmentsString,
          organizer,
          description,
          finalAvatarUrl,
          status
        ]
      );

      const newEvent = {
        id: result.insertId,
        name,
        type,
        location,
        startDate,
        endDate,
        startTime,
        endTime,
        status,
        departments: Array.isArray(departments) ? departments : departments.split(',').map(dept => dept.trim()),
        organizer,
        description,
        avatarUrl: finalAvatarUrl
      };

      res.status(201).json({
        message: 'Event created successfully',
        event: newEvent
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Error creating event', error: error.message });
    }
  });

  export default router;