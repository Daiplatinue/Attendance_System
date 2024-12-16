import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import jwt from 'jsonwebtoken';
import { upload } from '../lib/multerConfig.js';
import { generateQRCode } from '../lib/qrCodeGenerator.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "No Token Provided" })
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userId = decoded.id;
        next()
    } catch (err) {
        return res.status(500).json({ message: "Unauthorized" })
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router()

const validateAndParseStudentId = (sccId) => {
    const pattern = /^SCC-0-(\d{6})$/;
    const match = sccId.match(pattern);
    if (!match) {
        return null;
    }
    return parseInt(match[1], 10);
}

const profilesDir = path.join(__dirname, '../../profiles');
if (!fs.existsSync(profilesDir)) {
    fs.mkdirSync(profilesDir, { recursive: true });
}

router.get('/attendanceSummary', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(
            `SELECT 
                a_total AS totalAttendance, 
                a_late AS lateClockedIn, 
                a_absent AS absent, 
                a_predicate AS predicate 
             FROM attendance_tb 
             WHERE u_id = ?`,
            [req.userId]
        );

        console.log('Database response:', rows);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Attendance data not found" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.post('/fetchProfile', async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT u_profile FROM acc_tb WHERE u_id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ profileImage: rows[0].u_profile });
    } catch (error) {
        console.error('Fetch profile error:', error);
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
});


router.post('/upload', upload.single('profile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const db = await connectToDatabase();
        const userId = req.body.userId;
        const imagePath = req.file.filename;

        await db.query('UPDATE acc_tb SET u_profile = ? WHERE u_id = ?', [imagePath, userId]);

        return res.status(200).json({
            status: "Success",
            imagePath: imagePath
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            message: "Error uploading file",
            error: error.message
        });
    }
});

router.post('/register', async (req, res) => {
    const { fullname, contact, password } = req.body;
    console.log("Received registration data:", { fullname, contact });

    try {
        const db = await connectToDatabase();
        const [existingUsers] = await db.query('SELECT * FROM acc_tb WHERE u_contact = ?', [contact]);

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        const [result] = await db.query(
            `INSERT INTO acc_tb (
                u_fullname, 
                u_role, 
                u_department, 
                u_year, 
                u_email, 
                u_contact, 
                u_address, 
                u_password, 
                u_qr, 
                u_profile
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                fullname,
                'parent',
                'N/A',
                'N/A',
                'N/A',
                contact,
                'N/A',
                password,
                'N/A',
                'default.jpg'
            ]
        );

        return res.status(201).json({
            message: "User created successfully",
            userId: result.insertId
        });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Add this new endpoint to fetch users by role
router.get('/users/:role', async (req, res) => {
    try {
        const { role } = req.params;
        const db = await connectToDatabase();
        const [users] = await db.query(
            'SELECT u_id, u_fullname, u_role FROM acc_tb WHERE u_role = ?',
            [role]
        );
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Update the createAdmin endpoint to handle the parent-student relationship
router.post('/createAdmin', async (req, res) => {
    const {
        u_fullname, u_role, u_department, u_year,
        u_email, u_contact, u_address, u_password,
        u_section, u_studentParentID
    } = req.body;

    try {
        const db = await connectToDatabase();

        const [existingUsers] = await db.query(
            'SELECT * FROM acc_tb WHERE u_contact = ?',
            [u_contact]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        await db.beginTransaction();

        try {
            const currentDate = new Date().toISOString().split('T')[0];

            const [result] = await db.query(
                `INSERT INTO acc_tb (
            u_fullname, u_role, u_department, u_year,
            u_email, u_contact, u_address, u_password,
            u_profile, u_date, u_section, u_studentParentID
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    u_fullname, u_role, u_department, u_year,
                    u_email, u_contact, u_address, u_password,
                    'default.jpg', currentDate, u_section,
                    u_studentParentID || null
                ]
            );

            if (u_role === 'student') {
                await db.query(
                    `INSERT INTO attendance_tb (
              u_id, a_total, a_late, a_absent, a_predicate
            ) VALUES (?, ?, ?, ?, ?)`,
                    [
                        result.insertId,
                        0,
                        0,
                        0,
                        'New Student'
                    ]
                );
            }

            const qrCodeFilename = await generateQRCode(result.insertId);

            await db.query(
                'UPDATE acc_tb SET u_qr = ? WHERE u_id = ?',
                [qrCodeFilename, result.insertId]
            );

            await db.commit();

            return res.status(201).json({
                message: "User created successfully",
                userId: result.insertId,
                qrCode: `/profiles/${qrCodeFilename}`
            });
        } catch (error) {
            await db.rollback();
            throw error;
        }
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    const { studentId, password } = req.body;
    console.log('Received login request with ID:', studentId);
    console.log('Received Password:', password);

    try {
        const numericId = validateAndParseStudentId(studentId);
        if (numericId === null) {
            return res.status(400).json({ message: "Invalid student ID format. Please use format: SCC-0-XXXXXX" });
        }

        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM acc_tb WHERE u_id = ?', [numericId]);

        if (rows.length === 0) {
            console.log('User not found');
            return res.status(404).json({ message: "User does not exist" });
        }

        console.log('Stored Password:', rows[0].u_password);

        if (password !== rows[0].u_password) {
            console.log('Invalid credentials');
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: rows[0].u_id,
                type: rows[0].u_role
            },
            process.env.JWT_KEY,
            { expiresIn: '3h' }
        );

        console.log('Login successful');
        return res.status(200).json({
            token: token,
            type: rows[0].u_role,
            formattedId: `SCC-0-${rows[0].u_id.toString().padStart(6, '0')}`
        });

    } catch (err) {
        console.error('Error:', err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/home', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM acc_tb WHERE u_id = ?', [req.userId])

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        const user = { ...rows[0] };

        console.log(rows);
        console.log(user);

        user.formattedId = `SCC-0-${user.u_id.toString().padStart(6, '0')}`;

        return res.status(201).json({ user })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.get('/parent', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM acc_tb WHERE u_id = ?', [req.userId])
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        const user = { ...rows[0] };
        user.formattedId = `SCC-0-${user.u_id.toString().padStart(6, '0')}`;

        return res.status(201).json({ user })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.get('/teacher', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM acc_tb WHERE u_id = ?', [req.userId])
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        const user = { ...rows[0] };
        user.formattedId = `SCC-0-${user.u_id.toString().padStart(6, '0')}`;

        return res.status(201).json({ user })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.get('/admin', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM acc_tb WHERE u_id = ?', [req.userId])
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        const user = { ...rows[0] };
        user.formattedId = `SCC-0-${user.u_id.toString().padStart(6, '0')}`;

        return res.status(201).json({ user })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

// ===================

// Get student information by ID
router.get('/student/:id', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const studentId = req.params.id;

        // First verify if the requesting user (parent) has access to this student's information
        const [parentCheck] = await db.query(
            'SELECT u_studentParentID FROM acc_tb WHERE u_id = ? AND u_role = ?',
            [req.userId, 'parent']
        );

        if (parentCheck.length === 0 || parentCheck[0].u_studentParentID != studentId) {
            return res.status(403).json({ message: "Unauthorized to access this student's information" });
        }

        // Fetch student information
        const [studentRows] = await db.query(
            'SELECT * FROM acc_tb WHERE u_id = ? AND u_role = ?',
            [studentId, 'student']
        );

        if (studentRows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        const user = { ...studentRows[0] };
        user.formattedId = `SCC-0-${user.u_id.toString().padStart(6, '0')}`;

        return res.status(200).json({ user });
    } catch (err) {
        console.error('Error fetching student information:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get attendance records for a specific student
router.get('/attendance-records/:studentId', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const studentId = req.params.studentId;

        // Verify parent's access to student's information
        const [parentCheck] = await db.query(
            'SELECT u_studentParentID FROM acc_tb WHERE u_id = ? AND u_role = ?',
            [req.userId, 'parent']
        );

        if (parentCheck.length === 0 || parentCheck[0].u_studentParentID != studentId) {
            return res.status(403).json({ message: "Unauthorized to access this student's attendance records" });
        }

        // Get attendance records for the student
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
            [studentId]
        );

        res.status(200).json(records);

    } catch (error) {
        console.error('Error fetching student attendance records:', error);
        res.status(500).json({
            message: "Error fetching attendance records",
            error: error.message
        });
    }
});

// Get attendance summary for a specific student
router.get('/attendanceSummary/:studentId', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const studentId = req.params.studentId;

        // Verify parent's access to student's information
        const [parentCheck] = await db.query(
            'SELECT u_studentParentID FROM acc_tb WHERE u_id = ? AND u_role = ?',
            [req.userId, 'parent']
        );

        if (parentCheck.length === 0 || parentCheck[0].u_studentParentID != studentId) {
            return res.status(403).json({ message: "Unauthorized to access this student's attendance summary" });
        }

        // Get attendance summary for the student
        const [rows] = await db.query(
            `SELECT 
                a_total AS totalAttendance, 
                a_late AS lateClockedIn, 
                a_absent AS absent, 
                a_predicate AS predicate 
             FROM attendance_tb 
             WHERE u_id = ?`,
            [studentId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Attendance data not found" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching student attendance summary:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add this route to your authRouter.js file
router.put('/updateProfile', verifyToken, async (req, res) => {
    try {
        const {
            fullname,
            department,
            year,
            email,
            contact,
            address
        } = req.body;

        const db = await connectToDatabase();

        await db.query(
            `UPDATE acc_tb SET 
          u_fullname = ?,
          u_department = ?,
          u_year = ?,
          u_email = ?,
          u_contact = ?,
          u_address = ?
        WHERE u_id = ?`,
            [fullname, department, year, email, contact, address, req.userId]
        );

        return res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error("Update profile error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Add this endpoint to fetch all accounts
router.get('/accounts', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(`
            SELECT 
                u_id,
                u_fullname,
                u_role,
                u_department,
                u_email,
                u_contact,
                u_date
            FROM acc_tb
            ORDER BY u_date DESC
        `);

        return res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;