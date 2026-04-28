alert("JS_IS_ALIVE");
let allQuestions = [];
let currentQuiz = [];
let currentIndex = 0;
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/questions/math_g_gymn.json')
        .then(res => res.json())
        .then(data => {
            allQuestions = data;
            console.log("System: Data Loaded");
        })
        .catch(err => alert("Σφάλμα φόρτωσης: " + err));
});

function startQuiz(category, subcategory) {
    // Μετατρέπουμε σε κεφαλαία και αφαιρούμε κενά για σίγουρο ταίριασμα
    currentQuiz = allQuestions.filter(q => 
        q.category.trim().toUpperCase() === category.trim().toUpperCase() && 
        q.subcategory.trim().toUpperCase() === subcategory.trim().toUpperCase()
    );

    if (currentQuiz.length === 0) {
        alert("Δεν βρέθηκαν ερωτήσεις για: " + subcategory + "\n\nΒεβαιώσου ότι το όνομα στο index.html είναι ολόιδιο με το JSON!");
        return;
    }

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
        <div class="question-text" style="font-size:1.2rem; margin-bottom:20px; color:#fff;">${q.question}</div>
        <div class="options-grid" style="display:grid; gap:10px;">
            ${q.options.map(opt => `
                <button class="opt-btn" onclick="handleAnswer(this, '${opt.replace(/'/g, "\\'")}', '${q.answer.replace(/'/g, "\\")}')" 
                style="padding:15px; background:rgba(0,255,0,0.1); border:1px solid #00ff00; color:#00ff00; cursor:pointer;">
                    ${opt}
                </button>
            `).join('')}
        </div>
    `;
    if (window.MathJax) MathJax.typesetPromise();
}

function handleAnswer(btn, selected, correct) {
    const btns = btn.parentElement.querySelectorAll('.opt-btn');
    btns.forEach(b => b.style.pointerEvents = 'none');
    
    if (selected === correct) {
        btn.style.background = "#00ff00";
        btn.style.color = "#000";
        score++;
    } else {
        btn.style.background = "#ff0000";
        btn.style.color = "#fff";
    }

    setTimeout(() => {
        currentIndex++;
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
        <div class="stats-screen" style="text-align:center; color:#00ff00;">
            <h2>MISSION_COMPLETE //</h2>
            <p>ACCURACY: ${accuracy}%</p>
            <p>SCORE: ${score} / ${currentQuiz.length}</p>
            <button onclick="location.reload()" class="opt-btn" style="margin-top:20px; width:100%; padding:15px;">[ REBOOT_SYSTEM ]</button>
        </div>
    `;
}
