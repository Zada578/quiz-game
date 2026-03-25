// Complete Working Quiz - Hardcoded, Full Functionality
const quizData = [
  {"question": "What is the capital of France?", "options": ["Berlin", "Madrid", "Paris", "Rome"], "correct": 2},
  {"question": "Red Planet?", "options": ["Venus", "Mars", "Jupiter", "Saturn"], "correct": 1},
  {"question": "2 + 2?", "options": ["3", "4", "5", "6"], "correct": 1},
  {"question": "Romeo and Juliet author?", "options": ["Dickens", "Shakespeare", "Austen", "Twain"], "correct": 1},
  {"question": "Largest ocean?", "options": ["Atlantic", "Indian", "Arctic", "Pacific"], "correct": 3}
];
const totalQuestions = quizData.length;

let currentQuestion = 0;
let answers = [];
let score = 0;

let startEl, quizEl, resultsEl, confirmModal, questionEl, optionsEl, prevBtn, nextBtn, confirmYes, confirmNo, scoreEl;

document.addEventListener('DOMContentLoaded', () => {
  startEl = document.getElementById('start');
  quizEl = document.getElementById('quiz');
  resultsEl = document.getElementById('results');
  confirmModal = document.getElementById('confirmModal');
  questionEl = document.getElementById('question');
  optionsEl = document.getElementById('options');
  prevBtn = document.getElementById('prevBtn');
  nextBtn = document.getElementById('nextBtn');
  confirmYes = document.getElementById('confirmYes');
  confirmNo = document.getElementById('confirmNo');
  scoreEl = document.getElementById('score');

  document.getElementById('startBtn').onclick = startQuiz;
  prevBtn.onclick = prevQuestion;
  nextBtn.onclick = nextQuestion;
  confirmYes.onclick = submitQuiz;
  confirmNo.onclick = hideConfirmModal;

  createProgressBar();
});

function startQuiz() {
  startEl.style.display = 'none';
  quizEl.style.display = 'block';
  currentQuestion = 0;
  answers = new Array(totalQuestions).fill(null);
  score = 0;
  loadQuestion();
  updateNavButtons();
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
    if (answers[currentQuestion] === index) div.classList.add('selected');
    optionsEl.appendChild(div);
  });
  updateProgress();
}

function selectOption(index) {
  // Clear previous
  Array.from(optionsEl.children).forEach(opt => opt.classList.remove('selected'));
  optionsEl.children[index].classList.add('selected');
  answers[currentQuestion] = index;
  updateNavButtons();
}

function nextQuestion() {
  if (answers[currentQuestion] !== null) {
    if (currentQuestion < totalQuestions - 1) {
      currentQuestion++;
      loadQuestion();
      updateNavButtons();
    } else {
      showConfirmModal();
    }
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
    updateNavButtons();
  }
}

function updateNavButtons() {
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = answers[currentQuestion] === null;
  nextBtn.textContent = currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next';
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

function submitQuiz() {
  hideConfirmModal();
  score = answers.reduce((s, ans, i) => s + (ans === quizData[i].correct ? 1 : 0), 0);
  quizEl.style.display = 'none';
  resultsEl.style.display = 'block';
  scoreEl.innerHTML = `
    <h2>${score}/${totalQuestions}</h2>
    <p>${Math.round(score / totalQuestions * 100)}%</p>
    <button onclick="location.reload()">Play Again</button>
  `;
  loadLeaderboard(); // stub
}

function createProgressBar() {
  const navButtons = document.querySelector('.nav-buttons');
  const progress = document.createElement('div');
  progress.className = 'progress-container';
  progress.innerHTML = '<div class="progress-bar"></div>';
  navButtons.parentNode.insertBefore(progress, navButtons);
}

function loadLeaderboard() {
  const lbEl = document.getElementById('leaderboard');
  lbEl.innerHTML = '<h3>Top Scores</h3><p>No scores yet</p>';
}
