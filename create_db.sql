CREATE DATABASE IF NOT EXISTS `quiz`;

USE `quiz`;

CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  correct_index INT NOT NULL
);

CREATE TABLE IF NOT EXISTS scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  score INT NOT NULL,
  total INT NOT NULL,
  username VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial questions
INSERT INTO questions (question, options, correct_index) VALUES
('What is the capital of France?', '["Berlin", "Madrid", "Paris", "Rome"]', 2),
('Which planet is known as the Red Planet?', '["Venus", "Mars", "Jupiter", "Saturn"]', 1),
('What is 2 + 2?', '["3", "4", "5", "6"]', 1),
('Who wrote "Romeo and Juliet"?', '["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"]', 1),
('What is the largest ocean on Earth?', '["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"]', 3);
