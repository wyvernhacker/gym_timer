// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Select form and control elements
    const timerForm = document.getElementById('timerForm');
    const exerciseInput = document.getElementById('exerciseTime');
    const restInput = document.getElementById('restTime');
    const repsInput = document.getElementById('reps');
    const startButton = document.querySelector('.start-btn');
    const cancelButton = document.getElementById('cancelBtn');
    const statusDisplay = document.getElementById('status');
    const timerDisplay = document.getElementById('timer');
    const muteCheckbox = document.getElementById('muteCheckbox');

    // Initialize Audio Objects
    const soundB = new Audio('sounds/soundB.mp3'); // Exercise sound
    const soundD = new Audio('sounds/soundD.mp3'); // Rest sound

    // Set audio to loop if necessary (optional based on sound design)
    // soundB.loop = true;
    // soundD.loop = true;

    // Variables to manage timer and reps
    let exerciseTime = 0;
    let restTime = 0;
    let totalReps = 0;
    let currentRep = 0;
    let isExercising = true;
    let timerInterval = null;
    let transitionTimeout = null;

    // Function to format time in mm:ss
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Function to play a specific sound
    function playSound(sound) {
        if (muteCheckbox.checked) return;
        sound.currentTime = 0; // Reset sound to start
        sound.play().catch(error => {
            console.error(`Error playing sound: ${sound.src}`, error);
        });
    }

    // Function to stop a specific sound
    function stopSound(sound) {
        sound.pause();
        sound.currentTime = 0;
    }

    // Function to stop all sounds
    function stopAllSounds() {
        stopSound(soundB);
        stopSound(soundD);
    }

    // Function to start the timer
    function startTimer(duration, phase) {
        let timeLeft = duration;
        statusDisplay.textContent = isExercising ? `Rep ${currentRep + 1}: Exercise` : `Rep ${currentRep + 1}: Rest`;
        timerDisplay.textContent = formatTime(timeLeft);

        // Play the appropriate sound based on phase
        if (phase === 'exercise') {
            playSound(soundB);
        } else if (phase === 'rest') {
            playSound(soundD);
        }

        // Start the countdown
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                stopAllSounds(); // Stop any playing sounds

                // Transition to the next phase or complete the workout
                if (isExercising) {
                    // Transition from Exercise to Rest
                    isExercising = false;
                    currentRep++;

                    if (currentRep >= totalReps) {
                        // Workout Complete
                        statusDisplay.textContent = '🎉 Workout Complete! 🎉';
                        timerDisplay.textContent = '--:--';
                        playSound(soundD); // Optionally play a final sound
                        resetControls();
                    } else {
                        // Start Rest Phase after a short delay to allow sound to play
                        transitionTimeout = setTimeout(() => {
                            startTimer(restTime, 'rest');
                        }, 1000); // 1-second delay; adjust based on sound length
                    }
                } else {
                    // Transition from Rest to Exercise
                    isExercising = true;

                    // Start Exercise Phase after a short delay to allow sound to play
                    transitionTimeout = setTimeout(() => {
                        startTimer(exerciseTime, 'exercise');
                    }, 1000); // 1-second delay; adjust based on sound length
                }
            }
        }, 1000);
    }

    // Function to reset controls to initial state
    function resetControls() {
        startButton.disabled = false;
        cancelButton.disabled = true;
    }

    // Event listener for form submission to start the workout
    timerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve and validate input values
        exerciseTime = parseInt(exerciseInput.value, 10);
        restTime = parseInt(restInput.value, 10);
        totalReps = parseInt(repsInput.value, 10);

        if (isNaN(exerciseTime) || isNaN(restTime) || isNaN(totalReps) ||
            exerciseTime <= 0 || restTime <= 0 || totalReps <= 0) {
            alert('Please enter valid positive numbers for all fields.');
            return;
        }

        // Initialize workout variables
        currentRep = 0;
        isExercising = true;

        // Disable start button and enable cancel button
        startButton.disabled = true;
        cancelButton.disabled = false;

        // Start the Exercise Phase
        startTimer(exerciseTime, 'exercise');
    });

    // Event listener for cancel button to stop the workout
    cancelButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        clearTimeout(transitionTimeout);
        stopAllSounds();
        statusDisplay.textContent = '🏁 Workout Canceled 🏁';
        timerDisplay.textContent = '--:--';
        resetControls();
    });

    // Event listener for mute checkbox to toggle sound
    muteCheckbox.addEventListener('change', () => {
        if (muteCheckbox.checked) {
            stopAllSounds();
        }
    });
});
