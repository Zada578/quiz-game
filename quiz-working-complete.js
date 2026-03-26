// COMPLETE WORKING QUIZ - DB + Static Fallback
// Questions load, scores save, leaderboard shows

let quizData = [];
let totalQuestions = 0;
let currentQuestion = 0;
let answers = [];
let score = 0;

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
    const data = await response.json();
    quizData = Array.isArray(data) ? data : [];
    totalQuestions = quizData.length;
    console.log(`✅ Loaded ${totalQuestions} questions`);
  } catch (e) {
    console.log('API failed, using static');
    quizData = [
      {question: 'What is 2+2?', options: ['2', '3', '4', '5'], correct: 2},
      {question: 'Capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], correct: 2},
      {question: 'Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1},
      {question: 'Romeo author?', options: ['Dickens', 'Shakespeare', 'Austen', 'Twain'], correct: 1},
      {question: 'Largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3}
    ];
    totalQuestions = 5;
  }
}

function startQuiz() {
  startEl.style.display = 'none';
  quizEl.style.display = 'block';
  currentQuestion = 0;
  score = 0;
  answers = new Array(totalQuestions).fill(null);
  loadQuestion();
  updateNavButtons();
}

function loadQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = `${currentQuestion + 1}. ${q.question}`;
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
  Array.from(optionsEl.children).forEach(opt => opt.classList.remove('selected'));
  optionsEl.children[index].classList.add('selected');
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
  nextBtn.disabled = answers[currentQuestion] === null;
  nextBtn.textContent = currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next';
}

function updateProgress() {
  const bar = document.querySelector('.progress-bar');
  if (bar) bar.style.width = `${((currentQuestion + 1) / totalQuestions) * 100}%`;
}

function showConfirmModal() {
  confirmModal.classList.add('active');
}

function hideConfirmModal() {
  confirmModal.classList.remove('active');
}

async function submitQuiz() {
  hideConfirmModal();
  score = answers.reduce((s, ans, i) => s + (ans === quizData[i].correct ? 1 : 0), 0);
  
  // Save score
  const username = prompt('Your name:') || 'Anonymous';
  fetch('/api/score', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({score, total: totalQuestions, username})
  }).catch(e => console.log('Score save failed'));
  
  quizEl.style.display = 'none';
  resultsEl.style.display = 'block';
  document.getElementById('score').innerHTML = `
    <h2>${score}/${totalQuestions}</h2>
    <p>${Math.round(score/totalQuestions*100)}%</p>
    <button onclick="location.reload()">Play Again</button>
  `;
  loadLeaderboard();
}

async function loadLeaderboard() {
  const lbEl = document.getElementById('leaderboard');
  try {
    const response = await fetch('/api/leaderboard');
    const data = await response.json();
    lbEl.innerHTML = '<h3>🏆 Top Scores</h3>' + 
      (data.length ? '<ol>' + data.map(r => `<li>${r.username}: ${r.score}/${r.total}`).join('') + '</ol>' : '<p>No scores</p>');
  } catch {
    lbEl.innerHTML = '<p>Leaderboard unavailable</p>';
  }
}

function createProgressBar() {
  const nav = document.querySelector('.nav-buttons');
  if (nav && !document.querySelector('.progress')) {
    const p = document.createElement('div');
    p.className = 'progress';
    p.innerHTML = '<div class="progress-bar"></div>';
    nav.parentNode.insertBefore(p, nav);
  }
}

// INIT
document.addEventListener('DOMContentLoaded', async () => {
  await loadQuizData();
  createProgressBar();
  loadLeaderboard();
  
  startBtn.onclick = startQuiz;
  prevBtn.onclick = prevQuestion;
  nextBtn.onclick = nextQuestion;
  confirmYes.onclick = submitQuiz;
  confirmNo.onclick = hideConfirmModal;
});
