const quizData = [
  {
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correct: 2
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct: 1
  },
  {
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correct: 1
  },
  {
    question: 'Who wrote "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correct: 1
  },
  {
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correct: 3
  }
];

let currentQuestion = 0;
let score = 0;
let answers = new Array(quizData.length).fill(null);
let feedbackTimer = null;
let progressBar = null;
let isFeedbackShowing = false;

const startEl = document.getElementById('start');
const quizEl = document.getElementById('quiz');
const resultsEl = document.getElementById('results');
const confirmModal = document.getElementById('confirmModal');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const startBtn = document.getElementById('startBtn');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
const scoreEl = document.getElementById('score');

function createProgressBar() {
  const progress = document.createElement('div');
  progress.className = 'progress';
  progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progress.appendChild(progressBar);
  document.querySelector('.container').insertBefore(progress, quizEl);
}

startBtn.addEventListener('click', startQuiz);
confirmYes.addEventListener('click', submitQuiz);
confirmNo.addEventListener('click', () => {
  confirmModal.classList.remove('active');
});

nextBtn.addEventListener('click', handleNext);
prevBtn.addEventListener('click', handlePrev);

function startQuiz() {
  startEl.style.display = 'none';
  quizEl.style.display = 'block';
  currentQuestion = 0;
  score = 0;
  answers = new Array(quizData.length).fill(null);
  isFeedbackShowing = false;
  clearFeedback();
  updateNavButtons();
  loadQuestion();
}

function loadQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.question;
  
  optionsEl.innerHTML = '';
  q.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = option;
    btn.addEventListener('click', () => selectOption(index));
    optionsEl.appendChild(btn);
  });
  
  if (answers[currentQuestion] !== null) {
    const selectedBtn = optionsEl.children[answers[currentQuestion]];
    if (selectedBtn) {
      selectedBtn.classList.add('selected');
    }
  }
  
  updateProgress();
  updateNavButtons();
  clearFeedback();
}

function selectOption(index) {
  if (isFeedbackShowing) return;
  
  answers[currentQuestion] = index;
  const options = document.querySelectorAll('.option');
  options.forEach((opt, i) => {
    opt.classList.remove('selected', 'correct', 'incorrect');
    if (i === index) {
      opt.classList.add('selected');
    }
  });
  
  // Show immediate feedback
  setTimeout(() => showAnswerFeedback(), 300);
}

function showAnswerFeedback() {
  isFeedbackShowing = true;
  nextBtn.disabled = true;
  
  const options = document.querySelectorAll('.option');
  const userAnswer = answers[currentQuestion];
  const correctIndex = quizData[currentQuestion].correct;
  
  options.forEach((option, i) => {
    if (i === correctIndex) {
      option.classList.add('correct');
    } else if (i === userAnswer && i !== correctIndex) {
      option.classList.add('incorrect');
    }
  });
  
  if (userAnswer === correctIndex) {
    score++;
  }
  
  feedbackTimer = setTimeout(() => {
    isFeedbackShowing = false;
    nextBtn.disabled = false;
    clearFeedback();
  }, 1500);
}

function clearFeedback() {
  if (feedbackTimer) {
    clearTimeout(feedbackTimer);
    feedbackTimer = null;
  }
  document.querySelectorAll('.option').forEach(opt => {
    opt.classList.remove('correct', 'incorrect');
  });
}

function handleNext() {
  if (isFeedbackShowing) return;
  
  if (currentQuestion === quizData.length - 1) {
    confirmModal.classList.add('active');
  } else {
    currentQuestion++;
    loadQuestion();
  }
}

function handlePrev() {
  if (isFeedbackShowing) return;
  
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

function updateNavButtons() {
  prevBtn.style.display = currentQuestion === 0 ? 'none' : 'inline-block';
  prevBtn.disabled = isFeedbackShowing;
  nextBtn.disabled = isFeedbackShowing;
  nextBtn.textContent = currentQuestion === quizData.length - 1 ? 'Finish' : 'Next';
}

function submitQuiz() {
  confirmModal.classList.remove('active');
  quizEl.style.display = 'none';
  resultsEl.style.display = 'block';
  showResults();
}

function updateProgress() {
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  if (progressBar) {
    progressBar.style.width = progress + '%';
  }
}

function showResults() {
  const percentage = Math.round((score / quizData.length) * 100);
  scoreEl.innerHTML = `
    <h2>Your Score: ${score}/${quizData.length} (${percentage}%)</h2>
    <p>${percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good job!' : 'Try again!'}</p>
  `;
  
  const flowersContainer = document.createElement('div');
  flowersContainer.className = 'flowers';
  if (percentage >= 50) {
    const freshFlowers = ['🌸', '🌺', '🌼', '🌻', '🌷', '💐'];
    for (let i = 0; i < 8; i++) {
      const flower = document.createElement('div');
      flower.className = 'flower';
      flower.textContent = freshFlowers[Math.floor(Math.random() * freshFlowers.length)];
      flower.style.left = (Math.random() * 90) + '%';
      flower.style.top = (Math.random() * 90) + '%';
      flower.style.animationDelay = (Math.random() * 2) + 's';
      flowersContainer.appendChild(flower);
    }
  } else {
    const wiltedFlowers = ['🥀', '🌹', '🌺'];
    for (let i = 0; i < 6; i++) {
      const flower = document.createElement('div');
      flower.className = 'flower wilted';
      flower.textContent = wiltedFlowers[Math.floor(Math.random() * wiltedFlowers.length)];
      flower.style.left = (Math.random() * 90) + '%';
      flower.style.top = (Math.random() * 90) + '%';
      flower.style.animationDelay = (Math.random() * 2) + 's';
      flowersContainer.appendChild(flower);
    }
  }
  resultsEl.appendChild(flowersContainer);
  
  const restartBtn = document.createElement('button');
  restartBtn.className = 'restartBtn';
  restartBtn.textContent = 'Restart Quiz';
  restartBtn.addEventListener('click', () => {
    resultsEl.innerHTML = '<h1>Results</h1><div id="score"></div>';
    scoreEl = document.getElementById('score');
    resultsEl.style.display = 'none';
    startEl.style.display = 'block';
    document.querySelector('.flowers')?.remove();
  });
  scoreEl.appendChild(restartBtn);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createProgressBar();
  updateNavButtons();
});
