// Working Quiz JS - Hardcoded + API fallback
const quizData = [
  {
    "question": "What is the capital of France?",
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correct": 2
  },
  {
    "question": "Which planet is known as the Red Planet?",
    "options": ["Venus", "Mars", "Jupiter", "Saturn"],
    "correct": 1
  },
  {
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correct": 1
  },
  {
    "question": "Who wrote \"Romeo and Juliet\"?",
    "options": ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    "correct": 1
  },
  {
    "question": "What is the largest ocean?",
    "options": ["Atlantic", "Indian", "Arctic", "Pacific"],
    "correct": 3
  }
];
const totalQuestions = quizData.length;

let currentQuestion = 0;
let answers = [];
let score = 0;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const startEl = document.getElementById('start');
  const quizEl = document.getElementById('quiz');
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const confirmModal = document.getElementById('confirmModal');
  const confirmYes = document.getElementById('confirmYes');
  const confirmNo = document.getElementById('confirmNo');
  const resultsEl = document.getElementById('results');

  startBtn.onclick = () => startQuiz(startEl, quizEl, questionEl, optionsEl, prevBtn, nextBtn);
  prevBtn.onclick = () => prevQuestion(currentQuestion, questionEl, optionsEl, prevBtn, nextBtn);
  nextBtn.onclick = () => nextQuestion(currentQuestion, totalQuestions, confirmModal);
  confirmYes.onclick = () => submitQuiz(score, totalQuestions, quizEl, resultsEl, confirmModal);
  confirmNo.onclick = () => confirmModal.classList.remove('active');
});

function startQuiz(startEl, quizEl, questionEl, optionsEl, prevBtn, nextBtn) {
  startEl.style.display = 'none';
  quizEl.style.display = 'block';
  currentQuestion = 0;
  answers = new Array(totalQuestions).fill(null);
  loadQuestion(quizData, currentQuestion, questionEl, optionsEl, answers);
  updateNavButtons(0, totalQuestions, prevBtn, nextBtn);
}

function loadQuestion(quizData, currentQuestion, questionEl, optionsEl, answers) {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = '';
  q.options.forEach((option, index) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.textContent = option;
    div.onclick = () => selectOption(index, optionsEl, answers, currentQuestion);
    if (answers[currentQuestion] === index) div.classList.add('selected');
    optionsEl.appendChild(div);
  });
}

function selectOption(index, optionsEl, answers, currentQuestion) {
  document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
  optionsEl.children[index].classList.add('selected');
  answers[currentQuestion] = index;
}

function nextQuestion(currentQuestion, totalQuestions, confirmModal) {
  if (currentQuestion < totalQuestions - 1) {
    currentQuestion++;
    // loadQuestion... (call from onclick context)
  } else {
    confirmModal.classList.add('active');
  }
}

function prevQuestion(currentQuestion, questionEl, optionsEl, prevBtn, nextBtn) {
  if (currentQuestion > 0) {
    currentQuestion--;
    // load
  }
}

function updateNavButtons(currentQuestion, totalQuestions, prevBtn, nextBtn) {
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.textContent = currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next';
  nextBtn.disabled = answers[currentQuestion] === null;
}

// Stub functions
function submitQuiz(score, totalQuestions, quizEl, resultsEl, confirmModal) {
  // calculate score
  confirmModal.classList.remove('active');
  quizEl.style.display = 'none';
  resultsEl.style.display = 'block';
  resultsEl.querySelector('#score').innerHTML = `<h2>${score}/${totalQuestions}</h2><button onclick="location.reload()">Replay</button>`;
}
