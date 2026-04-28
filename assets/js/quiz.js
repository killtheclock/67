var allQuestions = [];

// Φόρτωση δεδομένων
var xhr = new XMLHttpRequest();
xhr.open("GET", "data/questions/math_g_gymn.json", true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        allQuestions = JSON.parse(xhr.responseText);
    }
};
xhr.send();

function showSubcategories(catID) {
    // Εδώ φτιάχνουμε το "λεξικό" για να βρίσκει τις ερωτήσεις
    var mapping = {
        'ops': 'Πράξεις',
        'identities': 'Ταυτότητες',
        'factorization': 'Παραγοντοποίηση',
        'rational': 'Ρητές',
        'equations': 'Εξισώσεις',
        'inequalities': 'Ανισώσεις',
        'systems': 'Συστήματα',
        'geometry': 'Γεωμετρία',
        'trigonometry': 'Τριγωνομετρία'
    };
    
    var subName = mapping[catID];
    
    // Debug Alert για να δούμε τι ψάχνει
    alert("Ψάχνω στο JSON για: " + subName);
    
    startQuiz(subName);
}

function startQuiz(subName) {
    var found = allQuestions.filter(function(q) {
        // Καθαρίζουμε από κενά και συγκρίνουμε
        return q.subcategory.trim() === subName;
    });

    if (found.length > 0) {
        alert("ΒΡΕΘΗΚΑΝ " + found.length + " ΕΡΩΤΗΣΕΙΣ!");
        // Εδώ κρύβουμε το μενού και δείχνουμε το quiz
        document.getElementById('category-selector').style.display = 'none';
        document.getElementById('quiz-container').classList.remove('hidden');
        
        // Δοκιμαστική εμφάνιση της πρώτης ερώτησης
        document.getElementById('card-stack').innerHTML = 
            '<div style="color:white; padding:20px;">' + 
            '<h3>' + found[0].question + '</h3>' +
            '</div>';
    } else {
        alert("ΣΦΑΛΜΑ: Δεν υπάρχει η υποκατηγορία '" + subName + "' στο JSON αρχείο.");
    }
}
