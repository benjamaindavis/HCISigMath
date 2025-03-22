let complex = [];
let factoring = [];
let logarithms = [];

const topics = [
    {
        "name": "Complex Numbers",
        "content": "Complex numbers consist of a real part and an imaginary part, written in the form a + bi, where i is the imaginary unit (√-1). They are essential in solving equations that have no real solutions, and they follow unique arithmetic rules for addition, subtraction, multiplication, and division."
    },
    {
        "name": "Factoring",
        "content": "Factoring is the process of breaking down an expression into its multiplicative components. Common methods include factoring out the greatest common factor (GCF), factoring trinomials, and using special factorization formulas such as the difference of squares."
    },
    {
        "name": "Logarithms",
        "content": "Logarithms are the inverse operations of exponentiation, and they help solve equations involving exponential functions. They follow specific rules such as the product rule, quotient rule, and power rule, which simplify complex expressions and equations."
    }
];

async function loadUsers() {
    try {
        const response = await fetch('users.json');
        users = await response.json();
        console.log("[DEBUG] Loaded users:", users);  // Debugging line
    } catch (error) {
        console.error("[ERROR] Could not load users.json:", error);
    }
}

function loadQuestions() {
    return fetch('complex.json')
        .then(response => response.json())  // Parse the JSON response for complex questions
        .then(data => {
            complex = data.complex;  // Store complex questions in the global array
            console.log("[DEBUG] Loaded complex questions:", complex);  // Debugging line
        })
        .catch(error => {
            console.error('Error loading complex questions:', error);
        })
        .then(() => {
            return fetch('factoring.json');
        })
        .then(response => response.json())  // Parse the JSON response for factoring questions
        .then(data => {
            factoring = data.factoring;  // Store factoring questions in the global array
            console.log("[DEBUG] Loaded factoring questions:", factoring);  // Debugging line
        })
        .catch(error => {
            console.error('Error loading factoring questions:', error);
        })
        .then(() => {
            return fetch('logarithms.json');
        })
        .then(response => response.json())  // Parse the JSON response for logarithms questions
        .then(data => {
            logarithms = data.logarithms;  // Store logarithms questions in the global array
            console.log("[DEBUG] Loaded logarithms questions:", logarithms);  // Debugging line
        })
        .catch(error => {
            console.error('Error loading logarithms questions:', error);
        });
}


// Log to verify it's working
console.log("[DEBUG] Loaded hardcoded topics:", topics);

// Change here: Directly show Main Menu on page load
window.onload = function() {
    showMainMenu();  // Directly show the Main Menu
}

// Show Login Screen
function showLogin() {
    hideAllScreens();
    document.getElementById('login-screen').classList.add('active');
}

// Show Signup Screen
function showSignup() {
    hideAllScreens();
    document.getElementById('signup-screen').classList.add('active');
}

// Show Main Menu
function showMainMenu() {
    hideAllScreens();
    document.getElementById('main-menu').classList.add('active');
}

// Show Search Topic Screen
function openSearchTopic() {
    hideAllScreens();
    document.getElementById('search-topic-screen').classList.add('active');
}

function showProfile() {
    hideAllScreens();
    document.getElementById('profile-screen').classList.add('active');
}

// Hide All Screens
function hideAllScreens() {
    var screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
}

function displayArticle(topic) {
    // Ensure the article display is shown
    document.getElementById("article-display").classList.remove("hidden");
    document.getElementById("article-title").textContent = topic.name;
    document.getElementById("article-content").textContent = topic.content;
}



let currentQuestionIndex = 0;
let questionSet = [];
let selectedTopic = '';
let complexPreviouslyAttempted = [];
let factoringPreviouslyAttempted = [];
let logarithmsPreviouslyAttempted = [];

async function startPractice() {
    hideAllScreens();
    document.getElementById('math-practice-screen').classList.add('active');

    if (complex.length === 0 && factoring.length === 0 && logarithms.length === 0) {
        // Load questions only if all topics are empty
        await loadQuestions();
    }

    if (selectedTopic === 'complex') {
        prepareComplexQuestionSet();
        displayQuestion();
    } else if (selectedTopic === 'factoring') {
        prepareFactoringQuestionSet();
        displayQuestion();
    } else if (selectedTopic === 'logarithms') {
        prepareLogarithmsQuestionSet();
        displayQuestion();
    }
}

async function loadQuestions() {
    try {
        // Load complex questions
        const complexResponse = await fetch('complex.json');
        const complexData = await complexResponse.json();
        complex = complexData.complex;
        console.log("[DEBUG] Loaded complex questions:", complex);

        // Load factoring questions
        const factoringResponse = await fetch('factoring.json');
        const factoringData = await factoringResponse.json();
        factoring = factoringData.factoring;
        console.log("[DEBUG] Loaded factoring questions:", factoring);

        // Load logarithms questions
        const logarithmsResponse = await fetch('logarithms.json');
        const logarithmsData = await logarithmsResponse.json();
        logarithms = logarithmsData.logarithms;
        console.log("[DEBUG] Loaded logarithms questions:", logarithms);

    } catch (error) {
        console.error("[ERROR] Error loading questions:", error);
    }
}

function selectTopic(topicKey) {
    selectedTopic = topicKey;

    const topic = topics.find(t => 
        (topicKey === 'complex' && t.name === 'Complex Numbers') ||
        (topicKey === 'factoring' && t.name === 'Factoring') ||
        (topicKey === 'logarithms' && t.name === 'Logarithms')
    );

    if (topic) {
        displayArticle(topic);
    }
}



function prepareComplexQuestionSet() {
    // Combine previously attempted questions and random ones with prioritization
    questionSet = getRandomQuestions(complexPreviouslyAttempted, complex, 5);
    currentQuestionIndex = 0;
    score = 0;
}

function prepareFactoringQuestionSet() {
    // Combine previously attempted questions and random ones with prioritization
    questionSet = getRandomQuestions(factoringPreviouslyAttempted, factoring, 5);
    currentQuestionIndex = 0;
    score = 0;
}

function prepareLogarithmsQuestionSet() {
    // Combine previously attempted questions and random ones with prioritization
    questionSet = getRandomQuestions(logarithmsPreviouslyAttempted, logarithms, 5);
    currentQuestionIndex = 0;
    score = 0;
}


function getRandomQuestions(attemptedQuestions, allQuestions, num) {
    // First, prioritize previously attempted questions
    let selectedQuestions = [...attemptedQuestions];
    
    // If there are still questions needed, pick from the rest of the questions
    let remainingQuestions = allQuestions.filter(q => !attemptedQuestions.some(attempted => attempted.id === q.id));
    
    // Shuffle the remaining questions
    remainingQuestions.sort(() => 0.5 - Math.random());
    
    // Add enough questions from the remaining pool to make the total number `num`
    selectedQuestions = selectedQuestions.concat(remainingQuestions.slice(0, num - selectedQuestions.length));
    
    return selectedQuestions;
}


function displayQuestion() {
    if (currentQuestionIndex < questionSet.length) {
        let questionData = questionSet[currentQuestionIndex];

        // Check if the question has been previously attempted
        let previouslyAttemptedText = '';
        let previouslyAttemptedStyle = '';
        if ((selectedTopic === 'complex' && complexPreviouslyAttempted.some(q => q.id === questionData.id)) ||
            (selectedTopic === 'factoring' && factoringPreviouslyAttempted.some(q => q.id === questionData.id)) ||
            (selectedTopic === 'logarithms' && logarithmsPreviouslyAttempted.some(q => q.id === questionData.id))) {
            previouslyAttemptedText = ' (Previously attempted)';
            previouslyAttemptedStyle = 'color: red;'; // Set the color to red
        }

        // Display the question with the label if it was previously attempted
        document.getElementById("question-text").innerHTML = questionData.question + 
            `<span style="${previouslyAttemptedStyle}">${previouslyAttemptedText}</span>`;
        
        let choicesContainer = document.getElementById("choices-container");
        choicesContainer.innerHTML = ""; // Clear previous choices

        questionData.choices.sort(() => 0.5 - Math.random()).forEach(choice => { // Shuffle choices
            let button = document.createElement("button");
            button.textContent = choice;
            button.classList.add("choice-button");
            button.onclick = function () {
                checkAnswer(choice, questionData);
            };
            choicesContainer.appendChild(button);
        });

        // Update question counter
        document.getElementById("question-counter").textContent = `Question ${currentQuestionIndex + 1}/5`;

        document.getElementById("feedback").textContent = ""; // Clear previous feedback
    } else {
        endPractice();
    }
}

function checkAnswer(selectedChoice) {
    let questionData = questionSet[currentQuestionIndex];

    const correctMessages = [
        "Correct! You're on a roll! 🎯",
        "Correct! Amazing job! 🌟",
        "Correct! Keep it up! 🚀",
        "Correct! You're crushing it! 💪",
        "Correct! Nicely done! 👍",
        "Correct! Brilliant work! 🧠",
        "Correct! That was smooth! 😎"
    ];

    // Increment the total questions attempted (regardless of correctness)
    updateProfile(0, selectedTopic, false); // This will now only update profile without incrementing questions

    // Increment the total questions answered, no matter what
    let totalQuestions = parseInt(sessionStorage.getItem("totalQuestions")) || 0;
    totalQuestions += 1;
    sessionStorage.setItem("totalQuestions", totalQuestions); // Update the total in sessionStorage

    if (selectedChoice === questionData.answer) {
        // Update profile for correct answers (increment topic-specific counter and totalScore)
        updateProfile(1, selectedTopic, true); // This will increment topic-specific counter and totalScore

        // Pick a random success message
        const randomMsg = correctMessages[Math.floor(Math.random() * correctMessages.length)];
        document.getElementById("feedback").textContent = randomMsg;

        // Remove from previously attempted if it was there
        if (selectedTopic === 'complex') {
            complexPreviouslyAttempted = complexPreviouslyAttempted.filter(q => q.id !== questionData.id);
        } else if (selectedTopic === 'factoring') {
            factoringPreviouslyAttempted = factoringPreviouslyAttempted.filter(q => q.id !== questionData.id);
        } else if (selectedTopic === 'logarithms') {
            logarithmsPreviouslyAttempted = logarithmsPreviouslyAttempted.filter(q => q.id !== questionData.id);
        }
    } else {
        document.getElementById("feedback").textContent = `Incorrect! The correct answer was: ${questionData.answer}`;

        // Add to previously attempted if not already there
        if (selectedTopic === 'complex' && !complexPreviouslyAttempted.some(q => q.id === questionData.id)) {
            complexPreviouslyAttempted.push(questionData);
        } else if (selectedTopic === 'factoring' && !factoringPreviouslyAttempted.some(q => q.id === questionData.id)) {
            factoringPreviouslyAttempted.push(questionData);
        } else if (selectedTopic === 'logarithms' && !logarithmsPreviouslyAttempted.some(q => q.id === questionData.id)) {
            logarithmsPreviouslyAttempted.push(questionData);
        }
    }

    // Move to next question after a delay
    currentQuestionIndex++;
    setTimeout(displayQuestion, 2000); // Move to next question after a delay
}


function updateProfile(points, topic, isCorrect) {
    // Retrieve current session storage values or set defaults if not present
    let totalScore = parseInt(sessionStorage.getItem("totalScore")) || 0;
    let totalQuestions = parseInt(sessionStorage.getItem("totalQuestions")) || 0;

    let complexAnswered = parseInt(sessionStorage.getItem("complexAnswered")) || 0;
    let factoringAnswered = parseInt(sessionStorage.getItem("factoringAnswered")) || 0;
    let logarithmsAnswered = parseInt(sessionStorage.getItem("logarithmsAnswered")) || 0;

    // Increment the score if the answer was correct
    if (isCorrect) {
        totalScore += points;
    }

    // Increment the topic-specific counter ONLY if the answer was correct
    if (isCorrect) {
        if (topic === 'complex') {
            complexAnswered += 1;
        } else if (topic === 'factoring') {
            factoringAnswered += 1;
        } else if (topic === 'logarithms') {
            logarithmsAnswered += 1;
        }
    }

    // Save updated values to sessionStorage
    sessionStorage.setItem("totalScore", totalScore);
    sessionStorage.setItem("totalQuestions", totalQuestions); // Do not increment here
    sessionStorage.setItem("complexAnswered", complexAnswered);
    sessionStorage.setItem("factoringAnswered", factoringAnswered);
    sessionStorage.setItem("logarithmsAnswered", logarithmsAnswered);

    // Update the profile screen display with the updated values
    document.getElementById("profile-score").textContent = `${totalScore} 🏆`;
    document.getElementById("profile-questions").textContent = `${totalQuestions} 🔢`;
    document.getElementById("profile-complex-answered").textContent = `${complexAnswered} 🤔`;
    document.getElementById("profile-factoring-answered").textContent = `${factoringAnswered} ➗`;
    document.getElementById("profile-logarithms-answered").textContent = `${logarithmsAnswered} 📐`;
}




function endPractice() {
    document.getElementById("question-text").textContent = `Practice session complete!`;
    document.getElementById("choices-container").innerHTML = "";
    document.getElementById("feedback").textContent = "";

    // Update Profile Stats
    updateProfile(score, 5);
}





