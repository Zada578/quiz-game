const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetDB() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'quiz',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    const connection = await pool.getConnection();

    await connection.execute('DROP TABLE IF EXISTS scores');
    await connection.execute('DROP TABLE IF EXISTS questions');
    await connection.execute(`
      CREATE TABLE questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT NOT NULL,
        options JSON NOT NULL,
        correct_index INT NOT NULL
      )
    `);
    await connection.execute(`
      CREATE TABLE scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        score INT NOT NULL,
        total INT NOT NULL,
        username VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert correct data
    await connection.execute(`
      INSERT INTO questions (question, options, correct_index) VALUES
      ('What is the capital of France?', '["Berlin", "Madrid", "Paris", "Rome"]', 2),
      ('Which planet is known as the Red Planet?', '["Venus", "Mars", "Jupiter", "Saturn"]', 1),
      ('What is 2 + 2?', '["3", "4", "5", "6"]', 1),
      ('Who wrote "Romeo and Juliet"?', '["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"]', 1),
      ('What is the largest ocean on Earth?', '["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"]', 3)
    `);

    console.log('✅ Database reset successfully! Tables created, 5 questions inserted.');
  } catch (err) {
    console.error('❌ Reset failed:', err.message);
  } finally {
    await pool.end();
  }
}

resetDB();
