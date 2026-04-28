async function loadQuiz(category) {
    const selector = document.getElementById('category-selector');
    const container = document.getElementById('quiz-container');
    const stack = document.getElementById('card-stack');

    selector.classList.add('hidden');
    container.classList.remove('hidden');

    try {
        const response = await fetch('data/questions/math_g_gymn.json');
        const questions = await response.json();
        
        const filtered = questions.filter(q => q.category === category);
        
        stack.innerHTML = filtered.map(q => `
            <div class="quiz-card">
                <h3>Άσκηση</h3>
                <p>${q.question}</p>
                ${q.image ? `<img src="${q.image}" style="max-width:100%">` : ''}
                <div class="options">
                    ${q.options.map(opt => `<button onclick="checkAnswer(this, '${q.answer}', '${opt}')">${opt}</button>`).join('')}
                </div>
            </div>
        `).join('');
    } catch (error) {
        stack.innerHTML = '<p>Σφάλμα κατά τη φόρτωση των ερωτήσεων.</p>';
    }
}

function checkAnswer(btn, correct, selected) {
    if (correct === selected) {
        btn.style.background = "#2ecc71";
        btn.style.color = "white";
    } else {
        btn.style.background = "#e74c3c";
        btn.style.color = "white";
    }
}
