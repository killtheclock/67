let allQuestions = [];

alert("SYSTEM: Checking JSON source...");

document.addEventListener('DOMContentLoaded', () => {
    // Δοκιμάζουμε να φορτώσουμε το αρχείο
    fetch('data/questions/math_g_gymn.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Το αρχείο JSON δεν βρέθηκε (Status: " + response.status + ")");
            }
            return response.json();
        })
        .then(data => {
            allQuestions = data;
            alert("SUCCESS: Φορτώθηκαν " + data.length + " ερωτήσεις!");
        })
        .catch(err => {
            alert("CRITICAL_ERROR: " + err.message);
        });
});

function startQuiz(cat, sub) {
    if (allQuestions.length === 0) {
        alert("Αδύνατη η έναρξη: Η λίστα ερωτήσεων είναι άδεια.");
        return;
    }
    // ... υπόλοιπος κώδικας ...
    alert("Starting: " + sub);
}
