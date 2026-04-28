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
        console.log("System initialized.");
        updateMainPageCounters(); // Υπολογισμός συνόλων για την αρχική
    } catch (e) { 
        console.error("JSON Load Error", e); 
    }
}

function getCount(cat, sub = null) {
    if (sub) {
        return allQuestions.filter(q => q.category === cat && q.subcategory === sub).length;
    }
    return allQuestions.filter(q => q.category === cat).length;
}

function updateMainPageCounters() {
    const categories = ['ops', 'identities', 'factorization', 'rational', 'equations', 'inequalities', 'systems', 'geometry', 'trigonometry'];
    categories.forEach(cat => {
        const count = getCount(cat);
        const card = document.querySelector(`div[onclick*="'${cat}'"]`);
        if (card) {
            // Ψάχνουμε αν υπάρχει ήδη το span, αλλιώς το φτιάχνουμε
            let countSpan = card.querySelector('.total-count');
            if (!countSpan) {
                countSpan = document.createElement('span');
                countSpan.className = 'total-count';
                card.appendChild(countSpan);
            }
            countSpan.innerText = `TOTAL_EXERCISES // ${count}`;
        }
    });
}

function showSubcategories(category) {
    const mainSelector = document.getElementById('category-selector');
    const subSelector = document.getElementById('subcategory-selector');
    mainSelector.classList.add('hidden');
    subSelector.classList.remove('hidden');
    
    let subs = [];
    if (category === 'ops') {
        subs = [{id:'monomial_ops', name:'Πράξεις Μονωνύμων'}, {id:'poly_ops', name:'Πράξεις Πολυωνύμων'}];
    } else if (category === 'identities') {
        subs = [{id:'sq_sum', name:'Τετράγωνο Αθροίσματος'}, {id:'sq_diff', name:'Τετράγωνο Διαφοράς'}, {id:'diff_sq', name:'Διαφορά Τετραγώνων'}, {id:'cube_sum', name:'Κύβος Αθροίσματος/Διαφοράς'}];
    } else if (category === 'factorization') {
        subs = [{id:'comm_fact', name:'Κοινός Παράγοντας'}, {id:'grouping', name:'Ομαδοποίηση'}, {id:'diff_sq_fact', name:'Διαφορά Τετραγώνων'}, {id:'perfect_sq', name:'Τέλειο Τετράγωνο'}, {id:'trinomial', name:'Τριώνυμο x²+bx+c'}];
    } else if (category === 'rational') {
        subs = [{id:'limits', name:'Περιορισμοί'}, {id:'simplification', name:'Απλοποίηση'}, {id:'rational_ops', name:'Πράξεις Ρητών'}];
    } else if (category === 'equations') {
        subs = [{id:'linear', name:'1ου Βαθμού'}, {id:'quad_fact', name:'2ου Βαθμού (Παραγ/ση)'}, {id:'quad_formula', name:'2ου Βαθμού (Δ)'}, {id:'fractional_eq', name:'Κλασματικές'}];
    } else if (category === 'inequalities') {
        subs = [{id:'ineq_1', name:'Ανισώσεις 1ου Βαθμού'}];
    } else if (category === 'systems') {
        subs = [{id:'substitution', name:'Αντικατάσταση'}, {id:'opp_coeff', name:'Αντίθετοι Συντελεστές'}];
    } else if (category === 'geometry') {
        subs = [{id:'congruence', name:'Ισότητα Τριγώνων'}, {id:'similarity', name:'Ομοιότητα (Θαλής)'}];
    } else if (category === 'trigonometry') {
        subs = [{id:'trig_numbers', name:'Τριγωνομετρικοί Αριθμοί'}, {id:'trig_identities', name:'Ταυτότητες'}, {id:'sine_cosine_law', name:'Νόμος Ημ/Συν'}];
    }

    subSelector.innerHTML = `
        <div style="display: grid; gap: 10px; width: 100%;">
            ${subs.map(s => {
                const n = getCount(category, s.id);
                const isDisabled = n === 0;
                return `
                <div class="category-card" onclick="${isDisabled ? '' : `startQuiz('${category}', '${s.id}')`}" 
                     style="${isDisabled ? 'opacity:0.4; cursor:not-allowed;' : 'cursor:pointer;'}">
                    <h3>${s.name}</h3>
                    <p>AVAILABLE_ITEMS // ${n} ΑΣΚΗΣΕΙΣ</p>
                </div>`;
            }).join('')}
            <button class="back-btn" onclick="location.reload()">BACK_TO_CORE</button>
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
    const bar = document.getElementById('progress-bar');
    if(bar && currentQuiz.length > 0) {
        const percent = (currentIndex / currentQuiz.length) * 100;
        bar.style.width = percent + '%';
    }
}

function showQuestion() {
    updateProgress();
    const stack = document.getElementById('card-stack');
    if(currentIndex >= currentQuiz.length) {
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        const accuracy = currentQuiz.length > 0 ? ((score / currentQuiz.length) * 100).toFixed(0) : 0;
        stack.innerHTML = `
            <div class="quiz-card">
                <p class="question-text">TRACKING_COMPLETE</p>
                <div class="stats-grid">
                    <div class="stat-item"><div class="stat-label">Score</div><div class="stat-value">${score}/${currentQuiz.length}</div></div>
                    <div class="stat-item"><div class="stat-label">Accuracy</div><div class="stat-value">${accuracy}%</div></div>
                    <div class="stat-item"><div class="stat-label">Time</div><div class="stat-value">${totalTime}s</div></div>
                </div>
                <button class="back-btn" onclick="location.reload()">REBOOT_SYSTEM</button>
            </div>`;
        return;
    }
    const q = currentQuiz[currentIndex];
    const shuffledOptions = shuffle([...q.options]);
    stack.innerHTML = `
        <div class="quiz-card">
            <div class="timer-text">● SIGNAL_STABLE</div>
            <p class="question-text">ΑΣΚΗΣΗ ${currentIndex + 1} / ${currentQuiz.length}:</p>
            <div class="math-expression">${q.question}</div>
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
    currentIndex++; 
    setTimeout(showQuestion, 1000);
}
window.onload = init;
