var allQuestions = [];
var currentQuiz = [];
var currentIndex = 0;
var stats = { correct: 0, total: 0 };

// AJAX Load
fetch('data/questions/math_g_gymn.json')
    .then(response => response.json())
    .then(data => {
        allQuestions = data;
        updateCategoryCounters();
    });

function updateCategoryCounters() {
    document.querySelectorAll('.category-card').forEach(card => {
        let sub = card.getAttribute('data-sub');
        let count = allQuestions.filter(q => q.subcategory.trim() === sub.trim()).length;
        card.querySelector('.count-tag').innerText = count;
    });
}

function showSubcategories(catID) {
    let card = document.querySelector(`[data-cat="${catID}"]`);
    let sub = card.getAttribute('data-sub');
    currentQuiz = allQuestions.filter(q => q.subcategory.trim() === sub.trim());
    
    if (currentQuiz.length > 0) {
        currentIndex = 0;
        stats = { correct: 0, total: currentQuiz.length };
        document.getElementById('category-selector').classList.add('hidden');
        document.getElementById('quiz-container').classList.remove('hidden');
        renderQuestion();
    }
}

function renderQuestion() {
    let q = currentQuiz[currentIndex];
    let fb = document.getElementById('feedback-bar');
    fb.innerText = `UNIT_${(currentIndex + 1).toString().padStart(2, '0')}`;
    fb.style.color = "white";

    // Καθαρό LaTeX wrap για το MathJax
    let html = `
        <div class="quiz-card">
            <div class="question-text">\\( ${q.question} \\)</div>
            <div class="options-grid">
                ${q.options.map(opt => `
                    <button class="opt-btn" onclick="checkAnswer(this, '${opt.replace(/'/g, "\\'")}', '${q.answer.replace(/'/g, "\\'")}')">
                        \\( ${opt} \\)
                    </button>
                `).join('')}
            </div>
        </div>`;
    
    document.getElementById('card-stack').innerHTML = html;
    updateProgressBar();
    
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

function checkAnswer(btn, selected, correct) {
    let fb = document.getElementById('feedback-bar');
    if (selected === correct) {
        fb.innerText = "STATUS: OK";
        fb.style.color = "#00ff00";
        stats.correct++;
    } else {
        fb.innerText = "STATUS: ERROR";
        fb.style.color = "#ff0000";
    }

    setTimeout(() => {
        currentIndex++;
        if (currentIndex < currentQuiz.length) renderQuestion();
        else showFinalStats();
    }, 800);
}

function updateProgressBar() {
    document.getElementById('progress-bar').style.width = ((currentIndex / currentQuiz.length) * 100) + "%";
}

function showFinalStats() {
    let score = Math.round((stats.correct / stats.total) * 100);
    document.getElementById('quiz-container').innerHTML = `
        <div class="stats-screen">
            <p>TOTAL_SCORE</p>
            <h1>${score}%</h1>
            <p style="margin-bottom:30px;">${stats.correct} / ${stats.total} CORRECT</p>
            <button onclick="location.reload()" style="border:2px solid white; padding:20px; width:80%;">[ RESET_SYSTEM ]</button>
        </div>
    `;
}
