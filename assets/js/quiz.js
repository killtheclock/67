let allQuestions = [];
let currentQuiz = [];
let currentIndex = 0;
let score = 0;

async function init() {
    const res = await fetch('data/questions/math_g_gymn.json');
    allQuestions = await res.json();
}

function showSubcategories(category) {
    document.getElementById('category-selector').classList.add('hidden');
    const subSelector = document.getElementById('subcategory-selector');
    subSelector.classList.remove('hidden');
    
    // Εδώ ορίζουμε στατικά τις υποενότητες για το παράδειγμα
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
        stack.innerHTML = `<h2>Τέλος Quiz!</h2><p class="score-board">Σκορ: ${score} / ${currentQuiz.length}</p>`;
        return;
    }

    const q = currentQuiz[currentIndex];
    stack.innerHTML = `
        <div class="quiz-card">
            <p style="color:var(--accent)">Ερώτηση ${currentIndex + 1} από ${currentQuiz.length}</p>
            <h2>${q.question}</h2>
            <div class="options-grid">
                ${q.options.map(opt => `<button class="opt-btn" onclick="handleAnswer('${opt}', '${q.answer}')">${opt}</button>`).join('')}
            </div>
        </div>
    `;
}

function handleAnswer(selected, correct) {
    if(selected === correct) score++;
    currentIndex++;
    setTimeout(showQuestion, 500); // Μικρή καθυστέρηση για εφέ
}

window.onload = init;
