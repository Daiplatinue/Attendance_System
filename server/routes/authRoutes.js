import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import jwt from 'jsonwebtoken';
import { upload } from '../lib/multerConfig.js';
import { generateQRCode } from '../lib/qrCodeGenerator.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

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

router.post('/createAdmin', async (req, res) => {
    const { 
        u_fullname, u_role, u_department, u_year, 
        u_email, u_contact, u_address, u_password 
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

        const [result] = await db.query(
            `INSERT INTO acc_tb (
                u_fullname, u_role, u_department, u_year,
                u_email, u_contact, u_address, u_password,
                u_profile
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                u_fullname, u_role, u_department, u_year,
                u_email, u_contact, u_address, u_password,
                'default.jpg'
            ]
        );

        const qrCodeFilename = await generateQRCode(result.insertId);
        
        await db.query(
            'UPDATE acc_tb SET u_qr = ? WHERE u_id = ?',
            [qrCodeFilename, result.insertId]
        );

        return res.status(201).json({ 
            message: "User created successfully",
            userId: result.insertId,
            qrCode: `/profiles/${qrCodeFilename}` 
        });
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

router.get('/home', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM acc_tb WHERE u_id = ?', [req.userId])
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        const user = {...rows[0]};
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

        const user = {...rows[0]};
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

        const user = {...rows[0]};
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

        const user = {...rows[0]};
        user.formattedId = `SCC-0-${user.u_id.toString().padStart(6, '0')}`;

        return res.status(201).json({ user })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

export default router;

// import bcrypt from 'bcrypt'

// router.post('/login', async (req, res) => {
    //     const { studentId, password } = req.body;
    //     console.log('Received login request with ID:', studentId);
    //     console.log('Received Password:', password);
    
    //     try {
        //         const db = await connectToDatabase();
//         const [rows] = await db.query('SELECT * FROM accounts WHERE id = ?', [studentId]);

//         if (rows.length === 0) {
    //             console.log('User not found');
//             return res.status(404).json({ message: "User does not exist" });
//         }

//         console.log('Stored Hashed Password:', rows[0].password);

//         const isMatch = await bcrypt.compare(password, rows[0].password);
//         if (!isMatch) {
    //             console.log('Plain Password:', password);
    //             console.log('Stored Hash:', rows[0].password);
    
    //             return res.status(401).json({ message: "Invalid credentials", isMatch });
    //         }
    
    //         const token = jwt.sign({ id: rows[0].id, type: rows[0].type }, process.env.JWT_KEY, { expiresIn: '3h' });
    //         // const token = jwt.sign({ id: rows[0].id }, process.env.JWT_KEY, { expiresIn: '3h' })
    
    //         console.log('Login successful, sending token');
    //         return res.status(200).json({ token: token, type: rows[0].type });
    
    //     } catch (err) {
//         console.error('Error:', err.message);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// });


// router.post('/register', async (req, res) => {
//     const { fullname, contact, password } = req.body;
//     try {
//         const db = await connectToDatabase();
//         const [rows] = await db.query('SELECT * FROM accounts WHERE contact = ?', [contact]);

//         if (rows.length > 0) {
//             return res.status(409).json({ message: "User already exists" });
//         }

//         const hashPassword = await bcrypt.hash(password, 10);
//         await db.query(
//             "INSERT INTO accounts (fullname, contact, password, type) VALUES (?, ?, ?, 'student')",
//             [fullname, contact, hashPassword]
//         );

//         return res.status(201).json({ message: "User created successfully" });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// });