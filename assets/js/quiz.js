var allQuestions = [];

// Φόρτωση δεδομένων (AJAX για συμβατότητα)
var xhr = new XMLHttpRequest();
xhr.open("GET", "data/questions/math_g_gymn.json", true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        allQuestions = JSON.parse(xhr.responseText);
        console.log("JSON Loaded");
    }
};
xhr.send();

// ΑΥΤΗ Η ΣΥΝΑΡΤΗΣΗ ΕΛΕΙΠΕ
function showSubcategories(catID) {
    alert("Επιλέχθηκε η κατηγορία: " + catID);
    
    // Εδώ θα έπρεπε να ανοίγει ένα μενού, αλλά για να δούμε αν δουλεύει,
    // θα ξεκινάμε απευθείας τις ερωτήσεις που αντιστοιχούν στο catID
    startQuiz('ΜΑΘΗΜΑΤΙΚΑ Γ ΓΥΜΝΑΣΙΟΥ', catID);
}

function startQuiz(category, sub) {
    // Φιλτράρισμα με βάση το data-cat του HTML
    var found = allQuestions.filter(function(q) {
        return q.subcategory.toLowerCase().indexOf(sub.toLowerCase()) !== -1;
    });

    if (found.length > 0) {
        document.getElementById('category-selector').style.display = 'none';
        document.getElementById('quiz-container').classList.remove('hidden');
        document.getElementById('card-stack').innerHTML = '<h1>Φορτώθηκαν ' + found.length + ' ερωτήσεις!</h1>';
    } else {
        alert("Δεν βρέθηκαν ερωτήσεις για το κλειδί: " + sub);
    }
}
