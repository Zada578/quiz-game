const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// MySQL connection pool
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

// Test DB connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected: quiz DB');
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
  }
}

// API Routes
app.get("/api/questions", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT question, options, correct_index as correct FROM questions ORDER BY RAND() LIMIT 5'
    );
    // DB stores options as native arrays - no JSON.parse needed
    const questions = rows.map(row => ({
      question: row.question,
      options: row.options,
      correct: row.correct
    }));
    console.log(`✅ Sent ${questions.length} questions from DB`);
    res.json(questions);
  } catch (err) {
    console.error('DB questions error:', err.message);
    // Fallback static
    res.json([
      {
        question: "What is 2+2?",
        options: ["2", "3", "4", "5"],
        correct: 2
      },
      {
        question: "Capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correct: 2
      },
      {
        question: "Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
      },
      {
        question: "Romeo and Juliet?",
        options: ["Dickens", "Shakespeare", "Austen", "Twain"],
        correct: 1
      },
      {
        question: "Largest ocean?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: 3
      }
    ]);
  }
});

app.post('/api/score', async (req, res) => {
  try {
    const { score, total, username = 'Anonymous' } = req.body;
    await pool.execute(
      'INSERT INTO scores (score, total, username) VALUES (?, ?, ?)',
      [score, total, username]
    );
    res.json({ success: true, message: 'Score saved!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT username, score, total, created_at FROM scores ORDER BY score DESC, created_at DESC LIMIT 10'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, async () => {
  await testConnection();
  console.log(`🚀 Server running: http://localhost:${PORT}`);
  console.log('📊 API: /api/questions, /api/score, /api/leaderboard');
});

