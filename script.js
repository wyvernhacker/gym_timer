// Select form and timer display elements
const timerForm = document.getElementById('timerForm');
const timerDisplay = document.getElementById('timerDisplay');
const cancelButton = document.getElementById('cancelButton');

// Select sound elements
const soundExercise = new Audio('soundB.mp3');
const soundRest = new Audio('soundD.mp3');

let exerciseTime, restTime, reps, intervalId, currentRep;
let isExercising = true;

// Start the timer when the form is submitted
timerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get values from the form
    exerciseTime = parseInt(document.getElementById('exerciseTime').value, 10);
    restTime = parseInt(document.getElementById('restTime').value, 10);
    reps = parseInt(document.getElementById('reps').value, 10);
    currentRep = 1;

    startTimer(exerciseTime);
});

// Cancel the timer
cancelButton.addEventListener('click', () => {
    clearInterval(intervalId);
    timerDisplay.textContent = 'Timer canceled';
    soundExercise.pause();
    soundRest.pause();
    soundExercise.currentTime = 0;
    soundRest.currentTime = 0;
});

// Function to start the timer
function startTimer(time) {
    let countdown = time;

    if (isExercising) {
        soundExercise.play();
    } else {
        soundRest.play();
    }

    intervalId = setInterval(() => {
        countdown--;
        timerDisplay.textContent = `${isExercising ? 'Exercise' : 'Rest'}: ${countdown}s`;

        if (countdown <= 0) {
            clearInterval(intervalId);
            switchPhase();
        }
    }, 1000);
}

// Function to switch between exercise and rest
function switchPhase() {
    if (isExercising) {
        soundExercise.pause();
        soundExercise.currentTime = 0;
        isExercising = false;
        startTimer(restTime);
    } else {
        soundRest.pause();
        soundRest.currentTime = 0;
        if (currentRep < reps) {
            currentRep++;
            isExercising = true;
            startTimer(exerciseTime);
        } else {
            timerDisplay.textContent = 'Workout Complete!';
        }
    }
}
