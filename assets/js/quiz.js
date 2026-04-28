let allQuestions = [];
let currentQuiz = [];
let currentIndex = 0;
let score = 0;
let startTime;

async function init() {
    try {
        const res = await fetch('data/questions/math_g_gymn.json');
        allQuestions = await res.json();
        updateMainPageCounters();
    } catch (e) { console.error("Error", e); }
}

function getCount(cat, sub = null) {
    if (sub) return allQuestions.filter(q => q.category === cat && q.subcategory === sub).length;
    return allQuestions.filter(q => q.category === cat).length;
}

function updateMainPageCounters() {
    const categories = ['ops', 'identities', 'factorization', 'rational', 'equations', 'inequalities', 'systems', 'geometry', 'trigonometry'];
    categories.forEach(cat => {
        const card = document.querySelector(`div[onclick*="'${cat}'"]`);
        if (card) {
            let span = card.querySelector('.total-count') || document.createElement('span');
            span.className = 'total-count';
            span.innerText = `TOTAL_EXERCISES // ${getCount(cat)}`;
            card.appendChild(span);
        }
    });
}

function showSubcategories(category) {
    const mainSelector = document.getElementById('category-selector');
    const subSelector = document.getElementById('subcategory-selector');
    mainSelector.classList.add('hidden');
    subSelector.classList.remove('hidden');
    
    let subs = getSubMenu(category);

    subSelector.innerHTML = `
        <div style="display: grid; gap: 10px; width: 100%;">
            ${subs.map(s => {
                const n = getCount(category, s.id);
                return `
                <div class="category-card" onclick="${n > 0 ? `startQuiz('${category}', '${s.id}')` : ''}" style="${n === 0 ? 'opacity:0.4' : ''}">
                    <h3>${s.name}</h3>
                    <span class="total-count">AVAILABLE // ${n}</span>
                </div>`;
            }).join('')}
            <button class="back-btn" onclick="location.reload()">BACK_TO_CORE</button>
        </div>`;
}

function getSubMenu(category) {
    const map = {
        'ops': [{id:'monomial_ops', name:'Πράξεις Μονωνύμων'}, {id:'poly_ops', name:'Πράξεις Πολυωνύμων'}],
        'identities': [{id:'sq_sum', name:'Τετράγωνο Αθροίσματος'}, {id:'diff_sq', name:'Διαφορά Τετραγώνων'}],
        'factorization': [{id:'comm_fact', name:'Κοινός Παράγοντας'}, {id:'trinomial', name:'Τριώνυμο'}],
        'rational': [{id:'simplification', name:'Απλοποίηση'}, {id:'rational_ops', name:'Πράξεις Ρητών'}],
        'equations': [{id:'quad_formula', name:'2ου Βαθμού (Δ)'}, {id:'fractional_eq', name:'Κλασματικές'}]
    };
    return map[category] || [];
}

function showQuestion() {
    const stack = document.getElementById('card-stack');
    if(currentIndex >= currentQuiz.length) {
        stack.innerHTML = `<div class="quiz-card"><h2>COMPLETE</h2><button class="back-btn" onclick="location.reload()">RESTART</button></div>`;
        return;
    }
    const q = currentQuiz[currentIndex];
    stack.innerHTML = `
        <div class="quiz-card">
            <p class="question-text">ΑΣΚΗΣΗ ${currentIndex + 1} / ${currentQuiz.length}:</p>
            <div class="math-expression">${q.question}</div>
            <div class="options-grid">
                ${q.options.map(opt => `<button class="opt-btn" onclick="handleAnswer(this, '${opt}', '${q.answer}')">${opt}</button>`).join('')}
            </div>
        </div>`;
    
    // ΕΠΙΒΟΛΗ RENDER ΤΟΥ MATHJAX
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

function startQuiz(cat, sub) {
    document.getElementById('subcategory-selector').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    currentQuiz = allQuestions.filter(q => q.category === cat && q.subcategory === sub);
    currentIndex = 0; score = 0;
    showQuestion();
}

function handleAnswer(btn, selected, correct) {
    if(selected === correct) { btn.classList.add('correct'); score++; }
    else { btn.classList.add('incorrect'); }
    currentIndex++;
    setTimeout(showQuestion, 1000);
}

window.onload = init;
