let allQuestions = [];
let currentQuiz = [];
let currentIndex = 0;
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/questions/math_g_gymn.json')
        .then(res => res.json())
        .then(data => {
            if(data.length === 0) alert("WARNING: JSON is empty!"); else console.log("Loaded:", data.length);
            allQuestions = data;
            console.log("SYSTEM_LOG // Data Loaded");
        })
        .catch(err => alert("CRITICAL_ERROR: " + err.message));
});

function startQuiz(category, subcategory) {
    currentQuiz = allQuestions.filter(q => q.category === category && q.subcategory === subcategory);
    if (currentQuiz.length === 0) return;
    currentIndex = 0;
    score = 0;
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const q = currentQuiz[currentIndex];
    const quizBox = document.getElementById('quiz-box');
    quizBox.innerHTML = `
        <div class="question-text">${q.question}</div>
        <div class="options-grid">
            ${q.options.map(opt => `
                <button class="opt-btn" onclick="handleAnswer(this, '${opt}', '${q.answer}')">${opt}</button>
            `).join('')}
        </div>
    `;
    if (window.MathJax) MathJax.typesetPromise();
}

function handleAnswer(btn, selected, correct) {
    const btns = btn.parentElement.querySelectorAll('.opt-btn');
    btns.forEach(b => b.style.pointerEvents = 'none');
    if (selected === correct) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('incorrect');
    }
    currentIndex++;
    setTimeout(() => {
        if (currentIndex < currentQuiz.length) {
            showQuestion();
        } else {
            showFinalStats();
        }
    }, 1000);
}

function showFinalStats() {
    const quizBox = document.getElementById('quiz-box');
    const accuracy = Math.round((score / currentQuiz.length) * 100) || 0;
    quizBox.innerHTML = `
        <div class="stats-screen" style="text-align:center; padding:20px;">
            <h2 style="color:#00ff00;">MISSION_COMPLETE //</h2>
            <p>ACCURACY: ${accuracy}%</p>
            <p>SCORE: ${score} / ${currentQuiz.length}</p>
            <button onclick="location.reload()" class="opt-btn" style="margin-top:20px; width:100%;">[ REBOOT_SYSTEM ]</button>
        </div>
    `;
}
