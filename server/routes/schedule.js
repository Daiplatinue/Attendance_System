import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../routes/authMiddleware.js';
import { getUserSection, getCurrentSchedule, getNextSchedule } from '../routes/scheduleService.js';
import { getCurrentTimeInfo } from '../routes/dateUtils.js';


const router = express.Router();

// Get current schedule endpoint
router.get('/current-schedule', verifyToken, async (req, res) => {
    try {
        // Get user's section
        const user = await getUserSection(req.userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found'
            });
        }

        if (!user.u_section) {
            return res.status(200).json({ 
                success: true,
                currentSubject: 'No scheduled class',
                message: 'No section assigned to user'
            });
        }

        // Get current time info
        const { currentDay, currentTime } = getCurrentTimeInfo();

        // Get current schedule
        const currentSchedule = await getCurrentSchedule(user.u_section, currentDay, currentTime);

        if (!currentSchedule) {
            // Get next schedule if no current schedule
            const nextSchedule = await getNextSchedule(user.u_section, currentDay, currentTime);
            
            const message = nextSchedule 
                ? `Next class starts at ${nextSchedule.startTime}`
                : 'No more classes scheduled for today';

            return res.status(200).json({ 
                success: true,
                currentSubject: 'No scheduled class',
                message: message,
                section: user.u_section,
                nextClass: nextSchedule
            });
        }

        res.status(200).json({
            success: true,
            currentSubject: currentSchedule.currentSubject,
            startTime: currentSchedule.startTime,
            endTime: currentSchedule.endTime,
            room: currentSchedule.room,
            section: user.u_section,
            day: currentDay
        });

    } catch (error) {
        console.error('Error fetching current schedule:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching schedule",
            error: error.message 
        });
    }
});

// Create new schedule endpoint
router.post('/create-schedule', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { subject_name, day_of_week, start_time, end_time, section, room } = req.body;
        
        // Validate required fields
        if (!subject_name || !day_of_week || !start_time || !end_time || !section || !room) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check for schedule conflicts
        const [conflicts] = await db.query(
            `SELECT 
                sc_subject,
                sc_startTime,
                sc_endTime
             FROM schedule_tb 
             WHERE sc_day = ? 
             AND ((sc_startTime = ? AND sc_endTime = ?)
             OR (TIME(?) BETWEEN sc_startTime AND sc_endTime)
             OR (TIME(?) BETWEEN sc_startTime AND sc_endTime))`,
            [day_of_week, start_time, end_time, start_time, end_time]
        );

        if (conflicts.length > 0) {
            const conflictingClass = conflicts[0];
            return res.status(409).json({ 
                message: "Schedule conflict detected",
                conflict: {
                    subject: conflictingClass.sc_subject,
                    startTime: conflictingClass.sc_startTime,
                    endTime: conflictingClass.sc_endTime
                }
            });
        }

        // Insert new schedule with AM/PM format directly
        const [result] = await db.query(
            `INSERT INTO schedule_tb (
                sc_subject, 
                sc_day, 
                sc_startTime, 
                sc_endTime, 
                sc_section, 
                sc_room,
                u_id,
                sc_createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
                subject_name,
                day_of_week,
                start_time,  // Store the time directly with AM/PM
                end_time,    // Store the time directly with AM/PM
                section,
                room,
                req.userId
            ]
        );

        if (result.affectedRows === 1) {
            res.status(201).json({ 
                message: "Schedule created successfully",
                scheduleId: result.insertId,
                schedule: {
                    subject: subject_name,
                    day: day_of_week,
                    startTime: start_time,
                    endTime: end_time,
                    section: section,
                    room: room
                }
            });
        } else {
            throw new Error("Failed to create schedule");
        }

    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ 
            message: "Error creating schedule",
            error: error.message 
        });
    }
});

// Get schedule by section endpoint
router.get('/section-schedule/:section', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const section = req.params.section;
        
        const [schedules] = await db.query(
            `SELECT 
                sc_id,
                sc_subject,
                sc_day,
                sc_startTime,
                sc_endTime,
                sc_room,
                sc_section
             FROM schedule_tb
             WHERE sc_section = ?
             ORDER BY 
                CASE sc_day
                    WHEN 'Monday' THEN 1
                    WHEN 'Tuesday' THEN 2
                    WHEN 'Wednesday' THEN 3
                    WHEN 'Thursday' THEN 4
                    WHEN 'Friday' THEN 5
                    WHEN 'Saturday' THEN 6
                    WHEN 'Sunday' THEN 7
                END,
                sc_startTime`,
            [section]
        );

        if (schedules.length === 0) {
            return res.status(200).json({ 
                message: 'No schedules found for this section',
                schedules: []
            });
        }

        res.status(200).json({
            message: 'Schedules retrieved successfully',
            schedules: schedules
        });

    } catch (error) {
        console.error('Error fetching section schedules:', error);
        res.status(500).json({ 
            message: "Error fetching schedules",
            error: error.message 
        });
    }
});

// Get schedule by section endpoint
router.get('/section-schedule', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        
        // First, get the user's section from acc_tb
        const [userRows] = await db.query(
            'SELECT u_section FROM acc_tb WHERE u_id = ?',
            [req.userId]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ 
                message: 'User not found',
                schedules: []
            });
        }

        const userSection = userRows[0].u_section;
        
        // Then fetch schedules for that section
        const [schedules] = await db.query(
            `SELECT 
                sc_id,
                sc_subject,
                sc_day,
                sc_startTime,
                sc_endTime,
                sc_room,
                sc_section
             FROM schedule_tb
             WHERE sc_section = ?
             ORDER BY 
                CASE sc_day
                    WHEN 'Monday' THEN 1
                    WHEN 'Tuesday' THEN 2
                    WHEN 'Wednesday' THEN 3
                    WHEN 'Thursday' THEN 4
                    WHEN 'Friday' THEN 5
                    WHEN 'Saturday' THEN 6
                    WHEN 'Sunday' THEN 7
                END,
                sc_startTime`,
            [userSection]
        );

        if (schedules.length === 0) {
            return res.status(200).json({ 
                message: 'No schedules found for your section',
                schedules: []
            });
        }

        res.status(200).json({
            message: 'Schedules retrieved successfully',
            schedules: schedules
        });

    } catch (error) {
        console.error('Error fetching section schedules:', error);
        res.status(500).json({ 
            message: "Error fetching schedules",
            error: error.message 
        });
    }
});

export default router;