// Quiz App - Complete Frontend Logic
// Integrates with /api/questions, /api/score, /api/leaderboard

let quizData = [];
let totalQuestions = 0;
let currentQuestion = 0;
let answers = [];
let score = 0;
let isFeedbackShowing = false;

const startEl = document.getElementById('start');
const quizEl = document.getElementById('quiz');
const resultsEl = document.getElementById('results');
const confirmModal = document.getElementById('confirmModal');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const startBtn = document.getElementById('startBtn');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');

async function loadQuizData() {
  try {
    const response = await fetch('/api/questions');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    quizData = await response.json();
    totalQuestions = quizData.length;
    console.log(`✅ Loaded ${totalQuestions} questions`);
  } catch (error) {
    console.error('❌ Load failed:', error);
    alert('Failed to load questions. Check console.');
  }
}

function startQuiz() {
  startEl.style.display = 'none';
  quizEl.style.display = 'block';
  currentQuestion = 0;
  score = 0;
  answers = new Array(totalQuestions).fill(null);
  isFeedbackShowing = false;
  updateNavButtons();
  loadQuestion();
}

function loadQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.question;
  
  optionsEl.innerHTML = '';
  q.options.forEach((option, index) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.textContent = option;
    div.onclick = () => selectOption(index);
    if (answers[currentQuestion] === index) {
      div.classList.add('selected');
    }
  optionsEl.appendChild(div);
  });
  
  updateNavButtons();
  
  // Update progress
  updateProgress();
}

function selectOption(index) {
  // Clear previous selection
  document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
  
  // Select new
  const selected = optionsEl.children[index];
  selected.classList.add('selected');
  answers[currentQuestion] = index;
  
  updateNavButtons();
}

function nextQuestion() {
  if (currentQuestion < totalQuestions - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    showConfirmModal();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

function updateNavButtons() {
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.textContent = currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next';
  if (answers[currentQuestion] === null) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}

function updateProgress() {
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;
    progressBar.style.width = progress + '%';
  }
}

function showConfirmModal() {
  confirmModal.classList.add('active');
}

function hideConfirmModal() {
  confirmModal.classList.remove('active');
}

async function submitQuiz() {
  hideConfirmModal();
  
  // Calculate score
  score = 0;
  quizData.forEach((q, i) => {
    if (answers[i] === q.correct) score++;
  });
  
  // Save score
  const username = prompt('Name for leaderboard (optional):') || 'Anonymous';
  try {
    await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, total: totalQuestions, username })
    });
  } catch (e) {
    console.error('Score save failed:', e);
  }
  
  quizEl.style.display = 'none';
  resultsEl.style.display = 'block';
  showResults();
  loadLeaderboard();
}

function showResults() {
  document.getElementById('score').innerHTML = `
    <h2>${score}/${totalQuestions}</h2>
    <p>${Math.round((score / totalQuestions) * 100)}% Correct!</p>
    <button class="restartBtn" onclick="location.reload()">Play Again</button>
  `;
}

async function loadLeaderboard() {
  try {
    const response = await fetch('/api/leaderboard');
    const data = await response.json();
    const lbEl = document.getElementById('leaderboard');
    lbEl.innerHTML = '<h3>🏆 Top Scores</h3>' +
      (data.length ? 
        '<ol>' + data.map(entry => 
          `<li>${entry.username}: ${entry.score}/${entry.total}`
        ).join('') + '</ol>' 
        : '<p>No scores yet!</p>'
      );
  } catch (e) {
    console.error('Leaderboard failed:', e);
  }
}

function createProgressBar() {
  const nav = document.querySelector('.nav-buttons');
  const progress = document.createElement('div');
  progress.className = 'progress';
  progress.innerHTML = '<div class="progress-bar"></div>';
  nav.parentNode.insertBefore(progress, nav);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
  await loadQuizData();
  createProgressBar();
  
  startBtn.onclick = startQuiz;
  prevBtn.onclick = prevQuestion;
  nextBtn.onclick = nextQuestion;
  confirmYes.onclick = submitQuiz;
  confirmNo.onclick = hideConfirmModal;
  
  updateNavButtons();
  loadLeaderboard(); // Initial load
});
