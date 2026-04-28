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
                <p style="font-size:2rem; color:var(--accent);">${score} / ${currentQuiz.length}</p>
                <button class="opt-btn" style="background:var(--accent-grad); color:white; border:none;" onclick="window.location.reload()">ΕΠΙΣΤΡΟΦΗ</button>
            </div>`;
        return;
    }

    const q = currentQuiz[currentIndex];
    
    // Έξυπνος διαχωρισμός εντολής και παράστασης (ψάχνει για την άνω-κάτω τελεία)
    let parts = q.question.split(':');
    let instruction = parts[0] ? parts[0].trim() + ':' : 'Άσκηση:';
    let expression = parts[1] ? parts[1].trim() : q.question;

    stack.innerHTML = `
        <div class="quiz-card">
            <p style="color:var(--accent); font-size:0.8rem; margin-bottom:10px;">ΕΡΩΤΗΣΗ ${currentIndex + 1} / ${currentQuiz.length}</p>
            <div class="question-text">${instruction}</div>
            <div class="math-expression">${expression}</div>
            <div class="options-grid">
                ${q.options.map(opt => `
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
        btn.style.background = "#2ecc71";
        btn.style.borderColor = "#2ecc71";
        btn.style.color = "white";
    } else {
        btn.style.background = "#e74c3c";
        btn.style.borderColor = "#e74c3c";
        btn.style.color = "white";
        allBtns.forEach(b => {
            if(b.innerText === correct) {
                b.style.border = "2px solid #2ecc71";
                b.style.color = "#2ecc71";
            }
        });
    }

    currentIndex++;
    setTimeout(showQuestion, 1200);
}

window.onload = init;
