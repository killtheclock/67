var allQuestions = [];
var currentQuiz = [];
var currentIndex = 0;

// Φόρτωση δεδομένων
var xhr = new XMLHttpRequest();
xhr.open("GET", "data/questions/math_g_gymn.json", true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        allQuestions = JSON.parse(xhr.responseText);
        updateCategoryCounters();
    }
};
xhr.send();

// 1. Counters Ασκήσεων στο Μενού
function updateCategoryCounters() {
    var cards = document.querySelectorAll('.category-card');
    cards.forEach(function(card) {
        var subKey = card.getAttribute('data-sub');
        // Απλό φιλτράρισμα (υποθέτουμε ότι το JSON έχει καθαρά subcategories τώρα)
        var count = allQuestions.filter(function(q) {
            return q.subcategory.trim() === subKey.trim();
        }).length;
        
        var countTag = card.querySelector('.count-tag');
        if(countTag) countTag.innerText = "[" + count + "]";
    });
}

// 2. Έναρξη Quiz
function showSubcategories(catID) {
    var card = document.querySelector('[data-cat="' + catID + '"]');
    var subName = card.getAttribute('data-sub');
    
    currentQuiz = allQuestions.filter(function(q) {
        return q.subcategory.trim() === subName.trim();
    });

    if (currentQuiz.length > 0) {
        currentIndex = 0;
        document.getElementById('category-selector').classList.add('hidden');
        document.getElementById('quiz-container').classList.remove('hidden');
        document.getElementById('progress-container').classList.remove('hidden');
        updateProgressBar();
        renderQuestion();
    }
}

// 3. Εμφάνιση Ερώτησης
function renderQuestion() {
    var q = currentQuiz[currentIndex];
    var container = document.getElementById('card-stack');
    
    // Καθαρισμός Feedback
    var fb = document.getElementById('feedback-bar');
    fb.innerText = "SELECT ANSWER";
    fb.className = "";

    var html = '<div class="quiz-card">' +
               '<div class="question-text">' + q.question + '</div>' +
               '<div class="options-grid">';
    
    q.options.forEach(function(opt) {
        // Safe string escape for onclick
        var escapedOpt = opt.replace(/'/g, "\\'");
        var escapedAns = q.answer.replace(/'/g, "\\'");
        html += '<button class="opt-btn" onclick="checkAnswer(this, \'' + escapedOpt + '\', \'' + escapedAns + '\')">' + opt + '</button>';
    });
    
    html += '</div></div>';
    container.innerHTML = html;
    
    // MathJax Typeset (image_1.png fix)
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise();
    }
}

// 4. Έλεγχος Απάντησης (Όχι Pop-ups)
function checkAnswer(btn, selected, correct) {
    // Απενεργοποίηση κουμπιών για να μην ξαναπατηθούν
    var buttons = document.querySelectorAll('.opt-btn');
    buttons.forEach(function(b) { b.disabled = true; });

    var fb = document.getElementById('feedback-bar');
    
    if (selected === correct) {
        fb.innerText = "CORRECT";
        fb.className = "feedback-correct";
        btn.style.backgroundColor = "#ccffcc";
    } else {
        fb.innerText = "WRONG. CORRECT: " + correct;
        fb.className = "feedback-wrong";
        btn.style.backgroundColor = "#ffcccc";
    }
    
    // Typeset feedback αν περιέχει Math
    if (window.MathJax && window.MathJax.typesetPromise) { MathJax.typesetPromise([fb]); }

    currentIndex++;
    
    // Καθυστέρηση πριν την επόμενη ερώτηση
    setTimeout(function() {
        if (currentIndex < currentQuiz.length) {
            updateProgressBar();
            renderQuestion();
        } else {
            showFinalScreen();
        }
    }, 1500);
}

// 5. Progress Bar
function updateProgressBar() {
    var bar = document.getElementById('progress-bar');
    var percentage = ((currentIndex + 1) / currentQuiz.length) * 100;
    bar.style.width = percentage + "%";
}

// 6. Τελική Οθόνη & Κουμπί Αρχής
function showFinalScreen() {
    document.getElementById('progress-container').classList.add('hidden');
    var container = document.getElementById('card-stack');
    document.getElementById('feedback-bar').classList.add('hidden');
    
    container.innerHTML = '<div style="text-align:center; padding:20px; border:2px solid black;">' +
        '<h2>TEST_COMPLETE</h2>' +
        '<button onclick="goHome()" class="nav-btn" style="margin-top:20px;">[ RETURN_TO_SYSTEM_LOG ]</button>' +
        '</div>';
}

function goHome() {
    location.reload(); // Ο πιο απλός τρόπος για Brutalist reset
}
