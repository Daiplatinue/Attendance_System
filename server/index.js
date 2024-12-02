import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer';

dotenv.config()

const app = express()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}))
app.use(express.json())
app.use('/auth', authRouter)

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
            subject: 'New Message',
            text: message,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});
