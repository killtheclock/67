alert("1. Script Started");

// Χρησιμοποιούμε var για μέγιστη συμβατότητα με παλιά κινητά
var allQuestions = [];

window.onload = function() {
    alert("2. Page Loaded - Fetching JSON...");
    
    fetch('data/questions/math_g_gymn.json')
        .then(function(res) { 
            return res.json(); 
        })
        .then(function(data) {
            allQuestions = data;
            alert("3. SUCCESS! Found " + data.length + " questions.");
        })
        .catch(function(err) {
            alert("3. ERROR: " + err.message);
        });
};

function startQuiz(cat, sub) {
    alert("Attempting to start: " + sub);
    if (allQuestions.length === 0) {
        alert("Wait! Data not loaded yet.");
        return;
    }
    // Εδώ θα μπει ο υπόλοιπος κώδικας αφού σιγουρευτούμε ότι δουλεύουν τα alerts
    console.log(cat, sub);
}
