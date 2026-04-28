var allQuestions = [];
var currentQuiz = [];
var currentIndex = 0;
var stats = { correct: 0, total: 0 };

var xhr = new XMLHttpRequest();
xhr.open("GET", "data/questions/math_g_gymn.json", true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        allQuestions = JSON.parse(xhr.responseText);
        updateCategoryCounters();
    }
};
xhr.send();

function updateCategoryCounters() {
    document.querySelectorAll('.category-card').forEach(card => {
        let sub = card.getAttribute('data-sub');
        let count = allQuestions.filter(q => q.subcategory.trim() === sub.trim()).length;
        card.querySelector('.count-tag').innerText = count.toString().padStart(2, '0');
    });
}

function showSubcategories(catID) {
    let sub = document.querySelector(`[data-cat="${catID}"]`).getAttribute('data-sub');
    currentQuiz = allQuestions.filter(q => q.subcategory.trim() === sub.trim());
    if (currentQuiz.length > 0) {
        currentIndex = 0; stats = { correct: 0, total: currentQuiz.length };
        document.getElementById('category-selector').style.display = 'none';
        document.getElementById('quiz-container').classList.remove('hidden');
        renderQuestion();
    }
}

function renderQuestion() {
    let q = currentQuiz[currentIndex];
    let fb = document.getElementById('feedback-bar');
    fb.innerText = `QUESTION ${currentIndex + 1}/${currentQuiz.length}`;
    fb.style.background = "#000";

    let html = `<div class="quiz-card">
        <div class="question-text">\$${q.question}\$</div>
        <div class="options-grid">`;
    
    q.options.forEach(opt => {
        html += `<button class="opt-btn" onclick="checkAnswer(this, '${opt.replace(/'/g, "\\'")}', '${q.answer.replace(/'/g, "\\")}')">\$${opt}\$</button>`;
    });
    
    html += `</div></div>`;
    document.getElementById('card-stack').innerHTML = html;
    
    updateProgressBar();
    if (window.MathJax) MathJax.typesetPromise();
}

function checkAnswer(btn, selected, correct) {
    let fb = document.getElementById('feedback-bar');
    document.querySelectorAll('.opt-btn').forEach(b => b.disabled = true);

    if (selected === correct) {
        fb.innerText = "STATUS: SUCCESS";
        fb.style.background = "#00aa00";
        stats.correct++;
    } else {
        fb.innerText = "STATUS: FAIL";
        fb.style.background = "#ff0000";
        btn.style.background = "#ff0000"; btn.style.color = "#fff";
    }

    setTimeout(() => {
        currentIndex++;
        if (currentIndex < currentQuiz.length) renderQuestion();
        else showFinalStats();
    }, 1200);
}

function updateProgressBar() {
    document.getElementById('progress-bar').style.width = ((currentIndex / currentQuiz.length) * 100) + "%";
}

function showFinalStats() {
    document.getElementById('progress-bar').style.width = "100%";
    let score = Math.round((stats.correct / stats.total) * 100);
    document.getElementById('card-stack').innerHTML = `
        <div style="padding:40px 10px; text-align:center; border-bottom:4px solid #000;">
            <h1 style="font-size:3rem;">${score}%</h1>
            <p style="font-size:1.2rem; margin:20px 0;">CORRECT: ${stats.correct} / ${stats.total}</p>
            <div style="background:#000; color:#fff; padding:10px; font-weight:bold;">
                RANK: ${score > 80 ? 'S-TIER' : score > 50 ? 'B-TIER' : 'F-TIER'}
            </div>
        </div>
        <button onclick="location.reload()" class="nav-btn">RETURN TO MENU</button>
    `;
}

function goHome() { location.reload(); }
