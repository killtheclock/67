let allQuestions = [];
let currentQuiz = [];
let currentIndex = 0;
let score = 0;

// Fisher-Yates Shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function init() {
    try {
        const res = await fetch('data/questions/math_g_gymn.json');
        allQuestions = await res.json();
    } catch (e) { console.error("Error loading JSON"); }
}

function showSubcategories(category) {
    document.getElementById('category-selector').classList.add('hidden');
    const subSelector = document.getElementById('subcategory-selector');
    subSelector.classList.remove('hidden');
    
    let subs = [];
    if(category === 'factorization') {
        subs = [{id:'common_factor', name:'Κοινός Παράγοντας'}, {id:'grouping', name:'Ομαδοποίηση'}];
    } else {
        subs = [{id:'square', name:'Ταυτότητες Τετραγώνου'}];
    }

    subSelector.innerHTML = subs.map(s => `
        <div class="category-card" onclick="startQuiz('${category}', '${s.id}')">
            <h3>${s.name}</h3>
            <p>Ενότητα Γ' Γυμνασίου</p>
        </div>
    `).join('');
}

function startQuiz(cat, sub) {
    document.getElementById('subcategory-selector').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    currentQuiz = shuffle(allQuestions.filter(q => q.category === cat && q.subcategory === sub));
    currentIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const stack = document.getElementById('card-stack');
    if(currentIndex >= currentQuiz.length) {
        stack.innerHTML = `
            <div class="quiz-card" style="text-align:center;">
                <p class="question-text">ΑΠΟΤΕΛΕΣΜΑΤΑ</p>
                <div class="score-board">${score} / ${currentQuiz.length}</div>
                <button class="back-btn" onclick="window.location.reload()">BACK TO DASHBOARD</button>
            </div>`;
        return;
    }

    const q = currentQuiz[currentIndex];
    const shuffledOptions = shuffle([...q.options]);

    let parts = q.question.split(':');
    let instruction = parts[0] ? parts[0].trim() : 'Άσκηση';
    let expression = parts[1] ? parts[1].trim() : q.question;

    stack.innerHTML = `
        <div class="quiz-card">
            <p style="color:var(--text-muted); font-size:0.7rem; margin-bottom:15px; font-weight:600;">${currentIndex + 1} OF ${currentQuiz.length}</p>
            <div class="question-text">${instruction}</div>
            <div class="math-expression">${expression}</div>
            <div class="options-grid">
                ${shuffledOptions.map(opt => `
                    <button class="opt-btn" onclick="handleAnswer(this, '${opt}', '${q.answer}')">${opt}</button>
                `).join('')}
            </div>
        </div>
    `;
}

function handleAnswer(btn, selected, correct) {
    const allBtns = btn.parentElement.querySelectorAll('.opt-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if(selected === correct) {
        score++;
        btn.classList.add('correct');
    } else {
        btn.classList.add('incorrect');
        // Αποκάλυψη του σωστού
        allBtns.forEach(b => {
            if(b.innerText === correct) {
                b.classList.add('correct-reveal');
            }
        });
    }

    currentIndex++;
    setTimeout(showQuestion, 1100);
}

window.onload = init;
