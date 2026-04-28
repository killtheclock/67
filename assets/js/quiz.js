let allQuestions = [];
let currentQuiz = [];
let currentIndex = 0;
let score = 0;
let startTime;

async function init() {
    try {
        const res = await fetch('data/questions/math_g_gymn.json');
        allQuestions = await res.json();
        updateMainCounters();
    } catch (e) { console.error("Data Load Error", e); }
}

function updateMainCounters() {
    document.querySelectorAll('.category-card[data-cat]').forEach(card => {
        const cat = card.getAttribute('data-cat');
        const count = allQuestions.filter(q => q.category === cat).length;
        let span = card.querySelector('.total-count') || document.createElement('span');
        span.className = 'total-count';
        span.style.color = '#4ade80';
        span.style.display = 'block';
        span.style.fontSize = '0.8rem';
        span.style.marginTop = '10px';
        span.innerText = `TOTAL_EXERCISES // ${count}`;
        card.appendChild(span);
    });
}

function showSubcategories(category) {
    const main = document.getElementById('category-selector');
    const sub = document.getElementById('subcategory-selector');
    main.classList.add('hidden');
    sub.classList.remove('hidden');

    const menu = {
        'ops': [{id:'poly_ops', name:'Πράξεις Πολυωνύμων'}],
        'identities': [{id:'diff_sq', name:'Διαφορά Τετραγώνων'}, {id:'sq_sum', name:'Τετράγωνο Αθροίσματος'}],
        'factorization': [{id:'comm_fact', name:'Κοινός Παράγοντας'}, {id:'trinomial', name:'Τριώνυμο'}],
        'rational': [{id:'simplification', name:'Απλοποίηση'}, {id:'rational_ops', name:'Πράξεις Ρητών'}],
        'equations': [{id:'quad_formula', name:'2ου Βαθμού (Δ)'}],
        'trigonometry': [{id:'trig_identities', name:'Ταυτότητες'}]
    };

    sub.innerHTML = (menu[category] || []).map(s => {
        const n = allQuestions.filter(q => q.category === category && q.subcategory === s.id).length;
        return `
        <div class="category-card" onclick="${n > 0 ? `startQuiz('${category}', '${s.id}')` : ''}" style="${n === 0 ? 'opacity:0.4' : ''}">
            <h3>${s.name}</h3>
            <span style="color:#4ade80; font-family:monospace; font-size:0.8rem;">AVAILABLE // ${n}</span>
        </div>`;
    }).join('') + '<button class="back-btn" onclick="location.reload()">BACK_TO_CORE</button>';
}

function startQuiz(cat, sub) {
    document.getElementById('subcategory-selector').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    currentQuiz = allQuestions.filter(q => q.category === cat && q.subcategory === sub);
    currentIndex = 0;
    score = 0;
    startTime = Date.now();
    showQuestion();
}

function showQuestion() {
    const stack = document.getElementById('card-stack');
    if(currentIndex >= currentQuiz.length) {
        showFinalStats();
        return;
    }
    const q = currentQuiz[currentIndex];
    stack.innerHTML = `
        <div class="quiz-card">
            <p style="font-size:0.7rem; color:#4ade80;">SIGNAL_STABLE // EXERCISE ${currentIndex + 1}/${currentQuiz.length}</p>
            <div class="math-expression" id="math-q" style="font-size:1.4rem; margin:20px 0;">\\(${q.question}\\)</div>
            <div class="options-grid">
                ${q.options.map(opt => `<button class="opt-btn" onclick="handleAnswer(this, '${opt}', '${q.answer}')">\\(${opt}\\)</button>`).join('')}
            </div>
        </div>`;
    
    if (window.MathJax) {
        MathJax.typesetPromise([stack]);
    }
}

function handleAnswer(btn, selected, correct) {
    const allBtns = btn.parentElement.querySelectorAll('.opt-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if(selected === correct) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('incorrect');
        allBtns.forEach(b => {
            // Χρησιμοποιούμε μια απλή σύγκριση κειμένου για την αποκάλυψη του σωστού
            if(b.innerHTML.includes(correct)) b.classList.add('correct-reveal');
        });
    }

    currentIndex++;
    setTimeout(showQuestion, 1200);
}

function showFinalStats() {
    const quizBox = document.getElementById("quiz-box");
    const accuracy = Math.round((score / currentQuiz.length) * 100) || 0;
    quizBox.innerHTML = `
        <div class="stats-screen" style="text-align:center; padding:20px;">
            <h2 style="color:var(--neon-green);">MISSION_COMPLETE //</h2>
            <div style="margin:20px 0; font-family:monospace;">
                <p>ACCURACY: ${accuracy}%</p>
                <p>SCORE: ${score} / ${currentQuiz.length}</p>
            </div>
            <button onclick="location.reload()" class="opt-btn" style="border:1px solid var(--neon-green); background:transparent; color:var(--neon-green); padding:15px; cursor:pointer; width:100%;">
                [ REBOOT_SYSTEM ]
            </button>
        </div>`;
}
                </div>
                <div style="border:1px solid #333; padding:10px;">
                    <div style="font-size:0.7rem; color:#888;">ACCURACY</div>
                    <div style="font-size:1.2rem;">${accuracy}%</div>
                </div>
                <div style="border:1px solid #333; padding:10px; grid-column: span 2;">
                    <div style="font-size:0.7rem; color:#888;">TIME_ELAPSED</div>
                    <div style="font-size:1.2rem;">${totalTime}s</div>
                </div>
            </div>
            <button class="back-btn" onclick="location.reload()">REBOOT_SYSTEM</button>
        </div>`;
}

window.onload = init;
