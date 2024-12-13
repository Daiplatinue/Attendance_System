import { connectToDatabase } from '../lib/db.js';

export const getUserSection = async (userId) => {
    const db = await connectToDatabase();
    const [userRows] = await db.query(
        'SELECT u_section, u_id FROM acc_tb WHERE u_id = ?',
        [userId]
    );
    return userRows[0] || null;
};

export const getCurrentSchedule = async (section, currentDay, currentTime) => {
    const db = await connectToDatabase();
    const [schedules] = await db.query( 
        `SELECT 
            sc_subject as currentSubject,
            sc_startTime as startTime,
            sc_endTime as endTime,
            sc_room as room
         FROM schedule_tb
         WHERE sc_section = ?
         AND sc_day = ?
         AND TIME(?) >= TIME(sc_startTime)
         AND TIME(?) <= TIME(sc_endTime)`,
        [section, currentDay, currentTime, currentTime]
    );
    return schedules[0] || null;
};

export const getNextSchedule = async (section, currentDay, currentTime) => {
    const db = await connectToDatabase();
    const [nextSchedule] = await db.query(
        `SELECT 
            sc_subject as currentSubject,
            sc_startTime as startTime,
            sc_endTime as endTime,
            sc_room as room
         FROM schedule_tb
         WHERE sc_section = ?
         AND sc_day = ?
         AND TIME(sc_startTime) > TIME(?)
         ORDER BY sc_startTime ASC
         LIMIT 1`,
        [section, currentDay, currentTime]
    );
    return nextSchedule[0] || null;
};