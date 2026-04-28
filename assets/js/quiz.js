let allQuestions = [];

// Φόρτωση δεδομένων και αρχικοποίηση
async function init() {
    try {
        const response = await fetch('data/questions/math_g_gymn.json');
        allQuestions = await response.json();
        updateCounts();
    } catch (e) {
        console.error("Failed to load questions");
    }
}

function updateCounts() {
    const categories = ['factorization', 'identities'];
    categories.forEach(cat => {
        const count = allQuestions.filter(q => q.category === cat).length;
        const badge = document.querySelector(`.category-card[onclick*="${cat}"] .exercise-count`);
        if (badge) badge.innerText = `${count} ασκήσεις`;
    });
}

function loadQuiz(category) {
    const selector = document.getElementById('category-selector');
    const container = document.getElementById('quiz-container');
    const stack = document.getElementById('card-stack');

    selector.classList.add('hidden');
    container.classList.remove('hidden');

    const filtered = allQuestions.filter(q => q.category === category);
    
    stack.innerHTML = filtered.map(q => `
        <div class="quiz-card">
            <small>ID: #${q.id}</small>
            <p style="font-size: 1.2rem; font-weight: bold;">${q.question}</p>
            ${q.image ? `<img src="${q.image}" style="max-width:100%; margin-bottom:10px;">` : ''}
            <div class="options-grid">
                ${q.options.map(opt => `
                    <button class="opt-btn" onclick="checkAnswer(this, '${q.answer}', '${opt}')">${opt}</button>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function checkAnswer(btn, correct, selected) {
    const parent = btn.parentElement;
    const buttons = parent.querySelectorAll('.opt-btn');
    
    buttons.forEach(b => b.style.pointerEvents = 'none'); // Κλείδωμα κουμπιών

    if (selected === correct) {
        btn.style.backgroundColor = 'var(--success)';
        btn.style.color = 'white';
        btn.style.borderColor = 'var(--success)';
    } else {
        btn.style.backgroundColor = 'var(--error)';
        btn.style.color = 'white';
        btn.style.borderColor = 'var(--error)';
    }
}

window.onload = init;
