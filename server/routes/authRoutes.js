// import bcrypt from 'bcrypt'

import express from 'express'
import { connectToDatabase } from '../lib/db.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/register', async (req, res) => {
    const { fullname, contact, password } = req.body;
    console.log("Received password:", password);
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM accounts WHERE contact = ?', [contact]);

        if (rows.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        await db.query(
            "INSERT INTO accounts (fullname, contact, password, type) VALUES (?, ?, ?, 'student')",
            [fullname, contact, password] // Store the plain text password
        );

        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    const { studentId, password } = req.body;
    console.log('Received login request with ID:', studentId);
    console.log('Received Password:', password);
    
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM accounts WHERE id = ?', [studentId]);
        
        if (rows.length === 0) {
            console.log('User not found');
            return res.status(404).json({ message: "User does not exist" });
        }

        console.log('Stored Password:', rows[0].password);
        
        if (password !== rows[0].password) {
            console.log('Invalid credentials');
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: rows[0].id, type: rows[0].type }, process.env.JWT_KEY, { expiresIn: '3h' });

        console.log('Login successful');
        return res.status(200).json({ token: token, type: rows[0].type });
        
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
        const [rows] = await db.query('SELECT * FROM accounts WHERE id = ?', [req.userId])
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(201).json({ user: rows[0] })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.get('/parent', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM accounts WHERE id = ?', [req.userId])
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(201).json({ user: rows[0] })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.get('/teacher', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM accounts WHERE id = ?', [req.userId])
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(201).json({ user: rows[0] })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.get('/admin', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM accounts WHERE id = ?', [req.userId])
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(201).json({ user: rows[0] })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

export default router;  



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