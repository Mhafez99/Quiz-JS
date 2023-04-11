// Select Elements
let countSpan = document.querySelector('.quiz-app .count span');
let bulletsContainer = document.querySelector('.quiz-app .bullets');
let bullets = document.querySelector('.quiz-app .bullets .spans');
let quizArea = document.querySelector('.quiz-app .quiz-area');
let answerArea = document.querySelector('.quiz-app .answer-area');
let submit = document.querySelector(".quiz-app .submit-button");
let resultsContainer = document.querySelector(".quiz-app .results");
let countdownContainer = document.querySelector('.quiz-app .countdown');

// Set Options
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;

// Fetch Questions
function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function() {
        // status is response status code
        if (this.status === 200 && this.readyState === 4) {
            let questionsObj = JSON.parse(this.responseText);
            let qCount = questionsObj.length;

            // Create Bullets 
            createBullets(qCount);

            // Add Question Data
            addQuestionData(questionsObj[currentIndex], qCount);

            // CountDown Function To Handle First Question
            countdown(30, qCount);

            // When Click On Submit
            submit.onclick = () => {
                // Get The Right Answer
                theRightAnswer = questionsObj[currentIndex].right_answer;
                // Increate The Current To Next Answer
                currentIndex++;
                // Check Function 
                checkAnswer(theRightAnswer);
                // Remove Pervious Question
                quizArea.innerHTML = '';
                answerArea.innerHTML = '';
                // Add Question Data
                addQuestionData(questionsObj[currentIndex], qCount);
                // Handle Bullets Classes
                handleBullets();

                // CountDown Function
                clearInterval(countdownInterval);
                countdown(30, qCount);

                // Show Results
                showResults(qCount);
            };
        }
    };
    myRequest.open('GET', 'html_questions.json', true);
    myRequest.send();
}
getQuestions();

// Create Bullets
function createBullets(num) {
    countSpan.innerHTML = num;
    for (let i = 0; i < num; i++) {
        let theBullet = document.createElement('span');
        if (i === 0) {
            theBullet.classList.add('on');
        }
        bullets.appendChild(theBullet);
    }
}

// Add Questions Data 
function addQuestionData(obj, count) {
    if (currentIndex < count) {
        // Create Question 
        let questionTitle = document.createElement('h2');
        questionTitle.appendChild(document.createTextNode(obj.title));
        quizArea.appendChild(questionTitle);

        // Create Answers
        for (let i = 1; i <= 4; i++) {
            let divAnswer = document.createElement('div');
            divAnswer.classList.add('answer');

            // Add Radio Input
            let radioInput = document.createElement('input');

            // Add Type + Name + Id + Data Attribute
            radioInput.setAttribute("type", "radio");
            radioInput.setAttribute("name", "question");
            radioInput.setAttribute("id", `answer_${i}`);
            radioInput.setAttribute("data-answer", obj[`answer_${i}`]);

            if (i === 1) {
                radioInput.checked = true;
            }

            divAnswer.appendChild(radioInput);

            // Add Label
            let label = document.createElement('label');

            // Set for Attribute
            label.setAttribute('for', `answer_${i}`);
            label.appendChild(document.createTextNode(obj[`answer_${i}`]));

            divAnswer.appendChild(label);

            answerArea.appendChild(divAnswer);

        }
    }
}

// Checked Answer
function checkAnswer(theRightAnswer) {
    let answers = document.getElementsByName('question');
    let theChoosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (theRightAnswer === theChoosenAnswer) {
        rightAnswer++;
    }
}

// Handle Bullets
function handleBullets() {
    let bulletsSpan = document.querySelectorAll('.bullets .spans span');
    let arrayOfSpans = Array.from(bulletsSpan);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.classList.add('on');
        }
    });
}

// Show Results 
function showResults(count) {
    let results;
    if (currentIndex == count) {
        quizArea.remove();
        answerArea.remove();
        submit.remove();
        bulletsContainer.remove();

        if (rightAnswer > (count / 2) && rightAnswer < count) {
            results = `<span class="good">Good</span> You Ansewered ${rightAnswer} From ${count}`;
        } else if (rightAnswer == count) {
            results = `<span class="perfect">Perfect</span> All Answer Is Good`;
        } else {
            results = `<span class="bad">Bad</span> You Ansewered ${rightAnswer} From ${count}`;
        }
        resultsContainer.innerHTML = results;
    }

}

// Countdown Function
function countdown(duration, count) {
    if (currentIndex < count) {
        let minute, seconds;
        countdownInterval = setInterval(() => {
            minute = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minute = minute < 10 ? `0${minute}` : minute;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownContainer.innerHTML = `${minute}:${seconds}`;
            if (--duration < 0) {
                clearInterval(countdownInterval);
                submit.click();
            }
        }, 1000);
    }
}