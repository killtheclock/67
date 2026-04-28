function showFinalStats() {
    const quizBox = document.getElementById('quiz-box');
    const accuracy = Math.round((score / currentQuiz.length) * 100) || 0;
    quizBox.innerHTML = `
        <div class="stats-screen" style="text-align:center; padding:20px; border:1px solid var(--neon-green); background:rgba(0,0,0,0.8);">
            <h2 style="color:var(--neon-green); text-shadow: 0 0 10px var(--neon-green);">MISSION_COMPLETE //</h2>
            <div style="margin:20px 0; font-family:monospace; color:#fff;">
                <p>ACCURACY: ${accuracy}%</p>
                <p>SCORE: ${score} / ${currentQuiz.length}</p>
            </div>
            <button onclick="location.reload()" class="opt-btn" style="border:1px solid var(--neon-green); background:transparent; color:var(--neon-green); padding:15px; cursor:pointer; width:100%; font-family:inherit;">
                [ REBOOT_SYSTEM ]
            </button>
        </div>`;
}

function handleAnswer(btn, selected, correct) {
    const allBtns = btn.parentElement.querySelectorAll('.opt-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');
    if(selected.trim() === correct.trim()) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('incorrect');
    }
    currentIndex++;
    if (currentIndex < currentQuiz.length) {
        setTimeout(showQuestion, 1000);
    } else {
        setTimeout(showFinalStats, 1000);
    }
}
