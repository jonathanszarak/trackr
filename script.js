document.addEventListener('DOMContentLoaded', () => {
    const streakCountElement = document.getElementById('streak-count');
    const workoutCompleteButton = document.getElementById('workout-complete');
    const addGoalButton = document.getElementById('add-goal');
    const goalsList = document.getElementById('goals-list');

    let streak = parseInt(localStorage.getItem('streak')) || 0;
    let lastWorkoutDate = localStorage.getItem('lastWorkoutDate');
    let goals = JSON.parse(localStorage.getItem('goals')) || [];

    // Function to update streak display
    const updateStreak = () => {
        streakCountElement.textContent = streak;
        localStorage.setItem('streak', streak);
    };

    // Function to render goals
    const renderGoals = () => {
        goalsList.innerHTML = '';
        goals.forEach((goal, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <input type="checkbox" class="goal-checkbox" data-index="${index}" ${goal.completed ? 'checked' : ''}>
                ${goal.text}
                <div class="goal-actions">
                    <button class="edit" data-index="${index}">Edit</button>
                    <button class="remove" data-index="${index}">Remove</button>
                </div>
            `;
            goalsList.appendChild(listItem);
        });
        localStorage.setItem('goals', JSON.stringify(goals));
    };

    // Function to reset checkboxes
    const resetCheckboxes = () => {
        goals.forEach(goal => goal.completed = false);
        renderGoals();
    };

    // Event listener for workout complete button
    workoutCompleteButton.addEventListener('click', () => {
        if (new Date().toDateString() !== lastWorkoutDate) {
            streak++;
            lastWorkoutDate = new Date().toDateString();
            localStorage.setItem('lastWorkoutDate', lastWorkoutDate);
            updateStreak();
            resetCheckboxes();
            workoutCompleteButton.disabled = true;
        }
    });

    // Disable the button if already pressed today
    if (new Date().toDateString() === lastWorkoutDate) {
        workoutCompleteButton.disabled = true;
    }

    // Midnight reset for workout button
    const resetStreakAtMidnight = () => {
        const now = new Date();
        const millisUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;

        setTimeout(() => {
            workoutCompleteButton.disabled = false;
            resetStreakAtMidnight();
        }, millisUntilMidnight);
    };

    resetStreakAtMidnight();

    // Function to add a new goal
    addGoalButton.addEventListener('click', () => {
        const newGoalText = prompt("Enter your new goal:");
        if (newGoalText) {
            goals.push({ text: newGoalText, completed: false });
            renderGoals();
        }
    });

    // Event delegation for edit and remove buttons
    goalsList.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains('remove')) {
            goals.splice(index, 1);
            renderGoals();
        } else if (e.target.classList.contains('edit')) {
            const newGoalText = prompt("Edit your goal:", goals[index].text);
            if (newGoalText) {
                goals[index].text = newGoalText;
                renderGoals();
            }
        }
    });

    // Event delegation for checkboxes
    goalsList.addEventListener('change', (e) => {
        if (e.target.classList.contains('goal-checkbox')) {
            const index = e.target.dataset.index;
            goals[index].completed = e.target.checked;
            localStorage.setItem('goals', JSON.stringify(goals));
        }
    });

    // Initialize streak and goals display
    updateStreak();
    renderGoals();
});

// Event listener for reset streak button
const resetStreakButton = document.getElementById('reset-streak');

resetStreakButton.addEventListener('click', () => {
    streak = 0;
    localStorage.setItem('streak', streak);
    localStorage.removeItem('lastWorkoutDate');
    updateStreak();
    workoutCompleteButton.disabled = false; // Re-enable the Workout Completed button
    location.reload(); // Automatically refresh the page
});
