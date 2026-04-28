let allQuestions = [];

async function init() {
    try {
        const response = await fetch('data/questions/math_g_gymn.json');
        allQuestions = await response.json();
        updateCounts();
    } catch (e) { console.error("Error loading JSON", e); }
}

function updateCounts() {
    document.querySelectorAll('.exercise-count').forEach(badge => {
        const cat = badge.getAttribute('data-cat');
        const count = allQuestions.filter(q => q.category === cat).length;
        badge.innerText = `${count} ΑΣΚΗΣΕΙΣ`;
    });
}

function loadQuiz(category) {
    // Κρύβουμε τελείως τις ενότητες
    document.getElementById('category-selector').classList.add('hidden');
    // Εμφανίζουμε το container του quiz
    const container = document.getElementById('quiz-container');
    container.classList.remove('hidden');

    const stack = document.getElementById('card-stack');
    const filtered = allQuestions.filter(q => q.category === category);
    
    stack.innerHTML = filtered.map(q => `
        <div class="quiz-card">
            <p style="color: var(--text-muted); font-size: 0.7rem; letter-spacing:1px;">${category.toUpperCase()}</p>
            <h2 style="font-weight: 400; font-size: 1.3rem; margin: 15px 0 25px 0;">${q.question}</h2>
            <div class="options-grid">
                ${q.options.map(opt => `
                    <button class="opt-btn" onclick="checkAnswer(this, '${q.answer}', '${opt}')">${opt}</button>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    // Scroll στην κορυφή
    window.scrollTo(0,0);
}

function checkAnswer(btn, correct, selected) {
    const allBtns = btn.parentElement.querySelectorAll('.opt-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if (selected === correct) {
        btn.style.background = "#2ecc71";
        btn.style.borderColor = "#2ecc71";
    } else {
        btn.style.background = "#e74c3c";
        btn.style.borderColor = "#e74c3c";
    }
}

window.onload = init;
