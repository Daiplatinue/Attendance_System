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
                start_time,
                end_time,
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

// Record attendance endpoint
router.post('/record-attendance', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { ts_subject, ts_date, ts_clockedIn, ts_status } = req.body;

        // Validate required fields
        if (!ts_subject || !ts_date || !ts_clockedIn || !ts_status) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check for existing attendance record for the same user, subject, and date
        const [existingRecord] = await db.query(
            `SELECT ts_id 
             FROM time_tb 
             WHERE u_id = ? 
             AND ts_subject = ? 
             AND DATE(ts_date) = DATE(?)
             AND ts_clockedOut IS NULL`,
            [req.userId, ts_subject, ts_date]
        );

        if (existingRecord.length > 0) {
            // Update existing record with clock out time
            const [updateResult] = await db.query(
                `UPDATE time_tb 
                 SET ts_clockedOut = ?
                 WHERE ts_id = ?`,
                [ts_clockedIn, existingRecord[0].ts_id]
            );

            if (updateResult.affectedRows === 1) {
                return res.status(200).json({
                    message: "Attendance updated successfully",
                    attendanceId: existingRecord[0].ts_id,
                    clockedOut: ts_clockedIn
                });
            }
        }

        // If no existing record, create a new one
        const [insertResult] = await db.query(
            `INSERT INTO time_tb (
                u_id,
                ts_subject,
                ts_date,
                ts_clockedIn,
                ts_status
            ) VALUES (?, ?, ?, ?, ?)`,
            [req.userId, ts_subject, ts_date, ts_clockedIn, ts_status]
        );

        if (insertResult.affectedRows === 1) {
            res.status(201).json({
                message: "Attendance recorded successfully",
                attendanceId: insertResult.insertId
            });
        } else {
            throw new Error("Failed to record attendance");
        }

    } catch (error) {
        console.error('Error recording attendance:', error);
        res.status(500).json({
            message: "Error recording attendance",
            error: error.message
        });
    }
});

// Check attendance endpoint
router.get('/check-attendance', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const currentDate = new Date().toLocaleDateString();

        // Get the current schedule
        const { currentDay, currentTime } = getCurrentTimeInfo();
        const [userRows] = await db.query(
            'SELECT u_section FROM acc_tb WHERE u_id = ?',
            [req.userId]
        );

        if (!userRows.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentSchedule = await getCurrentSchedule(userRows[0].u_section, currentDay, currentTime);

        if (!currentSchedule) {
            return res.status(200).json({ exists: false });
        }

        // Check for existing attendance record
        const [existingRecord] = await db.query(
            `SELECT ts_id, ts_clockedIn, ts_clockedOut 
         FROM time_tb 
         WHERE u_id = ? 
         AND ts_subject = ? 
         AND DATE(ts_date) = DATE(?)
         AND ts_clockedOut IS NULL`,
            [req.userId, currentSchedule.currentSubject, currentDate]
        );

        if (existingRecord.length === 0) {
            return res.status(200).json({ exists: false });
        }

        res.status(200).json({
            exists: true,
            record: existingRecord[0]
        });

    } catch (error) {
        console.error('Error checking attendance:', error);
        res.status(500).json({
            message: "Error checking attendance",
            error: error.message
        });
    }
});

// Update attendance endpoint
router.put('/update-attendance', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { ts_clockedOut, ts_id } = req.body;

        // Validate required fields
        if (!ts_clockedOut || !ts_id) {
            return res.status(400).json({ message: "Clock out time and attendance ID are required" });
        }

        // Verify the attendance record belongs to the user
        const [recordCheck] = await db.query(
            'SELECT ts_id FROM time_tb WHERE ts_id = ? AND u_id = ?',
            [ts_id, req.userId]
        );

        if (recordCheck.length === 0) {
            return res.status(403).json({ message: "Unauthorized to update this attendance record" });
        }

        // Update the attendance record
        const [result] = await db.query(
            `UPDATE time_tb 
         SET ts_clockedOut = ?
         WHERE ts_id = ?`,
            [ts_clockedOut, ts_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        res.status(200).json({
            message: "Attendance updated successfully",
            clockedOut: ts_clockedOut
        });

    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({
            message: "Error updating attendance",
            error: error.message
        });
    }
});

// Add a new endpoint to fetch attendance records
router.get('/attendance-records', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();

        // Get attendance records for the user
        const [records] = await db.query(
            `SELECT 
                ts_subject,
                ts_date,
                ts_clockedIn,
                ts_clockedOut,
                ts_status
             FROM time_tb
             WHERE u_id = ?
             ORDER BY ts_date DESC
             LIMIT 9`,
            [req.userId]
        );

        res.status(200).json(records);

    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({
            message: "Error fetching attendance records",
            error: error.message
        });
    }
});

// Get parent information endpoint
router.get('/get-parent/:userId', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const userId = req.params.userId;

        // Get student's information
        const [studentRows] = await db.query(
            'SELECT u_id FROM acc_tb WHERE u_id = ? AND u_role = "student"',
            [userId]
        );

        if (studentRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Get parent's information
        const [parentRows] = await db.query(
            'SELECT u_id as parentId FROM acc_tb WHERE u_role = "parent" AND u_studentParentID = ?',
            [userId]
        );

        if (parentRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Parent not found for this student'
            });
        }

        res.status(200).json({
            success: true,
            parentId: parentRows[0].parentId
        });

    } catch (error) {
        console.error('Error fetching parent information:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching parent information',
            error: error.message
        });
    }
});

// Create notification endpoint
router.post('/create-notification', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const {
            u_id,
            u_studentParentID,
            nt_description,
            ts_clockedIn,
            ts_clockedOut,
            ts_date,
            ts_status
        } = req.body;

        // Validate required fields
        if (!u_id || !u_studentParentID || !nt_description || !ts_date || !ts_status) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Convert date to MySQL timestamp format
        const mysqlDate = new Date(ts_date * 1000).toISOString().slice(0, 19).replace('T', ' ');

        // Check for existing notification without clockout
        const [existingNotification] = await db.query(
            `SELECT nt_id, ts_clockedIn FROM notification_tb 
             WHERE u_id = ? 
             AND DATE(ts_date) = DATE(?) 
             AND ts_clockedOut IS NULL`,
            [u_id, mysqlDate]
        );

        if (existingNotification.length > 0) {
            // Update existing notification with clockout time
            const [updateResult] = await db.query(
                `UPDATE notification_tb 
                 SET ts_clockedOut = ?,
                     nt_description = ?
                 WHERE nt_id = ?`,
                [ts_clockedOut, nt_description, existingNotification[0].nt_id]
            );

            if (updateResult.affectedRows === 1) {
                return res.status(200).json({
                    success: true,
                    message: 'Notification updated with clockout time',
                    notificationId: existingNotification[0].nt_id
                });
            }
        } else {
            // Check if there's an existing notification with clockout
            const [completedNotification] = await db.query(
                `SELECT nt_id FROM notification_tb 
                 WHERE u_id = ? 
                 AND DATE(ts_date) = DATE(?) 
                 AND ts_clockedOut IS NOT NULL`,
                [u_id, mysqlDate]
            );

            // If there's a completed notification or none, create a new one
            const [result] = await db.query(
                `INSERT INTO notification_tb (
                    u_id,
                    u_studentParentID,
                    nt_description,
                    ts_clockedIn,
                    ts_clockedOut,
                    ts_date,
                    ts_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    u_id,
                    u_studentParentID,
                    nt_description,
                    ts_clockedIn,
                    ts_clockedOut,
                    mysqlDate,
                    ts_status
                ]
            );

            // Update attendance counts in attendance_tb
            const [attendanceRecord] = await db.query(
                'SELECT * FROM attendance_tb WHERE u_id = ?',
                [u_id]
            );

            if (attendanceRecord.length > 0) {
                // Update existing record
                let updateQuery = '';
                let updateValue = 0;

                if (ts_status === 1) { // On Time
                    updateQuery = 'UPDATE attendance_tb SET a_total = a_total + 1 WHERE u_id = ?';
                } else if (ts_status === 2 || ts_status === 3) { // Late or Very Late
                    updateQuery = 'UPDATE attendance_tb SET a_late = a_late + 1 WHERE u_id = ?';
                } else if (ts_status === 4) { // Absent
                    updateQuery = 'UPDATE attendance_tb SET a_absent = a_absent + 1 WHERE u_id = ?';
                }

                if (updateQuery) {
                    await db.query(updateQuery, [u_id]);
                }
            } else {
                // Create new attendance record
                const initialTotal = ts_status === 1 ? 1 : 0;
                const initialLate = (ts_status === 2 || ts_status === 3) ? 1 : 0;
                const initialAbsent = ts_status === 4 ? 1 : 0;

                await db.query(
                    'INSERT INTO attendance_tb (u_id, a_total, a_late, a_absent) VALUES (?, ?, ?, ?)',
                    [u_id, initialTotal, initialLate, initialAbsent]
                );
            }

            if (result.affectedRows === 1) {
                res.status(201).json({
                    success: true,
                    message: 'New notification created successfully',
                    notificationId: result.insertId
                });
            } else {
                throw new Error('Failed to create notification');
            }
        }

    } catch (error) {
        console.error('Error managing notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error managing notification',
            error: error.message
        });
    }
});

// Add this new endpoint to your schedule.js router
router.get('/notifications', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        
        // Join with acc_tb to get user full name
        const [notifications] = await db.query(
            `SELECT 
                a.u_fullname as u_fn,
                n.nt_description,
                n.ts_date
             FROM notification_tb n
             JOIN acc_tb a ON n.u_id = a.u_id
             WHERE n.u_studentParentID = ?
             ORDER BY n.ts_date DESC`,
            [req.userId]
        );

        res.status(200).json(notifications);

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
});

export default router;