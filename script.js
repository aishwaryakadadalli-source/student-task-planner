// ==========================================================
// 1. SELECT HTML ELEMENTS
// We use document.getElementById to grab elements from index.html
// so we can interact with them in JavaScript.
// ==========================================================
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const taskCount = document.getElementById("task-count");
const completedCount = document.getElementById("completed-count");

// ==========================================================
// 2. STATE (DATA STORAGE)
// We keep our tasks in an array of objects.
// Each task object looks like: { id: 171234567, text: "Finish Math", completed: false }
// We also use localStorage so your tasks stay saved even if you refresh!
// ==========================================================
let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

// Save tasks array to the browser's local memory (localStorage)
function saveTasks() {
  localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

// ==========================================================
// 3. RENDER FUNCTION
// This function clears the HTML list and rebuilds it based on
// whatever is currently inside the "tasks" array.
// ==========================================================
function renderTasks() {
  // Clear the current list items in HTML
  taskList.innerHTML = "";

  // Check if there are no tasks: show empty state message
  if (tasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  // Loop through each task in our array and build its HTML
  tasks.forEach((task) => {
    // Create the <li> element for the task
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    // Create container for checkbox + task title
    const contentDiv = document.createElement("div");
    contentDiv.className = "task-content";

    // Create the checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    // When checkbox is clicked, toggle task completion status
    checkbox.addEventListener("change", () => toggleTask(task.id));

    // Create the task text span
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    // Clicking the text also toggles completion for ease of use
    span.addEventListener("click", () => toggleTask(task.id));

    // Put checkbox and text inside contentDiv
    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(span);

    // Create the delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    `;

    // When delete button is clicked, remove the task
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevents triggering click events on parent elements
      deleteTask(task.id);
    });

    // Assemble the complete list item
    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    // Add list item to the <ul>
    taskList.appendChild(li);
  });

  // Update task stats counter at the top
  updateStats();
}

// ==========================================================
// 4. ACTION FUNCTIONS (Add, Toggle, Delete)
// ==========================================================

// Add a new task
function addTask() {
  const taskText = taskInput.value.trim();

  // If the user entered nothing, don't add anything
  if (taskText === "") {
    taskInput.focus();
    return;
  }

  // Create a new task object
  const newTask = {
    id: Date.now(), // Unique ID using current timestamp
    text: taskText,
    completed: false
  };

  // Add the new task to the front of our array
  tasks.unshift(newTask);

  // Save to browser memory
  saveTasks();

  // Re-draw the tasks on screen
  renderTasks();

  // Clear input box and refocus it for quick typing
  taskInput.value = "";
  taskInput.focus();
}

// Toggle a task between completed and uncompleted
function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

// Delete a task by its unique ID
function deleteTask(id) {
  // Filter out the task with matching id
  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();
  renderTasks();
}

// Update task counters
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;

  taskCount.textContent = `${total} ${total === 1 ? "task" : "tasks"}`;
  completedCount.textContent = `${completed} completed`;
}

// ==========================================================
// 5. EVENT LISTENERS
// Listen for user interactions like button clicks or key presses
// ==========================================================

// 1) Click on the "Add Task" button
addTaskBtn.addEventListener("click", addTask);

// 2) Pressing "Enter" inside the text input
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevents page reload
    addTask();
  }
});

// ==========================================================
// 6. INITIAL LOAD
// Render tasks that were previously saved in localStorage
// when the page first opens!
// ==========================================================
renderTasks();
