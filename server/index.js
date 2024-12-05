import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import leaderboardRoutes from './routes/leaderboard.js';
import eventRouter from './routes/events.js'
import announcementRouter from './routes/announcement.js';

dotenv.config()

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}))

app.use(express.json())
app.use('/auth', authRouter)
app.use('/announcements', announcementRouter); // Mount announcement routes 
app.use('/api', eventRouter); // Mount event routes under /api
app.use('/profiles', express.static(path.join(__dirname, 'profiles')));
app.use(leaderboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});


app.get('/', (req, res) => {
    res.send("Server is running")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`)
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

app.post('/api/send-email', async (req, res) => {
    try {
        const { to, message } = req.body;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'Student Attendance Monitoring System',
            text: message,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});