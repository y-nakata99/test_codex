const STORAGE_KEY = "todo.tasks";
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskTemplate = document.getElementById("task-template");

let tasks = loadTasks();
renderTasks(tasks);

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) {
    return;
  }

  const task = {
    id: createId(),
    text,
    completed: false,
    createdAt: Date.now(),
  };

  tasks.push(task);
  saveTasks(tasks);
  renderTasks(tasks);
  taskForm.reset();
  taskInput.focus();
});

taskList.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("task-delete")) {
    const taskId = target.closest(".task").dataset.id;
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks(tasks);
    renderTasks(tasks);
  }
});

taskList.addEventListener("change", (event) => {
  const target = event.target;
  if (target.classList.contains("task-toggle")) {
    const taskId = target.closest(".task").dataset.id;
    tasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: target.checked } : task
    );
    saveTasks(tasks);
    renderTasks(tasks);
  }
});

function renderTasks(taskItems) {
  taskList.innerHTML = "";

  if (taskItems.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "task-empty";
    emptyItem.textContent = "タスクはまだありません。";
    taskList.append(emptyItem);
    return;
  }

  const fragment = document.createDocumentFragment();

  taskItems
    .slice()
    .sort((a, b) => Number(a.completed) - Number(b.completed) || a.createdAt - b.createdAt)
    .forEach((task) => {
      const listItem = taskTemplate.content.firstElementChild.cloneNode(true);
      const checkbox = listItem.querySelector(".task-toggle");
      const textEl = listItem.querySelector(".task-text");

      listItem.dataset.id = task.id;
      textEl.textContent = task.text;
      checkbox.checked = task.completed;
      listItem.classList.toggle("completed", task.completed);

      fragment.append(listItem);
    });

  taskList.append(fragment);
}

function saveTasks(taskItems) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(taskItems));
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to load tasks", error);
    return [];
  }
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
