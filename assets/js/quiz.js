let allQuestions = [];
let currentQuiz = [];
let currentIndex = 0;

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
    showQuestion();
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
            <p style="font-size:0.7rem; color:#4ade80;">SIGNAL_STABLE // EXERCISE ${currentIndex + 1}/${currentQuiz.length}</p>
            <div class="math-expression" style="font-size:1.5rem; margin:20px 0;">$${q.question}$</div>
            <div class="options-grid">
                ${q.options.map(opt => `<button class="opt-btn" onclick="handleAnswer('${opt}', '${q.answer}')">$${opt}$</button>`).join('')}
            </div>
        </div>`;
    if (window.MathJax) MathJax.typeset();
}

function handleAnswer(sel, cor) {
    if(sel === cor) {
        currentIndex++;
        showQuestion();
    } else {
        alert('ACCESS_DENIED: WRONG_ANSWER');
    }
}

window.onload = init;
