var allQuestions = [];
var currentQuiz = [];
var currentIndex = 0;
var stats = { correct: 0, total: 0 };

fetch('data/questions/math_g_gymn.json').then(r => r.json()).then(data => {
    allQuestions = data;
    updateCategoryCounters();
});

function updateCategoryCounters() {
    document.querySelectorAll('.category-card').forEach(card => {
        let sub = card.getAttribute('data-sub');
        let count = allQuestions.filter(q => q.subcategory.trim() === sub.trim()).length;
        let tag = card.querySelector('.count-tag');
        if (tag) tag.innerText = count.toString().padStart(2, '0');
    });
}

function showSubcategories(catID) {
    let sub = document.querySelector(`[data-cat="${catID}"]`).getAttribute('data-sub');
    let filtered = allQuestions.filter(q => q.subcategory.trim() === sub.trim());
    if (filtered.length > 0) {
        currentQuiz = shuffle([...filtered]);
        currentIndex = 0; stats = { correct: 0, total: currentQuiz.length };
        document.getElementById('category-selector').classList.add('hidden');
        document.getElementById('quiz-container').classList.remove('hidden');
        renderQuestion();
    }
}

function renderQuestion() {
    let q = currentQuiz[currentIndex];
    document.getElementById('feedback-bar').innerText = `UNIT ${currentIndex + 1} / ${currentQuiz.length}`;
    
    let html = `
        <div class="quiz-card">
            <div class="question-area">
                <div class="question-text">\\( ${q.question} \\)</div>
            </div>
            <div class="options-grid">
                ${shuffle([...q.options]).map(opt => `
                    <button class="opt-btn" onclick="checkAnswer(this, '${opt.replace(/'/g, "\\'")}', '${q.answer.replace(/'/g, "\\")}')">
                        \\( ${opt} \\)
                    </button>
                `).join('')}
            </div>
            <div class="controls-area">
                <div id="progress-container"><div id="progress-bar" style="width: ${(currentIndex / currentQuiz.length) * 100}%"></div></div>
                <button id="abort-btn" onclick="location.reload()">[ ABORT_TEST ]</button>
            </div>
        </div>`;
    
    document.getElementById('card-stack').innerHTML = html;
    if (window.MathJax) MathJax.typesetPromise();
}

function checkAnswer(btn, selected, correct) {
    document.querySelectorAll('.opt-btn').forEach(b => b.disabled = true);
    if (selected === correct) {
        stats.correct++;
        btn.style.borderColor = "var(--accent)"; btn.style.color = "var(--accent)";
    } else {
        btn.style.borderColor = "#ff5252"; btn.style.color = "#ff5252";
    }
    
    // Ενημέρωση μπάρας αμέσως μετά την απάντηση
    setTimeout(() => {
        currentIndex++;
        if (currentIndex < currentQuiz.length) renderQuestion();
        else showFinalStats();
    }, 600);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function showFinalStats() {
    let score = Math.round((stats.correct / stats.total) * 100);
    document.getElementById('quiz-container').innerHTML = `
        <div class="stats-screen">
            <p style="color:var(--text-muted); margin-bottom:10px;">FINAL_ACCURACY</p>
            <div class="score-circle-bg">
                <div id="score-fill-bar" class="score-fill"></div>
                <h1>${score}%</h1>
            </div>
            <p style="color:var(--accent)">SUCCESS: ${stats.correct} / ${stats.total}</p>
            <button onclick="location.reload()" class="opt-btn" style="margin-top:30px; width:220px;">RE-INITIALIZE</button>
        </div>`;
    
    // Animation για το γέμισμα του σκορ
    setTimeout(() => {
        const fill = document.getElementById('score-fill-bar');
        if(fill) fill.style.clipPath = `inset(${100 - score}% 0 0 0)`;
    }, 100);
}
