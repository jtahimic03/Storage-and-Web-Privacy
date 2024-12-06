/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");

    // Initialize the game
    // checkUsername(); Uncomment once completed
    fetchQuestions();
    displayScores();
    checkUsername();

    /**
     * Fetches trivia questions from the API and displays them.
     */
    function fetchQuestions() {
        showLoading(true); // Show loading state

        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                displayQuestions(data.results);
                showLoading(false); // Hide loading state
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                showLoading(false); // Hide loading state on error
            });
    }

    /**
     * Toggles the display of the loading state and question container.
     *
     * @param {boolean} isLoading - Indicates whether the loading state should be shown.
     */
    function showLoading(isLoading) {
        document.getElementById("loading-container").classList = isLoading
            ? ""
            : "hidden";
        document.getElementById("question-container").classList = isLoading
            ? "hidden"
            : "";
    }

    /**
     * Displays fetched trivia questions.
     * @param {Object[]} questions - Array of trivia questions.
     */
    function displayQuestions(questions) {
        questionContainer.innerHTML = ""; // Clear existing questions
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(
                    question.correct_answer,
                    question.incorrect_answers,
                    index
                )}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }

    /**
     * Creates HTML for answer options.
     * @param {string} correctAnswer - The correct answer for the question.
     * @param {string[]} incorrectAnswers - Array of incorrect answers.
     * @param {number} questionIndex - The index of the current question.
     * @returns {string} HTML string of answer options.
     */
    function createAnswerOptions(
        correctAnswer,
        incorrectAnswers,
        questionIndex
    ) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
            () => Math.random() - 0.5
        );
        return allAnswers
            .map(
                (answer) => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${
                    answer === correctAnswer ? 'data-correct="true"' : ""
                }>
                ${answer}
            </label>
        `
            )
            .join("");
    }

    // Event listeners for form submission and new player button
    form.addEventListener("submit", handleFormSubmit);
    newPlayerButton.addEventListener("click", newPlayer);

    /**
     * Handles the trivia form submission.
     * @param {Event} event - The submit event.
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        //... form submission logic including setting cookies and calculating score
        //prevent default form submission

        //checks for existing username
        let username = getCookie("username");

        //saves a new username for 365 days
        if (username=== "") {
            username = prompt("Please enter your username:", "");
            if (username !== "" && username !== null) {
                setCookie("username", username, 365);
            }

        }

        const score = calculateScore();
        saveScore(username, score);

        //refresh the game
        displayScores();
        checkUsername();
        fetchQuestions();
        //... form submission logic including setting cookies and calculating score
    }
    function checkUsername() {
        //... code for checking if a username cookie is set and adjusting the UI
        const username = getCookie("username");
        if (username) {
            //  made it where the user is returning
            document.getElementById("username").style.display = "none"; // Hide username input
            document.getElementById("new-player").classList.remove("hidden"); // Show "New Player" button
        } else {
            //  made it where the user is a new user
            document.getElementById("username").style.display = "block"; // Show username input
            document.getElementById("new-player").classList.add("hidden"); // Hide "New Player" button
        }
    }
    function setCookie(name, value, days) {
        const date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/"
        }
    
    function getCookie(name) {
        let nameEQ = name + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let cookies = decodedCookie.split(';'); // Correct variable name
        for (let i = 0; i < cookies.length; i++) { // Use cookies here
            let c = cookies[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return "";
    }
    function saveScore(username, score) {
        //... code for saving the score to localStorage
        try {
            let scores = JSON.parse(localStorage.getItem("scores")) || [];
            scores.push({ username, score, date: new Date().toISOString() });
            localStorage.setItem("scores", JSON.stringify(scores));
            console.log("Score saved:", { username, score });
        } catch (error) {
            console.error("Error saving score:", error);
        }
    }
    
    function newPlayer() {
        //... code for clearing the username cookie and updating the UI
        setCookie("username", "", -1); // Clears the username cookie
        checkUsername(); // Reset UI for new session
        document.getElementById("score-table").innerHTML = ""; // Clear any existing scores displayed
        fetchQuestions(); // Fetch new trivia question
    }
    function calculateScore() {
    //... code for calculating the score
        let score = 0;
        const questionContainers = document.querySelectorAll("#question-container > div");

        questionContainers.forEach((questionContainer, index) => {
            const selectedAnswer = questionContainer.querySelector(
                `input[name="answer${index}"]:checked`
            );

            if (selectedAnswer) {
                const correctAnswer = selectedAnswer.dataset.correct === "true";
                if (correctAnswer) {
                    score++;
                }
            }
        });

        return score; // Return the calculated score
    }
    function displayScores() {
        //... code for displaying scores from localStorage
        const scoreTableBody = document.querySelector("#score-table tbody");
        scoreTableBody.innerHTML = ""; // Clear existing scores
    
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        scores.forEach(scoreData => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${scoreData.username}</td><td>${scoreData.score}</td>`;
            scoreTableBody.appendChild(row);
        });
    }
});