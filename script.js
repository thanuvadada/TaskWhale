// Navigation: Show the selected section and hide others
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// To-Do List Functions
function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskList = document.getElementById("taskList");
    if (taskInput.value.trim() !== "") {
        let li = document.createElement("li");
        // Use a div with class task-container to align checkbox and text
        li.innerHTML = `
            <div class="task-container">
                <input type="checkbox" class="checkbox" onchange="toggleTask(this)">
                <span class="task-text">${taskInput.value}</span>
            </div>
            <span class="delete-icon" onclick="deleteTask(this)">❌</span>
        `;
        taskList.appendChild(li);
        taskInput.value = "";
    }
}

function toggleTask(checkbox) {
    const taskText = checkbox.nextElementSibling;
    taskText.classList.toggle("completed");
    checkAllTasksCompleted();
}

function deleteTask(element) {
    element.parentElement.remove();
    checkAllTasksCompleted();
}

function resetTasks() {
    document.getElementById("taskList").innerHTML = "";
}

function checkAllTasksCompleted() {
    const tasks = document.querySelectorAll("#taskList li .checkbox");
    if (tasks.length > 0 && Array.from(tasks).every(task => task.checked)) {
        alert("Well done! All tasks completed!");
    }
}

// Water Tracker Functions
function resetWater() {
    document.getElementById("waterGlasses").innerHTML = "";
    generateWaterItems();
}

function generateWaterItems() {
    let waterGlasses = document.getElementById("waterGlasses");
    for (let i = 0; i < 8; i++) {
        let glass = document.createElement("div");
        glass.classList.add("water-glass");
        glass.textContent = "💧";
        glass.onclick = () => toggleWaterItem(glass);
        waterGlasses.appendChild(glass);
    }
    for (let i = 0; i < 2; i++) {
        let bottle = document.createElement("div");
        bottle.classList.add("water-bottle");
        bottle.textContent = "🥤";
        bottle.onclick = () => toggleWaterItem(bottle, true);
        waterGlasses.appendChild(bottle);
    }
}
generateWaterItems();

function toggleWaterItem(item, isBottle = false) {
    item.style.opacity = item.style.opacity === "0.5" ? "1" : "0.5";
    checkWaterCompletion();
}

function checkWaterCompletion() {
    const glasses = document.querySelectorAll(".water-glass");
    const bottles = document.querySelectorAll(".water-bottle");
    const glassesFilled = Array.from(glasses).filter(g => g.style.opacity === "0.5").length;
    const bottlesFilled = Array.from(bottles).filter(b => b.style.opacity === "0.5").length;

    if (glassesFilled === 8) {
        alert("Great job! You've completed 2 liters with glasses!");
    }
    if (bottlesFilled === 2) {
        alert("Awesome! You've completed 4 liters with bottles!");
    }
}

// Journal Functions
let journalPassword = localStorage.getItem("journalPassword");
const journalPrompt = `Daily Journal\n\n- What went well today?\n- What could be improved?\n- Any thoughts or goals for tomorrow?`;
let journalData = {};

if (!journalPassword) {
    journalPassword = prompt("Set your journal password:");
    if (journalPassword) {
        localStorage.setItem("journalPassword", journalPassword);
    } else {
        alert("Password not set. Journal will remain locked.");
    }
}

function unlockJournal() {
    let pass = document.getElementById("journalPass").value;
    let journalEntry = document.getElementById("journalEntry");
    let saveButton = document.getElementById("saveJournalBtn");

    if (pass === journalPassword) {
        journalEntry.disabled = false;
        saveButton.disabled = false;
        alert("Journal unlocked!");
        loadJournal();
        document.getElementById("journalPass").value = "";
    } else {
        alert("Incorrect password!");
    }
}

function loadJournal() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("journalEntry").value = journalData[today] || journalPrompt;
}

function saveJournal() {
    const today = new Date().toISOString().split("T")[0];
    const journalEntry = document.getElementById("journalEntry").value;
    journalData[today] = journalEntry;
    alert("Journal saved for " + today + " (in app only)!");
}

// Pomodoro Timer Functions
let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isBreak = false;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timerDisplay").textContent = 
        `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById("pomodoro").querySelector("h1").textContent = 
        isBreak ? "Break Timer" : "Pomodoro Timer";
}

function startTimer() {
    if (!timerId) {
        timerId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerId);
                timerId = null;
                if (!isBreak) {
                    document.getElementById("pomodoroSound").play();
                    alert("Pomodoro complete! Starting 5-minute break.");
                    startBreak();
                } else {
                    document.getElementById("breakSound").play();
                    alert("Break complete! Ready for next Pomodoro?");
                    timeLeft = 25 * 60;
                    isBreak = false;
                    updateTimerDisplay();
                }
            }
        }, 1000);
    }
}

function startBreak() {
    timeLeft = 5 * 60; // 5 minutes break
    isBreak = true;
    updateTimerDisplay();
    startTimer();
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    pauseTimer();
    timeLeft = 25 * 60;
    isBreak = false;
    updateTimerDisplay();
}

// Initialize the app
showSection('home');
updateTimerDisplay();
