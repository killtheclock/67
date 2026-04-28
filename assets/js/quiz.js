var allQuestions = [];
var currentQuiz = [];
var currentIndex = 0;

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
    
    var subName = mapping[catID] || catID;
    startQuiz(subName);
}

function startQuiz(subName) {
    // Φιλτράρισμα που αγνοεί τόνους και κεφαλαία
    currentQuiz = allQuestions.filter(function(q) {
        var normalize = function(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
        };
        return normalize(q.subcategory) === normalize(subName);
    });

    if (currentQuiz.length > 0) {
        currentIndex = 0;
        document.getElementById('category-selector').style.display = 'none';
        document.getElementById('quiz-container').classList.remove('hidden');
        renderQuestion();
    } else {
        alert("Δεν βρέθηκαν ερωτήσεις για: " + subName);
    }
}

function renderQuestion() {
    var q = currentQuiz[currentIndex];
    var container = document.getElementById('card-stack');
    
    var html = '<div class="quiz-card">' +
               '<div class="question-text" style="font-size:1.5rem; color:#00ff00; margin-bottom:20px;">' + q.question + '</div>' +
               '<div class="options-grid" style="display:grid; gap:10px;">';
    
    q.options.forEach(function(opt) {
        html += '<button class="opt-btn" onclick="checkAnswer(\'' + opt + '\', \'' + q.answer + '\')" ' +
                'style="padding:15px; background:rgba(0,255,0,0.1); border:1px solid #00ff00; color:#00ff00; cursor:pointer;">' + 
                opt + '</button>';
    });
    
    html += '</div></div>';
    container.innerHTML = html;
    
    if (window.MathJax) MathJax.typesetPromise();
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        alert("ΣΩΣΤΟ! (+1)");
    } else {
        alert("ΛΑΘΟΣ! Η σωστή απάντηση ήταν: " + correct);
    }
    
    currentIndex++;
    if (currentIndex < currentQuiz.length) {
        renderQuestion();
    } else {
        document.getElementById('card-stack').innerHTML = '<h2 style="color:#00ff00;">MISSION COMPLETE</h2>' +
            '<button onclick="location.reload()" style="padding:15px; width:100%;">REBOOT SYSTEM</button>';
    }
}
