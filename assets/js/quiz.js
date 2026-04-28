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
    // 1. Βρίσκουμε το στοιχείο που πατήθηκε στο HTML
    var card = document.querySelector('[data-cat="' + catID + '"]');
    // 2. Παίρνουμε το κείμενο από το <p> (π.χ. "Τριγωνομετρία")
    var subNameFromHTML = card.querySelector('p').innerText.split('//')[1].trim();
    
    alert("SYSTEM: Αναζήτηση για " + subNameFromHTML);
    startQuiz(subNameFromHTML);
}

function startQuiz(subName) {
    var normalize = function(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    };

    currentQuiz = allQuestions.filter(function(q) {
        return normalize(q.subcategory) === normalize(subName);
    });

    if (currentQuiz.length > 0) {
        currentIndex = 0;
        document.getElementById('category-selector').style.display = 'none';
        document.getElementById('quiz-container').classList.remove('hidden');
        renderQuestion();
    } else {
        alert("ΑΠΟΤΥΧΙΑ: Στο JSON η κατηγορία γράφεται διαφορετικά από το '" + subName + "'");
    }
}

function renderQuestion() {
    var q = currentQuiz[currentIndex];
    var container = document.getElementById('card-stack');
    
    var html = '<div class="quiz-card" style="background:#000; border:2px solid #00ff00; padding:20px; border-radius:10px;">' +
               '<div class="question-text" style="font-size:1.3rem; color:#00ff00; margin-bottom:20px; font-family:monospace;">' + q.question + '</div>' +
               '<div class="options-grid" style="display:grid; gap:10px;">';
    
    q.options.forEach(function(opt) {
        html += '<button class="opt-btn" onclick="checkAnswer(\'' + opt.replace(/'/g, "\\'") + '\', \'' + q.answer.replace(/'/g, "\\'") + '\')" ' +
                'style="padding:15px; background:transparent; border:1px solid #00ff00; color:#00ff00; font-family:monospace; cursor:pointer;">' + 
                opt + '</button>';
    });
    
    html += '</div></div>';
    container.innerHTML = html;
    
    if (window.MathJax) MathJax.typesetPromise();
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        alert("CORRECT_IDENTIFIED // ΣΩΣΤΟ");
    } else {
        alert("ERROR_FOUND // ΛΑΘΟΣ: " + correct);
    }
    
    currentIndex++;
    if (currentIndex < currentQuiz.length) {
        renderQuestion();
    } else {
        document.getElementById('card-stack').innerHTML = '<div style="text-align:center; color:#00ff00;"><h2>SYSTEM_COMPLETED</h2><button onclick="location.reload()" style="padding:15px; background:#00ff00; color:#000; border:none; cursor:pointer; width:100%;">[ REBOOT ]</button></div>';
    }
}
