document.getElementById('timerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const exerciseTime = parseInt(document.getElementById('exerciseTime').value);
    const restTime = parseInt(document.getElementById('restTime').value);
    const reps = parseInt(document.getElementById('reps').value);

    const outputStatus = document.getElementById('status');
    const outputTimer = document.getElementById('timer');
    const cancelBtn = document.getElementById('cancelBtn');
    const startBtn = document.querySelector('.start-btn');
    const muteCheckbox = document.getElementById('muteCheckbox');

    // Audio Elements
    const soundA = document.getElementById('soundA'); // Exercise ticking
    const soundB = document.getElementById('soundB'); // Transition to rest
    const soundC = document.getElementById('soundC'); // Rest ticking
    const soundD = document.getElementById('soundD'); // Transition to exercise

    let currentRep = 0;
    let isExercise = true;
    let timeLeft = exerciseTime;
    let timerInterval = null;
    let transitionTimeout = null; // To keep track of transition delays

    // Disable start button and enable cancel button
    startBtn.disabled = true;
    cancelBtn.disabled = false;

    function updateDisplay() {
        outputStatus.textContent = isExercise ? `Rep ${currentRep + 1}: Exercise` : `Rep ${currentRep + 1}: Rest`;
        outputTimer.textContent = formatTime(timeLeft);
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function playSound(sound) {
        if (muteCheckbox.checked) return;
        stopAllSounds(); // Ensure no other sound is playing
        sound.currentTime = 0;
        sound.play();
    }

    function stopSound(sound) {
        sound.pause();
        sound.currentTime = 0;
    }

    function stopAllSounds() {
        stopSound(soundA);
        stopSound(soundB);
        stopSound(soundC);
        stopSound(soundD);
    }

    function startTimer() {
        updateDisplay();

        if (isExercise) {
            playSound(soundA);
            playSound(soundB);// Play Exercise ticking sound
        } else {
            playSound(soundC);
            playSound(soundD);// Play Rest ticking sound
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
                    playSound(soundB);
                    // Play Transition to Rest
                    // Assuming soundB is around 1 second
                    transitionTimeout = setTimeout(() => {
                        isExercise = false;
                        currentRep++;
                        if (currentRep >= reps) {
                            finishWorkout();
                        } else {
                            timeLeft = restTime;
                            startTimer();
                        }
                    }, 1000); // Adjust this delay based on soundB's actual duration
                } else {
                    // Transition to Exercise
                    playSound(soundD); // Play Transition to Exercise
                    // Assuming soundD is around 1 second
                    transitionTimeout = setTimeout(() => {
                        isExercise = true;
                        timeLeft = exerciseTime;
                        startTimer();
                    }, 1000); // Adjust this delay based on soundD's actual duration
                }
            }
        }, 1000);
    }

    function finishWorkout() {
        outputStatus.textContent = '🎉 Workout Complete! 🎉';
        outputTimer.textContent = '--:--';
        playSound(soundB); // Optionally play a final transition sound
        resetButtons();
    }

    function resetWorkout() {
        clearInterval(timerInterval);
        clearTimeout(transitionTimeout);
        stopAllSounds();
        outputStatus.textContent = 'Workout canceled.';
        outputTimer.textContent = '--:--';
        resetButtons();
    }

    function resetButtons() {
        startBtn.disabled = false;
        cancelBtn.disabled = true;
    }

    cancelBtn.addEventListener('click', resetWorkout);

    // Mute/Unmute Sounds
    muteCheckbox.addEventListener('change', function() {
        const isMuted = this.checked;
        soundA.muted = isMuted;
        soundB.muted = isMuted;
        soundC.muted = isMuted;
        soundD.muted = isMuted;
    });

    // Initialize timer
    startTimer();
});
