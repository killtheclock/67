var allQuestions = [];
var currentQuiz = [];
var currentIndex = 0;
var score = 0;

// 1. Φόρτωση δεδομένων με AJAX (δοκιμασμένο στο Step 3)
window.onload = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data/questions/math_g_gymn.json", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            allQuestions = JSON.parse(xhr.responseText);
            console.log("Data loaded successfully");
        }
    };
    xhr.send();
};

// 2. Έναρξη Quiz
function startQuiz(category, subcategory) {
    alert("DATA_CHECK: Έχω " + allQuestions.length + " ερωτήσεις στη μνήμη. Ψάχνω για: " + subcategory);
    // Φιλτράρισμα (Case Insensitive για σιγουριά)
    currentQuiz = allQuestions.filter(function(q) {
        return q.category.trim().toUpperCase() === category.trim().toUpperCase() && 
               q.subcategory.trim().toUpperCase() === subcategory.trim().toUpperCase();
    });

    if (currentQuiz.length === 0) {
        alert("Δεν βρέθηκαν ερωτήσεις για: " + subcategory);
        return;
    }

    currentIndex = 0;
    score = 0;
    
    document.getElementById('menu-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    showQuestion();
}

// 3. Εμφάνιση Ερώτησης
function showQuestion() {
    var q = currentQuiz[currentIndex];
    var quizBox = document.getElementById('quiz-box');
    
    var optionsHTML = q.options.map(function(opt) {
        return '<button class="opt-btn" onclick="handleAnswer(this, \'' + opt.replace(/'/g, "\\'") + '\', \'' + q.answer.replace(/'/g, "\\'") + '\')">' + opt + '</button>';
    }).join('');

    quizBox.innerHTML = '<div class="question-text">' + q.question + '</div>' +
                        '<div class="options-grid">' + optionsHTML + '</div>';
    
    if (window.MathJax) MathJax.typesetPromise();
}

// 4. Έλεγχος Απάντησης
function handleAnswer(btn, selected, correct) {
    var btns = document.querySelectorAll('.opt-btn');
    btns.forEach(function(b) { b.style.pointerEvents = 'none'; });

    if (selected === correct) {
        btn.style.background = "#00ff00";
        btn.style.color = "#000";
        score++;
    } else {
        btn.style.background = "#ff0000";
    }

    setTimeout(function() {
        currentIndex++;
        if (currentIndex < currentQuiz.length) {
            showQuestion();
        } else {
            showFinalStats();
        }
    }, 1000);
}

function showFinalStats() {
    var quizBox = document.getElementById('quiz-box');
    quizBox.innerHTML = '<div class="stats"><h2>ΤΕΛΟΣ!</h2><p>Σκορ: ' + score + '/' + currentQuiz.length + '</p>' +
                        '<button onclick="location.reload()" class="opt-btn">ΕΠΑΝΕΚΚΙΝΗΣΗ</button></div>';
}
