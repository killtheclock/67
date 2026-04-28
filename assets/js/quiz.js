let allQuestions = [];

async function init() {
    try {
        const response = await fetch('data/questions/math_g_gymn.json');
        if (!response.ok) throw new Error('Network error');
        allQuestions = await response.json();
        console.log("Loaded questions:", allQuestions.length);
        updateCounts();
    } catch (e) {
        console.error("Error:", e);
    }
}

function updateCounts() {
    const badges = document.querySelectorAll('.exercise-count');
    badges.forEach(badge => {
        const cat = badge.getAttribute('data-cat');
        const count = allQuestions.filter(q => q.category === cat).length;
        badge.innerText = `${count} ΑΣΚΗΣΕΙΣ`;
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
            <p style="color: var(--text-muted); font-size: 0.8rem;">ΕΝΟΤΗΤΑ: ${category.toUpperCase()}</p>
            <h2 style="font-weight: 400; margin-bottom: 25px;">${q.question}</h2>
            <div class="options-grid">
                ${q.options.map(opt => `
                    <button class="opt-btn" onclick="checkAnswer(this, '${q.answer}', '${opt}')">${opt}</button>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function checkAnswer(btn, correct, selected) {
    if (selected === correct) {
        btn.style.background = "#2ecc71";
        btn.style.borderColor = "#2ecc71";
    } else {
        btn.style.background = "#e74c3c";
        btn.style.borderColor = "#e74c3c";
    }
    const btns = btn.parentElement.querySelectorAll('.opt-btn');
    btns.forEach(b => b.style.pointerEvents = 'none');
}

window.onload = init;
