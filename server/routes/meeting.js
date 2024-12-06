import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "No Token Provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(500).json({ message: "Unauthorized" });
    }
};

router.get('/students', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [students] = await db.query(
            'SELECT u_id, u_fullname FROM acc_tb WHERE u_role = "student"'
        );
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: "Error fetching students" });
    }
});

router.get('/teachers', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [teachers] = await db.query(
            'SELECT u_id, u_fullname FROM acc_tb WHERE u_role = "teacher"'
        );
        res.status(200).json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: "Error fetching teachers" });
    }
});

router.post('/create', verifyToken, async (req, res) => {
    try {
        const { mt_title, mt_description, mt_date, mt_time, student_id, teacher_id } = req.body;
        const db = await connectToDatabase();

        const [result] = await db.query(
            `INSERT INTO meeting_tb (teacher_id, student_id, mt_status, mt_title, mt_description, mt_date, mt_time) 
             VALUES (?, ?, 'pending', ?, ?, ?, ?)`,
            [teacher_id, student_id, mt_title, mt_description, mt_date, mt_time]
        );

        res.status(201).json({
            message: "Meeting request created successfully",
            meetingId: result.insertId
        });
    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({ message: "Error creating meeting request" });
    }
});

router.get('/list', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        
        const [meetings] = await db.query(
            `SELECT 
                m.*,
                t.u_fullname as teacher_name,
                s.u_fullname as student_name
             FROM meeting_tb m 
             JOIN acc_tb t ON m.teacher_id = t.u_id 
             JOIN acc_tb s ON m.student_id = s.u_id 
             WHERE m.teacher_id = ? OR m.student_id = ?`,
            [req.userId, req.userId]
        );

        res.status(200).json(meetings);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ message: "Error fetching meetings" });
    }
});

router.put('/status/:id', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const meetingId = req.params.id;
        const db = await connectToDatabase();

        await db.query(
            'UPDATE meeting_tb SET mt_status = ? WHERE mt_id = ?',
            [status, meetingId]
        );

        res.status(200).json({ message: "Meeting status updated successfully" });
    } catch (error) {
        console.error('Error updating meeting status:', error);
        res.status(500).json({ message: "Error updating meeting status" });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const meetingId = req.params.id;
        const db = await connectToDatabase();

        const [meetings] = await db.query(
            `SELECT 
                m.*,
                t.u_fullname as teacher_name,
                s.u_fullname as student_name
             FROM meeting_tb m 
             JOIN acc_tb t ON m.teacher_id = t.u_id 
             JOIN acc_tb s ON m.student_id = s.u_id 
             WHERE m.mt_id = ?`,
            [meetingId]
        );

        if (meetings.length === 0) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        res.status(200).json(meetings[0]);
    } catch (error) {
        console.error('Error fetching meeting details:', error);
        res.status(500).json({ message: "Error fetching meeting details" });
    }
});

export default router;