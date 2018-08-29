var questions = [];
var response = NaN;
var queryURL = "https://opentdb.com/api.php?amount=20";
var divs;
var questionObj;
var clock;
var clockSecs;
var isActive = false;
var wrongScore = 0;
var rightScore = 0;

var clockTick = function () {
	if (clockSecs > 0) {
		clockSecs--;
		divs.timeRemaining.html("Time Remaining: " + clockSecs);
	} else {
		clearInterval(clock);
		clockSecs = 0;
		divs.timeRemaining.html("Time Remaining: " + clockSecs);
		timedOut();
	}
};

var reset = function () {
	isActive = false;
	clearInterval(clock);
	clockSecs = 0;
	divs.timeRemaining.empty();
	divs.question.empty();
	divs.answers.empty();
}
 
var loadQuestions = function () {
	$.ajax({
		url: queryURL,
		method: "GET",
	}).done(function(response) {
		questions = response.results;
		nextQuestion();
	});
};

var timedOut = function () {
	clearInterval(clock);
	isActive = false;
	divs.timeRemaining.html("Out of time!");
	divs.answers.html("Correct answer: " + questionObj.correct_answer);
	wrongScore++;
	divs.wrongScore.html("Wrong: " + wrongScore);
	let messageTimerId = setTimeout(function () {
		nextQuestion();
	}, 5 * 1000);
};

var wrongAnswer = function () {
	clearInterval(clock);
	isActive = false;
	divs.timeRemaining.html("Wrong answer.");
	divs.answers.html("Correct answer: " + questionObj.correct_answer);
	wrongScore++;
	divs.wrongScore.html("Wrong: " + wrongScore);
	let messageTimerId = setTimeout(function () {
		nextQuestion();
	}, 5 * 1000);
};

var rightAnswer = function () {
	clearInterval(clock);
	isActive = false;
	divs.timeRemaining.html("Right answer!!");
	rightScore++;
	divs.rightScore.html("Right: " + rightScore);
	let messageTimerId = setTimeout(function () {
		nextQuestion();
	}, 5 * 1000);
};

var checkAnswer = function (event) {
	$(event.target).addClass('selectedAnswer');
	if (isActive) {
		isActive = false;
		if (questionObj.correct_answer === $(event.target).html()) {
			rightAnswer();
		} else {
			wrongAnswer();
		};	
	}
};

var nextQuestion = function () {
	reset();
	if (questions.length > 0) {

		divs.answers.empty();
		divs.question.empty();

		questionObj = questions.pop();
		let allAnswers = questionObj.incorrect_answers;
		let rightAnswer = questionObj.correct_answer; 
		allAnswers.splice(Math.floor(Math.random() * allAnswers.length), 0, rightAnswer);

		for (let i = 0; i < allAnswers.length; i++) {
			let newAnswer = $('<div>');
			newAnswer.html(allAnswers[i]);
			newAnswer.addClass('answer');
			divs.answers.append(newAnswer);
		};

		divs.question.html(questionObj.question);

		isActive = true;
		clockSecs = 20;
		divs.timeRemaining.html("Time Remaining: " + clockSecs);
		clock = setInterval(clockTick, 1000);

	} else {
		loadQuestions();
	}
};

var initGame = function () {
	divs = {
		wrongScore: $("#wrongScore"),
		rightScore: $("#rightScore"),
		timeRemaining: $("#timeRemaining"),
		question: $("#question"),
		answers: $("#answers")
	};

	divs.wrongScore.html("Wrong: " + wrongScore);
	divs.rightScore.html("Right: " + rightScore);

	divs.answers.on('click', '.answer', checkAnswer);

	nextQuestion();
};

$(document).ready(function() {
	initGame();
});