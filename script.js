const app_question = document.getElementById('question');
const app_options = document.querySelector('.quiz-options');
const app_checkBtn = document.getElementById('check-answer');
const app_playAgainBtn = document.getElementById('play-again');
const app_result = document.getElementById('result');
const app_correctScore = document.getElementById('correct-score');
const app_totalQuestion = document.getElementById('total-question');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;

// load question from API
async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(`${APIUrl}`)
    const data = await result.json();
    app_result.innerHTML = "";
    showQuestion(data.results[0]);
}

// event listeners
function eventListeners(){
    app_checkBtn.addEventListener('click', checkAnswer);
    app_playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    app_totalQuestion.textContent = totalQuestion;
    app_correctScore.textContent = correctScore;
});


// display question and options
function showQuestion(data){
    app_checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    // console.log(correctAnswer);

    
    app_question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
    app_options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}


// options selection
function selectOption(){
    app_options.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(app_options.querySelector('.selected')){
                const activeOption = app_options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// answer checking
function checkAnswer(){
    app_checkBtn.disabled = true;
    if(app_options.querySelector('.selected')){
        let selectedAnswer = app_options.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            correctScore++;
            app_result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            app_result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        app_result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        app_checkBtn.disabled = false;
    }
}

// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}


function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        setTimeout(function(){
            console.log("");
        }, 5000);


        app_result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        app_playAgainBtn.style.display = "block";
        app_checkBtn.style.display = "none";
    } else {
        setTimeout(function(){
            loadQuestion();
        }, 300);
    }
}

function setCount(){
    app_totalQuestion.textContent = totalQuestion;
    app_correctScore.textContent = correctScore;
}


function restartQuiz(){
    correctScore = askedCount = 0;
    app_playAgainBtn.style.display = "none";
    app_checkBtn.style.display = "block";
    app_checkBtn.disabled = false;
    setCount();
    loadQuestion();
}

let time = 10;
let quizTimeInMinutes = time * 60 * 60;
let quizTime = quizTimeInMinutes / 60;

let counting = document.getElementById("count-down");

function startCountdown(){
    let quizTimer = setInterval(function(){
    if(quizTime <= 0) {
        clearInterval(quizTimer);
        showScores();
    } else {
        quizTime--;
        let sec = Math.floor(quizTime % 60);
        let min = Math.floor(quizTime / 60) % 60;
        counting.innerHTML = `: ${min} : ${sec}`;   
    }
},1000);
}

startCountdown();
