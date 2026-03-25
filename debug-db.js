const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugDB() {
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
    const [rows] = await pool.execute('SELECT id, question, options, correct_index FROM questions ORDER BY id');
    console.log('Raw questions from DB:');
    rows.forEach((row, i) => {
      console.log(`Q${i+1}:`, {
        id: row.id,
        question: row.question.substring(0, 50) + '...',
        options_raw: row.options,
        options_type: typeof row.options,
        correct: row.correct_index
      });
      try {
        const parsed = JSON.parse(row.options);
        console.log('  → Parsed OK:', parsed);
      } catch (e) {
        console.log('  → Parse ERROR:', e.message);
      }
    });
  } catch (err) {
    console.error('Query failed:', err.message);
  } finally {
    await pool.end();
  }
}

debugDB();
