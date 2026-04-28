let allQuestions = [];
let currentQuiz = [];
let currentIndex = 0;
let score = 0;

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
        </div>
    `).join('');
}

function startQuiz(cat, sub) {
    document.getElementById('subcategory-selector').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    
    currentQuiz = allQuestions.filter(q => q.category === cat && q.subcategory === sub);
    currentIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const stack = document.getElementById('card-stack');
    if(currentIndex >= currentQuiz.length) {
        stack.innerHTML = `
            <div class="quiz-card">
                <h2>Ολοκληρώθηκε!</h2>
                <p class="score-board">Σκορ: ${score} / ${currentQuiz.length}</p>
                <button class="back-btn" onclick="window.location.reload()">ΔΟΚΙΜΑΣΕ ΞΑΝΑ</button>
            </div>`;
        return;
    }

    const q = currentQuiz[currentIndex];
    stack.innerHTML = `
        <div class="quiz-card">
            <p style="color:var(--accent); font-weight:bold;">ΕΡΩΤΗΣΗ ${currentIndex + 1} / ${currentQuiz.length}</p>
            <h2 style="margin-bottom:30px;">${q.question}</h2>
            <div class="options-grid">
                ${q.options.map(opt => `
                    <button class="opt-btn" onclick="handleAnswer(this, '${opt}', '${q.answer}')">${opt}</button>
                `).join('')}
            </div>
        </div>
    `;
}

function handleAnswer(btn, selected, correct) {
    // Απενεργοποίηση όλων των κουμπιών για να μην ξαναπατηθούν
    const allBtns = btn.parentElement.querySelectorAll('.opt-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if(selected === correct) {
        score++;
        btn.style.background = "#2ecc71"; // Πράσινο
        btn.style.borderColor = "#2ecc71";
    } else {
        btn.style.background = "#e74c3c"; // Κόκκινο
        btn.style.borderColor = "#e74c3c";
        
        // Δείξε ποιο ήταν το σωστό
        allBtns.forEach(b => {
            if(b.innerText === correct) {
                b.style.background = "#2ecc71";
                b.style.borderColor = "#2ecc71";
            }
        });
    }

    currentIndex++;
    // Περίμενε 1 δευτερόλεπτο για να προλάβει ο χρήστης να δει το αποτέλεσμα
    setTimeout(showQuestion, 1000);
}

window.onload = init;
