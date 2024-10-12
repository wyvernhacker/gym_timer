document.getElementById('timerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Retrieve user inputs
    const exerciseTime = parseInt(document.getElementById('exerciseTime').value);
    const restTime = parseInt(document.getElementById('restTime').value);
    const reps = parseInt(document.getElementById('reps').value);

    // Output elements
    const outputStatus = document.getElementById('status');
    const outputTimer = document.getElementById('timer');
    const cancelBtn = document.getElementById('cancelBtn');
    const startBtn = document.querySelector('.start-btn');
    const muteCheckbox = document.getElementById('muteCheckbox');

    // Audio elements
    const soundA = document.getElementById('soundA'); // Exercise ticking
    const soundB = document.getElementById('soundB'); // Transition to rest
    const soundC = document.getElementById('soundC'); // Rest ticking
    const soundD = document.getElementById('soundD'); // Transition to exercise

    // Variables to track state
    let currentRep = 0;
    let isExercise = true; // Start with exercise
    let timeLeft = exerciseTime;
    let timerInterval = null;
    let transitionTimeout = null;

    // Variables to store sound durations (in milliseconds)
    let durationB = 1000; // Default 1 second
    let durationD = 1000; // Default 1 second

    // Disable start button and enable cancel button
    startBtn.disabled = true;
    cancelBtn.disabled = false;

    // Preload sounds and get their durations
    window.addEventListener('load', function() {
        soundB.addEventListener('loadedmetadata', function() {
            durationB = soundB.duration * 1000; // Convert to ms
        });
        soundD.addEventListener('loadedmetadata', function() {
            durationD = soundD.duration * 1000; // Convert to ms
        });
    });

    // Function to update the display
    function updateDisplay() {
        outputStatus.textContent = isExercise ? `Rep ${currentRep + 1}: Exercise` : `Rep ${currentRep + 1}: Rest`;
        outputTimer.textContent = formatTime(timeLeft);
    }

    // Function to format time in MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Function to play a specific sound
    function playSound(sound) {
        if (muteCheckbox.checked) return;
        stopAllSounds(); // Ensure no other sound is playing
        sound.currentTime = 0;
        const playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error(`Error playing sound: ${sound.id}`, error);
            });
        }
    }

    // Function to stop a specific sound
    function stopSound(sound) {
        sound.pause();
        sound.currentTime = 0;
    }

    // Function to stop all sounds
    function stopAllSounds() {
        stopSound(soundA);
        stopSound(soundB);
        stopSound(soundC);
        stopSound(soundD);
    }

    // Function to start the timer
    function startTimer() {
        updateDisplay();

        if (isExercise) {
            playSound(soundA); // Play Exercise ticking sound
        } else {
            playSound(soundC); // Play Rest ticking sound
        }

        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft >= 0) {
                outputTimer.textContent = formatTime(timeLeft);
            } else {
                clearInterval(timerInterval);
                stopAllSounds(); // Stop any ticking sounds

                if (isExercise) {
                    // Transition to Rest
                    playSound(soundB); // Play Transition to Rest
                    transitionTimeout = setTimeout(() => {
                        isExercise = false;
                        currentRep++;
                        if (currentRep >= reps) {
                            finishWorkout();
                        } else {
                            timeLeft = restTime;
                            startTimer();
                        }
                    }, durationB); // Delay based on soundB duration
                } else {
                    if (currentRep >= reps) {
                        // Last rep finished, end workout
                        playSound(soundC); // Play final Rest ticking sound
                        finishWorkout();
                    } else {
                        // Transition to Exercise
                        playSound(soundD); // Play Transition to Exercise
                        transitionTimeout = setTimeout(() => {
                            isExercise = true;
                            timeLeft = exerciseTime;
                            startTimer();
                        }, durationD); // Delay based on soundD duration
                    }
                }
            }
        }, 1000);
    }

    // Function to finish the workout
    function finishWorkout() {
        outputStatus.textContent = '🎉 Workout Complete! 🎉';
        outputTimer.textContent = '--:--';
        resetButtons();
    }

    // Function to reset the workout (called on cancel)
    function resetWorkout() {
        clearInterval(timerInterval);
        clearTimeout(transitionTimeout);
        stopAllSounds();
        outputStatus.textContent = 'Workout canceled.';
        outputTimer.textContent = '--:--';
        resetButtons();
    }

    // Function to reset button states
    function resetButtons() {
        startBtn.disabled = false;
        cancelBtn.disabled = true;
    }

    // Event listener for cancel button
    cancelBtn.addEventListener('click', resetWorkout);

    // Event listener for mute checkbox
    muteCheckbox.addEventListener('change', function() {
        const isMuted = this.checked;
        soundA.muted = isMuted;
        soundB.muted = isMuted;
        soundC.muted = isMuted;
        soundD.muted = isMuted;
    });

    // Initialize the timer
    startTimer();
});
