document.addEventListener('DOMContentLoaded', () => {
    const streakCountElement = document.getElementById('streak-count');
    const workoutCompleteButton = document.getElementById('workout-complete');
    const addGoalButton = document.getElementById('add-goal');
    const goalsList = document.getElementById('goals-list');
    const getRemindedCheckbox = document.getElementById('get-reminded');
    const emailInput = document.getElementById('email-address');
    const timerDisplay = document.getElementById('timer-display');
    const testModeCheckbox = document.getElementById('test-mode');

    let streak = parseInt(localStorage.getItem('streak')) || 0;
    let lastWorkoutDate = localStorage.getItem('lastWorkoutDate');
    let goals = JSON.parse(localStorage.getItem('goals')) || [];
    let buttonDisabled = localStorage.getItem('buttonDisabled') === 'true';
    let countdownSeconds;
    let timerInterval;

    // Function to update streak display
    const updateStreak = () => {
        streakCountElement.textContent = streak;
        localStorage.setItem('streak', streak);
    };

    // Function to render goals
    const renderGoals = () => {
        goalsList.innerHTML = '';

        goals.forEach((goal, index) => {
            const li = document.createElement('li');
            li.classList.add('goal-item');
            li.innerHTML = `
                <input type="checkbox" class="goal-checkbox" data-index="${index}" ${goal.completed ? 'checked' : ''}>
                <span class="goal-text">${goal.text}</span>
                <span class="goal-actions">
                    <button class="edit" data-index="${index}">Edit</button>
                    <button class="delete" data-index="${index}">Delete</button>
                </span>
            `;
            goalsList.appendChild(li);
        });

        checkCompleteButtonState();
    };

    // Function to check if all goals are completed and enable/disable workoutCompleteButton accordingly
    const checkCompleteButtonState = () => {
        const allGoalsCompleted = goals.length > 0 && goals.every(goal => goal.completed);
        workoutCompleteButton.disabled = !allGoalsCompleted;
    };

    // Load goals from localStorage
    renderGoals();

    // Check if the last workout date is today
    const isToday = (date) => {
        const today = new Date().toISOString().split('T')[0];
        return date === today;
    };

    // Update streak display on page load
    updateStreak();

    // Function to update timer display
    const updateTimerDisplay = () => {
        if (timerDisplay) {
            const hoursLeft = Math.floor(countdownSeconds / 3600);
            const minutesLeft = Math.floor((countdownSeconds % 3600) / 60);
            const secondsLeft = countdownSeconds % 60;
            timerDisplay.textContent = `${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
        }
    };

    // Calculate remaining time until midnight
    const calculateCountdownSeconds = () => {
        const now = new Date();
        const nextReset = new Date();
        nextReset.setHours(24, 0, 0, 0); // Midnight of the next day
        return Math.floor((nextReset - now) / 1000);
    };

    // Countdown Timer Functionality
    const countdown = () => {
        if (countdownSeconds <= 0) {
            clearInterval(timerInterval); // Stop the timer
            workoutCompleteButton.disabled = false; // Re-enable the button
            localStorage.setItem('buttonDisabled', 'false');
            countdownSeconds = testModeCheckbox.checked ? 10 : calculateCountdownSeconds(); // Reset countdown
            localStorage.setItem('countdownSeconds', countdownSeconds);
        }
        countdownSeconds--;
        updateTimerDisplay();
    };

    // Start countdown
    const startCountdown = () => {
        clearInterval(timerInterval);
        countdownSeconds = calculateCountdownSeconds();
        updateTimerDisplay();
        timerInterval = setInterval(countdown, 1000);
    };

    // Initial setup
    updateTimerDisplay();
    startCountdown();

    // Disable workout complete button if not in test mode and not allowed
    workoutCompleteButton.disabled = buttonDisabled || !goals.length;

    // Add event listener for workout complete button
    workoutCompleteButton.addEventListener('click', () => {
        if (!workoutCompleteButton.disabled) {
            streak++;
            updateStreak();
            localStorage.setItem('lastWorkoutDate', new Date().toISOString().split('T')[0]);
            workoutCompleteButton.disabled = true; // Disable button until next cycle
            localStorage.setItem('buttonDisabled', 'true');

            // Reset all goals
            goals.forEach((goal) => {
                goal.completed = false;
            });
            localStorage.setItem('goals', JSON.stringify(goals));
            renderGoals();

            // Restart the countdown
            countdownSeconds = testModeCheckbox.checked ? 10 : calculateCountdownSeconds(); // Set countdown based on test mode
            localStorage.setItem('countdownSeconds', countdownSeconds);
            startCountdown();
        }
    });

    // Add event listener for add goal button
    addGoalButton.addEventListener('click', () => {
        const goalText = prompt('Enter your goal:');
        if (goalText) {
            goals.push({ text: goalText, completed: false });
            localStorage.setItem('goals', JSON.stringify(goals));
            renderGoals();
            checkCompleteButtonState(); // Re-check button state after adding a goal
        }
    });

    // Add event listener for goals list (delegation)
    goalsList.addEventListener('click', (e) => {
        const target = e.target;
        const index = target.getAttribute('data-index');

        if (target.classList.contains('goal-checkbox')) {
            goals[index].completed = target.checked;
            localStorage.setItem('goals', JSON.stringify(goals));
            checkCompleteButtonState(); // Re-check button state after goal status changes
        }

        if (target.classList.contains('edit')) {
            const newGoalText = prompt('Edit your goal:', goals[index].text);
            if (newGoalText !== null) {
                goals[index].text = newGoalText;
                localStorage.setItem('goals', JSON.stringify(goals));
                renderGoals();
            }
        }

        if (target.classList.contains('delete')) {
            goals.splice(index, 1);
            localStorage.setItem('goals', JSON.stringify(goals));
            renderGoals();
            checkCompleteButtonState(); // Re-check button state after deleting a goal
        }
    });

    // Reminder section handling
    getRemindedCheckbox.addEventListener('change', () => {
        if (getRemindedCheckbox.checked) {
            emailInput.disabled = false;
        } else {
            emailInput.disabled = true;
            emailInput.value = '';
        }
    });
});
