var allQuestions = [];
var currentQuiz = [];
var currentIndex = 0;

var xhr = new XMLHttpRequest();
xhr.open("GET", "data/questions/math_g_gymn.json", true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        allQuestions = JSON.parse(xhr.responseText);
    }
};
xhr.send();

function normalize(str) {
    if(!str) return "";
    // Αφαιρεί τόνους, κενά στην αρχή/τέλος και μετατρέπει σε μικρά
    return str.toString().normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replace(/\s+/g, '') // Αφαιρεί ΟΛΑ τα κενά
              .trim();
}

function showSubcategories(catID) {
    var card = document.querySelector('[data-cat="' + catID + '"]');
    var subName = card.getAttribute('data-sub');
    startQuiz(subName);
}

function startQuiz(subName) {
    var searchKey = normalize(subName);
    
    currentQuiz = allQuestions.filter(function(q) {
        return normalize(q.subcategory) === searchKey;
    });

    if (currentQuiz.length > 0) {
        currentIndex = 0;
        document.getElementById('category-selector').style.display = 'none';
        document.getElementById('quiz-container').classList.remove('hidden');
        renderQuestion();
    } else {
        // Αν αποτύχει, μας δείχνει τι ακριβώς "βλέπει" στο πρώτο στοιχείο του JSON
        var example = allQuestions.length > 0 ? allQuestions[0].subcategory : "EMPTY";
        alert("DEBUG:\nΈψαξα για: [" + searchKey + "]\nΣτο JSON βρήκα: [" + normalize(example) + "]");
    }
}

function renderQuestion() {
    var q = currentQuiz[currentIndex];
    var container = document.getElementById('card-stack');
    var html = '<div class="quiz-card" style="background:#1a1a1a; border:2px solid #00ff00; padding:20px; border-radius:10px;">' +
               '<div class="question-text" style="font-size:1.2rem; color:#00ff00; margin-bottom:20px;">' + q.question + '</div>' +
               '<div class="options-grid" style="display:grid; gap:10px;">';
    q.options.forEach(function(opt) {
        html += '<button class="opt-btn" onclick="checkAnswer(\'' + opt.replace(/'/g, "\\'") + '\', \'' + q.answer.replace(/'/g, "\\'") + '\')" ' +
                'style="padding:15px; background:transparent; border:1px solid #00ff00; color:#00ff00; cursor:pointer; text-align:left;">' + opt + '</button>';
    });
    html += '</div></div>';
    container.innerHTML = html;
    if (window.MathJax) MathJax.typesetPromise();
}

function checkAnswer(selected, correct) {
    if (selected === correct) { alert("ΣΩΣΤΟ!"); } 
    else { alert("ΛΑΘΟΣ! Η σωστή απάντηση: " + correct); }
    currentIndex++;
    if (currentIndex < currentQuiz.length) { renderQuestion(); } 
    else { document.getElementById('card-stack').innerHTML = '<div style="color:#00ff00;text-align:center;"><h2>ΤΕΛΟΣ</h2><button onclick="location.reload()">RESTART</button></div>'; }
}
