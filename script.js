// Load User Data from JSON
let users = [];
let complex = [];
let factoring = [];

const topics = [
    {
        "name": "Complex Numbers",
        "content": "Complex numbers consist of a real part and an imaginary part, written in the form a + bi, where i is the imaginary unit (√-1). They are essential in solving equations that have no real solutions, and they follow unique arithmetic rules for addition, subtraction, multiplication, and division."
    },
    {
        "name": "Factoring",
        "content": "Factoring is the process of breaking down an expression into its multiplicative components. Common methods include factoring out the greatest common factor (GCF), factoring trinomials, and using special factorization formulas such as the difference of squares."
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
        });
}

// Log to verify it's working
console.log("[DEBUG] Loaded hardcoded topics:", topics);


// Call the function to load users on page load
window.onload = function() {
    loadUsers();
    showLogin();
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

// Login Functionality
function login() {
    let username = document.getElementById('login-username').value.trim();
    let password = document.getElementById('login-password').value.trim();
    
    console.log("[DEBUG] Attempting to login with:", username, password);

    // Check if the user exists in the JSON data
    let user = users.find(u => u.username === username && u.password === password);

    if (user) {
        alert(`Login Successful! Welcome, ${user.username}`);
        showMainMenu();
    } else {
        alert("Invalid Credentials");
    }
}

// Signup Functionality (Basic, no JSON saving yet)
function signup() {
    let username = document.getElementById('signup-username').value.trim();
    let password = document.getElementById('signup-password').value.trim();

    if (username && password) {
        // Check if username already exists
        let existingUser = users.find(u => u.username === username);

        if (existingUser) {
            alert("Username already exists!");
        } else {
            // Add new user to the array (Temporary, won't persist)
            users.push({
                username: username,
                password: password,
                streak: 0,
                longest_streak: 0,
                score: 0,
                total_questions: 0,
                last_topic: null,
                badges: [],
                last_login: null,
                articles_read: []
            });

            alert("Account created successfully! You can now login.");
            showLogin();
        }
    } else {
        alert("Please enter both username and password.");
    }
}

function displayArticle(topic) {
    document.getElementById("article-title").textContent = topic.name;
    document.getElementById("article-content").textContent = topic.content;
    document.getElementById("article-display").classList.remove("hidden");
}

let currentQuestionIndex = 0;
let score = 0;
let questionSet = [];
let selectedTopic = '';
let complexPreviouslyAttempted = [];
let factoringPreviouslyAttempted = [];

async function startPractice() {
    hideAllScreens();
    document.getElementById('math-practice-screen').classList.add('active');

    if (complex.length === 0 && factoring.length === 0) {
        // Load questions only if both are empty
        await loadQuestions();
    }

    if (selectedTopic === 'complex') {
        prepareComplexQuestionSet();
        displayQuestion();
    } else if (selectedTopic === 'factoring') {
        prepareFactoringQuestionSet();
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
    } catch (error) {
        console.error("[ERROR] Error loading questions:", error);
    }
}

function selectTopic(topic) {
    selectedTopic = topic; // Store the selected topic (either 'complex' or 'factoring')
    startPractice(); // Start the practice with the selected topic
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
            (selectedTopic === 'factoring' && factoringPreviouslyAttempted.some(q => q.id === questionData.id))) {
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

    if (selectedChoice === questionData.answer) {
        score++;
        document.getElementById("feedback").textContent = "Correct!";
        
        // If the question was previously attempted, remove it from the array
        if (selectedTopic === 'complex') {
            complexPreviouslyAttempted = complexPreviouslyAttempted.filter(q => q.id !== questionData.id);
        } else if (selectedTopic === 'factoring') {
            factoringPreviouslyAttempted = factoringPreviouslyAttempted.filter(q => q.id !== questionData.id);
        }
    } else {
        document.getElementById("feedback").textContent = `Incorrect! The correct answer was: ${questionData.answer}`;
        
        // Add the question back to the previously attempted array if it was incorrect
        if (selectedTopic === 'complex' && !complexPreviouslyAttempted.some(q => q.id === questionData.id)) {
            complexPreviouslyAttempted.push(questionData);
        } else if (selectedTopic === 'factoring' && !factoringPreviouslyAttempted.some(q => q.id === questionData.id)) {
            factoringPreviouslyAttempted.push(questionData);
        }
    }

    currentQuestionIndex++;
    setTimeout(displayQuestion, 1500); // Move to next question after a delay
}


function updateProfile(sessionScore, questionsAnswered) {
    // Retrieve existing values or set defaults from sessionStorage
    let totalScore = parseInt(sessionStorage.getItem("totalScore")) || 0;
    let totalQuestions = parseInt(sessionStorage.getItem("totalQuestions")) || 0;
    let currentStreak = parseInt(sessionStorage.getItem("currentStreak")) || 0;
    let longestStreak = parseInt(sessionStorage.getItem("longestStreak")) || 0;

    // Update values
    totalScore += sessionScore;
    totalQuestions += questionsAnswered;

    // Streak Logic
    if (sessionScore > 0) {
        currentStreak++;
        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }
    } else {
        currentStreak = 0; // Reset streak if no correct answers
    }

    // Save to sessionStorage instead of localStorage
    sessionStorage.setItem("totalScore", totalScore);
    sessionStorage.setItem("totalQuestions", totalQuestions);
    sessionStorage.setItem("currentStreak", currentStreak);
    sessionStorage.setItem("longestStreak", longestStreak);

    // Update profile screen
    document.getElementById("profile-score").textContent = totalScore;
    document.getElementById("profile-questions").textContent = totalQuestions;
    document.getElementById("profile-streak").textContent = currentStreak;
    document.getElementById("profile-longest-streak").textContent = longestStreak;
}



function endPractice() {
    document.getElementById("question-text").textContent = `Practice session complete! Your score: ${score}/${5}`;
    document.getElementById("choices-container").innerHTML = "";
    document.getElementById("feedback").textContent = "";

    // Update Profile Stats
    updateProfile(score, 5);
}





