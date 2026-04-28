alert("STEP 1: Script Loaded");

var allQuestions = [];

// Χρησιμοποιούμε το παλιό καλό onload
window.onload = function() {
    alert("STEP 2: Page Ready - Requesting JSON");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data/questions/math_g_gymn.json", true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    allQuestions = JSON.parse(xhr.responseText);
                    alert("STEP 3: SUCCESS! Loaded " + allQuestions.length + " questions.");
                } catch(e) {
                    alert("STEP 3: JSON PARSE ERROR: " + e.message);
                }
            } else {
                alert("STEP 3: HTTP ERROR! Status: " + xhr.status);
            }
        }
    };
    
    xhr.send();
};

function startQuiz(cat, sub) {
    alert("Click detected for: " + sub);
    if (allQuestions.length === 0) {
        alert("Data not ready. Please wait 2 seconds.");
        return;
    }
    // Ο κώδικας για την εμφάνιση των ερωτήσεων θα μπει εδώ 
    // μόλις δούμε ότι το Step 3 δουλεύει.
}
