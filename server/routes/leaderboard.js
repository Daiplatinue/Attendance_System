import express from 'express';
import { connectToDatabase } from '../lib/db.js';

const router = express.Router();

router.get('/api/leaderboard', async (req, res) => {
    try {
        const db = await connectToDatabase();
        
        const [rows] = await db.query(`
            SELECT 
                acc.u_id,
                acc.u_fullname,
                acc.u_department,
                acc.u_profile,
                att.a_total
            FROM acc_tb acc
            JOIN attendance_tb att ON acc.u_id = att.u_id
            ORDER BY att.a_total DESC
        `);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;