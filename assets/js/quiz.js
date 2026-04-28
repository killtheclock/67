let allQuestions = [];
let currentQuiz = [];
let currentIndex = 0;
let score = 0;
let startTime;
let timerInterval;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function init() {
    const res = await fetch('data/questions/math_g_gymn.json');
    allQuestions = await res.json();
}

function showSubcategories(category) {
    document.getElementById('category-selector').classList.add('hidden');
    const subSelector = document.getElementById('subcategory-selector');
    subSelector.classList.remove('hidden');
    let subs = [];
    if (category === 'factorization') subs = [{id:'common_factor', name:'Κοινός Παράγοντας'}, {id:'grouping', name:'Ομαδοποίηση'}];
    else if (category === 'identities') subs = [{id:'square_sum', name:'Τετράγωνο Αθροίσματος'}, {id:'diff_squares', name:'Διαφορά Τετραγώνων'}];
    else if (category === 'equations') subs = [{id:'quadratic', name:'Δευτεροβάθμιες'}, {id:'fractional', name:'Κλασματικές'}];
        [{id:'common_factor', name:'Κοινός Παράγοντας'}, {id:'grouping', name:'Ομαδοποίηση'}] : 
        [{id:'square', name:'Ταυτότητες'}];
    
    subSelector.innerHTML = subs.map(s => `
        <div class="category-card" onclick="startQuiz('${category}', '${s.id}')">
            <h3>${s.name}</h3>
            <p>ENTRY _</p>
        </div>`).join('');
}

function startQuiz(cat, sub) {
    document.getElementById('subcategory-selector').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    currentQuiz = shuffle(allQuestions.filter(q => q.category === cat && q.subcategory === sub));
    currentIndex = 0;
    score = 0;
    startTime = Date.now();
    showQuestion();
}

function updateProgress() {
    const percent = ((currentIndex) / currentQuiz.length) * 100;
    document.getElementById('progress-bar').style.width = percent + '%';
}

function showQuestion() {
    updateProgress();
    const stack = document.getElementById('card-stack');
    
    if(currentIndex >= currentQuiz.length) {
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        const accuracy = ((score / currentQuiz.length) * 100).toFixed(0);
        
        stack.innerHTML = `
            <div class="quiz-card">
                <p class="question-text">MISSION COMPLETE</p>
                <div class="stats-grid">
                    <div class="stat-item"><div class="stat-label">Score</div><div class="stat-value">${score}/${currentQuiz.length}</div></div>
                    <div class="stat-item"><div class="stat-label">Accuracy</div><div class="stat-value">${accuracy}%</div></div>
                    <div class="stat-item"><div class="stat-label">Total Time</div><div class="stat-value">${totalTime}s</div></div>
                    <div class="stat-item"><div class="stat-label">Avg Speed</div><div class="stat-value">${(totalTime/currentQuiz.length).toFixed(1)}s/q</div></div>
                </div>
                <button class="back-btn" onclick="window.location.reload()">RESET SYSTEM</button>
            </div>`;
        return;
    }

    const q = currentQuiz[currentIndex];
    const shuffledOptions = shuffle([...q.options]);
    let [instruction, expression] = q.question.split(':');

    stack.innerHTML = `
        <div class="quiz-card">
            <div class="timer-text">● LIVE_TRACKING</div>
            <p class="question-text">${instruction || 'Άσκηση'}:</p>
            <div class="math-expression">${expression || q.question}</div>
            <div class="options-grid">
                ${shuffledOptions.map(opt => `
                    <button class="opt-btn" onclick="handleAnswer(this, '${opt}', '${q.answer}')">${opt}</button>
                `).join('')}
            </div>
        </div>`;
}

function handleAnswer(btn, selected, correct) {
    const allBtns = btn.parentElement.querySelectorAll('.opt-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if(selected === correct) {
        score++;
        btn.classList.add('correct');
    } else {
        btn.classList.add('incorrect');
        allBtns.forEach(b => { if(b.innerText === correct) b.classList.add('correct-reveal'); });
    }

    currentIndex++;
    setTimeout(showQuestion, 1000);
}

window.onload = init;
