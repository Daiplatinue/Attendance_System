import mysql from 'mysql2/promise';

export const connectToDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'todo_db'
  });
  return connection;
};

// SQL queries
export const createTask = `
  INSERT INTO notes (
    u_id, n_title, n_description, n_hasDeadline, n_deadline, n_image,
    n_totalTask, n_ongoing, n_withDeadline, n_completed
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const getTasks = `
  SELECT * FROM notes WHERE u_id = ?
`;

export const updateTask = `
  UPDATE notes 
  SET n_title = ?, n_description = ?, n_hasDeadline = ?, n_deadline = ?, n_image = ?
  WHERE id = ? AND u_id = ?
`;

export const deleteTask = `
  DELETE FROM notes WHERE id = ? AND u_id = ?
`;

export const updateTaskStatus = `
  UPDATE notes 
  SET n_completed = ? 
  WHERE id = ? AND u_id = ?
`;

export const getTaskStats = `
  SELECT 
    SUM(n_totalTask) as n_totalTask,
    SUM(n_ongoing) as n_ongoing,
    SUM(n_withDeadline) as n_withDeadline,
    SUM(n_completed) as n_completed
  FROM notes 
  WHERE u_id = ?
`;

export const updateTaskStats = `
  UPDATE notes 
  SET n_totalTask = ?, n_ongoing = ?, n_withDeadline = ?, n_completed = ?
  WHERE u_id = ?
`;