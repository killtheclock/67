var allQuestions = [];
var currentQuiz = [];
var currentIndex = 0;
var stats = { correct: 0, total: 0 };

fetch('data/questions/math_g_gymn.json')
    .then(r => r.json())
    .then(data => {
        allQuestions = data;
        updateCategoryCounters();
    });

function vibrate(ms) {
    if (navigator.vibrate) {
        navigator.vibrate(ms);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateCategoryCounters() {
    document.querySelectorAll('.category-card').forEach(card => {
        let sub = card.getAttribute('data-sub');
        let count = allQuestions.filter(q => q.subcategory.trim() === sub.trim()).length;
        card.querySelector('.count-tag').innerText = count.toString().padStart(2, '0');
    });
}

function showSubcategories(catID) {
    vibrate(20); // Κλικ δόνηση
    let sub = document.querySelector(`[data-cat="${catID}"]`).getAttribute('data-sub');
    let filtered = allQuestions.filter(q => q.subcategory.trim() === sub.trim());
    if (filtered.length > 0) {
        currentQuiz = shuffle([...filtered]);
        currentIndex = 0; stats = { correct: 0, total: currentQuiz.length };
        document.getElementById('category-selector').classList.add('hidden');
        document.getElementById('main-header').classList.add('hidden');
        document.getElementById('quiz-container').classList.remove('hidden');
        renderQuestion();
    }
}

function renderQuestion() {
    let q = currentQuiz[currentIndex];
    let fb = document.getElementById('feedback-bar');
    fb.innerText = `UNIT_${(currentIndex + 1).toString().padStart(2, '0')}`;
    fb.style.color = "white";

    let html = `
        <div class="quiz-card">
            <div class="question-text">\\( ${q.question} \\)</div>
            <div class="options-grid">
                ${shuffle([...q.options]).map(opt => `
                    <button class="opt-btn" onclick="checkAnswer(this, '${opt.replace(/'/g, "\\'")}', '${q.answer.replace(/'/g, "\\'")}')">
                        \\( ${opt} \\)
                    </button>
                `).join('')}
            </div>
        </div>`;
    document.getElementById('card-stack').innerHTML = html;
    document.getElementById('progress-bar').style.width = ((currentIndex / currentQuiz.length) * 100) + "%";
    if (window.MathJax) MathJax.typesetPromise();
}

function checkAnswer(btn, selected, correct) {
    document.querySelectorAll('.opt-btn').forEach(b => b.disabled = true);
    let fb = document.getElementById('feedback-bar');

    if (selected === correct) {
        vibrate([30, 30, 30]); // Διπλό "τικ" για επιτυχία
        fb.innerText = "STATUS: SUCCESS"; fb.style.color = "#00ff00"; stats.correct++;
        btn.style.background = "#004400";
    } else {
        vibrate(200); // Μακρύ "βουητό" για λάθος
        fb.innerText = "STATUS: FAILURE"; fb.style.color = "#ff0000";
        btn.style.background = "#440000";
    }

    setTimeout(() => {
        currentIndex++;
        if (currentIndex < currentQuiz.length) renderQuestion();
        else showFinalStats();
    }, 1000);
}

function showFinalStats() {
    vibrate([50, 100, 50, 100, 50]); // Pattern τέλους
    let score = Math.round((stats.correct / stats.total) * 100);
    document.getElementById('quiz-container').innerHTML = `
        <div class="stats-screen">
            <p>CRITICAL_ANALYSIS_COMPLETE</p>
            <h1>${score}%</h1>
            <p style="margin-bottom:40px;">SUCCESS_RATE: ${stats.correct}/${stats.total}</p>
            <button onclick="goHome()" id="abort-btn" style="position:static; width:90%; border:2px solid white;">[ RETURN_TO_MAIN_MENU ]</button>
        </div>
    `;
}

function goHome() { 
    vibrate(40);
    window.location.reload(); 
}
