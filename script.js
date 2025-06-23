
const planner = document.getElementById("planner");
const toggleThemeBtn = document.getElementById("toggle-theme");
const clearBtn = document.getElementById("clear-all");
const exportBtn = document.getElementById("export-plan");
const currentTimeDisplay = document.getElementById("current-time");

const startHour = 9;
const endHour = 21;

function updateClock() {
  const now = new Date();
  currentTimeDisplay.textContent = now.toLocaleString();
}
setInterval(updateClock, 1000);
updateClock();

for (let hour = startHour; hour <= endHour; hour++) {
  const now = new Date();
  const currentHour = now.getHours();

  const timeBlock = document.createElement("div");
  timeBlock.classList.add("time-block");

  if (hour < currentHour) {
    timeBlock.classList.add("past");
  } else if (hour === currentHour) {
    timeBlock.classList.add("present");
  } else {
    timeBlock.classList.add("future");
  }

  const hourLabel = document.createElement("div");
  hourLabel.classList.add("hour");
  const formattedHour = hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  hourLabel.textContent = formattedHour;

  const taskContainer = document.createElement("div");
  taskContainer.style.display = "flex";
  taskContainer.style.alignItems = "center";
  taskContainer.style.flex = 1;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-checkbox");

  const taskInput = document.createElement("input");
  taskInput.type = "text";
  taskInput.classList.add("task");
  taskInput.setAttribute("data-hour", hour);

  const savedTask = localStorage.getItem(`task-${hour}`);
  if (savedTask) taskInput.value = savedTask;

  taskInput.addEventListener("input", () => {
    if (checkbox.checked) taskInput.classList.add("completed");
    else taskInput.classList.remove("completed");
  });

  checkbox.addEventListener("change", () => {
    taskInput.classList.toggle("completed", checkbox.checked);
  });

  taskContainer.appendChild(checkbox);
  taskContainer.appendChild(taskInput);

  const saveBtn = document.createElement("button");
  saveBtn.classList.add("save-btn");
  saveBtn.textContent = "💾";
  saveBtn.addEventListener("click", () => {
    localStorage.setItem(`task-${hour}`, taskInput.value);
    alert("Task saved!");
  });

  if (hour === currentHour && savedTask && savedTask.trim()) {
    setTimeout(() => {
      alert(`Reminder for ${formattedHour}: ${savedTask}`);
    }, 1000);
  }

  timeBlock.appendChild(hourLabel);
  timeBlock.appendChild(taskContainer);
  timeBlock.appendChild(saveBtn);
  planner.appendChild(timeBlock);
}

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    for (let hour = startHour; hour <= endHour; hour++) {
      localStorage.removeItem(`task-${hour}`);
    }
    location.reload();
  }
});

exportBtn.addEventListener("click", () => {
  let plan = "My Day Planner\n\n";
  for (let hour = startHour; hour <= endHour; hour++) {
    const task = localStorage.getItem(`task-${hour}`) || "";
    const label = hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
    plan += `${label}: ${task}\n`;
  }

  const blob = new Blob([plan], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "MyDayPlan.txt";
  a.click();
  URL.revokeObjectURL(url);
});
