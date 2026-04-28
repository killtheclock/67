let allQuestions = [];
let currentQuiz = [];
let currentIndex = 0;
let score = 0;
let startTime;

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
    } catch (e) { console.error("Error loading JSON", e); }
}

function showSubcategories(category) {
    const mainSelector = document.getElementById('category-selector');
    const subSelector = document.getElementById('subcategory-selector');
    mainSelector.classList.add('hidden');
    subSelector.classList.remove('hidden');
    
    let subs = [];
    if (category === 'algebra_basics') {
        subs = [{id:'monomials', name:'Μονώνυμα'}, {id:'polynomials', name:'Πολυώνυμα'}];
    } else if (category === 'identities') {
        subs = [{id:'square_sum', name:'Τετράγωνο Αθροίσματος'}, {id:'diff_squares', name:'Διαφορά Τετραγώνων'}];
    } else if (category === 'factorization') {
        subs = [{id:'common_factor', name:'Κοινός Παράγοντας'}, {id:'grouping', name:'Ομαδοποίηση'}];
    } else if (category === 'equations') {
        subs = [{id:'quadratic', name:'Δευτεροβάθμιες'}, {id:'fractional', name:'Κλασματικές'}];
    } else if (category === 'inequalities') {
        subs = [{id:'first_degree', name:'1ου Βαθμού'}];
    }

    subSelector.innerHTML = `
        <div style="display: grid; gap: 12px; width: 100%;">
            ${subs.map(s => `
                <div class="category-card" onclick="startQuiz('${category}', '${s.id}')">
                    <h3>${s.name}</h3>
                    <p>DATA_SUBSET // ACCESS</p>
                </div>
            `).join('')}
            <button class="back-btn" onclick="location.reload()">ΠΙΣΩ ΣΤΟ MENU</button>
        </div>`;
}

function startQuiz(cat, sub) {
    document.getElementById('subcategory-selector').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    currentQuiz = shuffle(allQuestions.filter(q => q.category === cat && q.subcategory === sub));
    currentIndex = 0; score = 0; startTime = Date.now();
    showQuestion();
}

function updateProgress() {
    const percent = currentQuiz.length > 0 ? (currentIndex / currentQuiz.length) * 100 : 0;
    const bar = document.getElementById('progress-bar');
    if(bar) bar.style.width = percent + '%';
}

function showQuestion() {
    updateProgress();
    const stack = document.getElementById('card-stack');
    if(currentIndex >= currentQuiz.length) {
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        const accuracy = currentQuiz.length > 0 ? ((score / currentQuiz.length) * 100).toFixed(0) : 0;
        stack.innerHTML = `
            <div class="quiz-card">
                <p class="question-text">SESSION_COMPLETE</p>
                <div class="stats-grid">
                    <div class="stat-item"><div class="stat-label">Score</div><div class="stat-value">${score}/${currentQuiz.length}</div></div>
                    <div class="stat-item"><div class="stat-label">Accuracy</div><div class="stat-value">${accuracy}%</div></div>
                    <div class="stat-item"><div class="stat-label">Time</div><div class="stat-value">${totalTime}s</div></div>
                </div>
                <button class="back-btn" onclick="location.reload()">RESTART SYSTEM</button>
            </div>`;
        return;
    }
    const q = currentQuiz[currentIndex];
    const shuffledOptions = shuffle([...q.options]);
    let parts = q.question.split(':');
    let instruction = parts.length > 1 ? parts[0].trim() : 'Άσκηση';
    let expression = parts.length > 1 ? parts[1].trim() : q.question;
    stack.innerHTML = `
        <div class="quiz-card">
            <div class="timer-text">● LIVE_FEED</div>
            <p class="question-text">${instruction}:</p>
            <div class="math-expression">${expression}</div>
            <div class="options-grid">
                ${shuffledOptions.map(opt => `<button class="opt-btn" onclick="handleAnswer(this, '${opt}', '${q.answer}')">${opt}</button>`).join('')}
            </div>
        </div>`;
}

function handleAnswer(btn, selected, correct) {
    const allBtns = btn.parentElement.querySelectorAll('.opt-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');
    if(selected === correct) { score++; btn.classList.add('correct'); }
    else { btn.classList.add('incorrect'); allBtns.forEach(b => { if(b.innerText === correct) b.classList.add('correct-reveal'); }); }
    currentIndex++; setTimeout(showQuestion, 1000);
}
window.onload = init;
