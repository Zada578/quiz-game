let quizData = [];
let totalQuestions = 0;
let isDataLoaded = false;

async function loadQuizData() {
  try {
    const response = await fetch('/api/questions');
    quizData = await response.json();
    totalQuestions = quizData.length;
    isDataLoaded = true;
    console.log('✅ Loaded', totalQuestions, 'questions from DB');
  } catch (error) {
    console.error('❌ Failed to load questions:', error);
    alert('Failed to load quiz. Ensure server is running and DB connected.');
  }
}

// Update existing functions to use loaded data
function startQuiz() {
  if (!isDataLoaded) {
    alert('Loading questions... Please wait.');
    loadQuizData().then(startQuiz);
    return;
  }
  
  startEl.style.display = 'none';
  quizEl.style.display = 'block';
  currentQuestion = 0;
  score = 0;
  answers = new Array(totalQuestions).fill(null);
  isFeedbackShowing = false;
  clearFeedback();
  updateNavButtons();
  loadQuestion();
}

async function submitQuiz() {
  confirmModal.classList.remove('active');
  
  // Save score to backend
  const username = prompt('Enter your name for leaderboard (optional):') || 'Anonymous';
  try {
    await fetch('/api/score', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({score, total: totalQuestions, username})
    });
    console.log('✅ Score saved!');
  } catch (error) {
    console.error('Score save failed:', error);
  }
  
  quizEl.style.display = 'none';
  resultsEl.style.display = 'block';
  showResults();
  loadLeaderboard();
}

async function loadLeaderboard() {
  try {
    const response = await fetch('/api/leaderboard');
    const leaderboard = await response.json();
    showLeaderboard(leaderboard);
  } catch (error) {
    console.error('Leaderboard load failed:', error);
  }
}

function showLeaderboard(data) {
  const lbEl = document.getElementById('leaderboard');
  if (!lbEl) return;
  
  lbEl.innerHTML = '<h3>🏆 Top Scores</h3><ol>' + 
    data.map((entry, i) => 
      `<li>${entry.username}: ${entry.score}/${entry.total} (${Math.round(entry.score/entry.total*100)}%)</li>`
    ).join('') + '</ol>';
}

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
  await loadQuizData();
  createProgressBar();
  updateNavButtons();
});
