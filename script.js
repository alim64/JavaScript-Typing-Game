// List of 200 most common English words from list found online at https://gist.github.com/deekayen/4148741
const words = ["the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "he", "was", "for", "on", "are", "with", "as", "I", "his", "they", "be", "at", "one", "have", "this", "from", "or", "had", "by", "not", "word", "but", "what", "some", "we", "can", "out", "other", "were", "all", "there", "when", "up", "use", "your", "how", "said", "an", "each", "she", "which", "do", "their", "time", "if", "will", "way", "about", "many", "then", "them", "write", "would", "like", "so", "these", "her", "long", "make", "thing", "see", "him", "two", "has", "look", "more", "day", "could", "go", "come", "did", "number", "sound", "no", "most", "people", "my", "over", "know", "water", "than", "call", "first", "who", "may", "down", "side", "been", "now", "find", "any", "new", "work", "part", "take", "get", "place", "made", "live", "where", "after", "back", "little", "only", "round", "man", "year", "came", "show", "every", "good", "me", "give", "our", "under", "name", "very", "through", "just", "form", "sentence", "great", "think", "say", "help", "low", "line", "differ", "turn", "cause", "much", "mean", "before", "move", "right", "boy", "old", "too", "same", "tell", "does", "set", "three", "want", "air", "well", "also", "play", "small", "end", "put", "home", "read", "hand", "port", "large", "spell", "add", "even", "land", "here", "must", "big", "high", "such", "follow", "act", "why", "ask", "men", "change", "went", "light", "kind", "off", "need", "house", "picture", "try", "us", "again", "animal", "point", "mother", "world", "near", "build", "self", "earth", "father"];

const wordDisplay = document.getElementById("svg-container");
const userInput = document.getElementById("user-input");
const scoreDisplay = document.getElementById("score-display");
const timerDisplay = document.getElementById("timer-display");
const wpmDisplay = document.getElementById("wpm-display");

let score = 0;
let startTime;
let timerInterval;
let wordsTyped = 0;
let wordTexts; // Variable to store SVG text elements
let rects; // Variable to store SVG rectangles


function resetGame() {
    clearInterval(timerInterval); // Stop the timer if running
    userInput.disabled = false; // Enable input
    score = 0; // Reset score
    wordsTyped = 0; // Reset words typed
    startTime = null; // Reset start time
    finalWPM = null; // Reset final WPM
    timerDisplay.textContent = gameDurationInSeconds; // Reset timer display
    scoreDisplay.textContent = score; // Reset score display
    wpmDisplay.textContent = ""; // Clear WPM display
    displayRandomWordInSVG(); // Display a new random word
}



// Function to update the timer display
function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    const remainingSeconds = Math.max(gameDurationInSeconds - Math.floor(elapsedTime / 1000), 0);
    timerDisplay.textContent = remainingSeconds;
    
    if (remainingSeconds === 0) {
        endGame();
    }
}

// Function to start the timer and countdown
function startTimer() {
    startTime = Date.now();
    updateTimer(); // Update timer immediately
    timerInterval = setInterval(updateTimer, 1000); // Update timer every second
}

let finalWPM;
const gameDurationInSeconds = 30;

// Function to end the game
function endGame() {
    userInput.disabled = true; // Disable input
    finalWPM = calculateWPM(); // Calculate the final WPM value
    displayFinalWPM(); // Display the final WPM
    displayWPMAnimation(finalWPM); // Display the WPM animation
}

// Function to display the WPM animation
function displayWPMAnimation(wpm) {
    // Create a new SVG text element for the WPM
    const wpmText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    wpmText.textContent = "WPM: " + wpm.toFixed(2); // Set the text content
    wpmText.setAttribute("x", "50%"); // Set the X position
    wpmText.setAttribute("y", "80%"); // Set the Y position
    wpmText.setAttribute("text-anchor", "middle"); // Center horizontally
    wpmText.setAttribute("dominant-baseline", "middle"); // Center vertically
    wpmText.setAttribute("font-size", "16"); // Set font size
    wpmText.setAttribute("fill", "black"); // Set text color
    wpmText.setAttribute("opacity", "0"); // Initially hide the text

    // Append the text element to the SVG container
    wordDisplay.appendChild(wpmText);

    // Animate the appearance of the WPM text
    wpmText.animate([
        { opacity: 0, transform: "translateY(50px)" }, // Initial state (hidden below)
        { opacity: 1, transform: "translateY(0)" }     // Final state (visible)
    ], {
        duration: 1000, // Animation duration in milliseconds
        easing: "ease", // Easing function (e.g., "linear", "ease-in", "ease-out", "ease-in-out")
        fill: "forwards" // Keep the final state of the animation
    });  
}


// Function to calculate words per minute (WPM)
function calculateWPM() {
    return (wordsTyped / gameDurationInSeconds) * 60;
}

// Function to display the final WPM
function displayFinalWPM() {
    wpmDisplay.textContent = finalWPM.toFixed(2); // Display the final WPM
}



// Variable to store the state of the colour scheme
let colourSchemeApplied = false;

// Function to toggle colour scheme of SVG letters
function toggleColourScheme() {
    colourSchemeApplied = !colourSchemeApplied; // Toggle the state of the colour scheme by taking the opposite of what it currently is
    wordTexts = document.querySelectorAll('text');
    body = document.body;
    // Apply or remove the CSS class based on the state of the colour scheme
    if (colourSchemeApplied) {
        body.classList.add('alternate-colour-scheme'); // Apply colour scheme to the whole webpage
        wordTexts.forEach((text) => {
            text.classList.add('alternate-colour-scheme'); // Apply colour scheme to SVG letters
        });
    } else {
        body.classList.remove('alternate-colour-scheme'); // Remove colour scheme from the whole webpage
        wordTexts.forEach((text) => {
            text.classList.remove('alternate-colour-scheme'); // Remove colour scheme from SVG letters
        });
    }
}

// Event listener for the colour scheme button
document.getElementById("toggle-colour-btn").addEventListener("click", function() {
    toggleColourScheme();
});

// Display initial random word and set up game
displayRandomWordInSVG();


// Function to display a random word as SVG blocks
function displayRandomWordInSVG() {
    wordDisplay.innerHTML = ''; // Clear previous content

    // Randomly select a word from the words array
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex];

    const blockWidth = 40;
    const blockHeight = 40;
    const blockSpacing = 10;
    const startX = (wordDisplay.clientWidth - (blockWidth + blockSpacing) * word.length) / 2;
    const startY = 50; // Adjust vertical position for each word


    wordTexts = []; // Initialize wordTexts as an empty array
    rects = []; // Initialize rects as an empty array

    for (let j = 0; j < word.length; j++) {
        const letter = word[j];
        const x = startX + j * (blockWidth + blockSpacing);
        const y = startY;

        // Create SVG rectangle for the current letter block
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", blockWidth);
        rect.setAttribute("height", blockHeight);
        rect.setAttribute("fill", "lightblue"); // Colour
        rect.setAttribute("stroke", "black"); // Border colour
        rect.setAttribute("stroke-width", "2"); // Border width

        // Add the letter as text inside the rectangle
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x + blockWidth / 2);
        text.setAttribute("y", y + blockHeight / 2);
        text.setAttribute("text-anchor", "middle"); // Center text horizontally
        text.setAttribute("dominant-baseline", "middle"); // Center text vertically
        text.setAttribute("fill", "black"); // Text colour
        text.textContent = letter.toUpperCase(); // Convert letter to uppercase

        // Apply the colour scheme if it's toggled on
        if (colourSchemeApplied){
            text.classList.add('alternate-colour-scheme');
        }

        // Append the rectangle and text to the SVG container
        wordDisplay.appendChild(rect);
        wordDisplay.appendChild(text);

        // Push SVG text and rectangle elements to respective arrays
        wordTexts.push(text);
        rects.push(rect);
    }

    // Clear the input field
    userInput.value = "";
}

// Add event listener to check the typed word
userInput.addEventListener("input", function onInput() {
    const typedWord = userInput.value.trim().toLowerCase();

    let wordText = ""; // Initialize an empty string to store the displayed word

    // Iterate over each SVG text element and concatenate their text content
    for (const textElement of wordTexts) {
        wordText += textElement.textContent; // Concatenate text content to the wordText string
    }

    wordText = wordText.toLowerCase(); // Convert the string to lowercase for consistency

    const wordRects = rects; // Assign the rects array to wordRects

    let allLettersCorrect = true; // Assume all letters are correct initially

    for (let i = 0; i < typedWord.length; i++) {
        const typedLetter = typedWord[i];
        const correctLetter = wordText[i];
        const rect = wordRects[i];

        // Change the colour of the rectangle based on correctness of the typed letter
        if (typedLetter === correctLetter) {
            rect.setAttribute("fill", "lightgreen"); // Green for correct letter
        } else {
            rect.setAttribute("fill", "tomato"); // Red for incorrect letter
            allLettersCorrect = false;
        }
    }

    // If all letters are correct, update the score and display a new word
    if (allLettersCorrect && typedWord.length === wordText.length) {
        score++;
        scoreDisplay.textContent = score;
        wordsTyped++;
        displayRandomWordInSVG();
        userInput.value = ""; // Clear the input field
        userInput.focus(); // Refocus on the input field
    }
});


// Start the game when the user starts typing or clicks on the input field
userInput.addEventListener("focus", startTimer);
userInput.addEventListener("click", startTimer);


