document.addEventListener('DOMContentLoaded', () => {
    fetch('data/questions/math_g_gymn.json')
        .then(res => res.json())
        .then(data => {
            allQuestions = data;
            console.log("Data Loaded");
            // Force refresh των κουμπιών στο αρχικό μενού αν χρειάζεται
            setupCategoryButtons();
        })
        .catch(err => alert("Fetch Error: " + err));
});

function setupCategoryButtons() {
    // Ψάχνουμε όλα τα κουμπιά που έχουν onclick="startQuiz(...)"
    const buttons = document.querySelectorAll('.cat-btn, .sub-btn');
    buttons.forEach(btn => {
        // Αν το κουμπί είναι "νεκρό", του δίνουμε ζωή
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
    });
}
