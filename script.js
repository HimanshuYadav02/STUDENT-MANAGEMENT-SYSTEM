// Global State
let tasks = [
  { id: 1, title: 'CSE - DSA: Study', time: '9:00 AM - 10:30 AM', tag: 'CSE - DSA', completed: false },
  { id: 2, title: 'CSE - DBMS: Study', time: '11:00 AM - 12:30 PM', tag: 'CSE - DBMS', completed: false }
];
let timerInterval = null;
let timeLeft = 25 * 60;
let currentDate = new Date();

// Navigation Logic
function switchPage(pageId) {
  document.querySelectorAll('.content-page').forEach(page => page.classList.remove('active'));
  document.querySelectorAll('.menu a').forEach(nav => nav.classList.remove('active'));
  
  document.getElementById(`page-${pageId}`).classList.add('active');
  document.getElementById(`nav-${pageId}`).classList.add('active');
  
  if (pageId === 'calendar') {
    renderCalendar();
  }
}

// Render Schedule Tasks & Recalculate Metrics
function renderTasks() {
  const container = document.getElementById('tasks-container');
  container.innerHTML = '';
  
  let completedCount = 0;

  tasks.forEach(task => {
    if (task.completed) completedCount++;
    
    const taskEl = document.createElement('div');
    taskEl.className = 'task-item';
    taskEl.innerHTML = `
      <div>
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
        <strong style="margin-left: 8px; ${task.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.title}</strong>
        <div class="task-tags">
          <span class="tag dsa">${task.tag}</span>
          <span style="color: var(--text-muted);">${task.time}</span>
        </div>
      </div>
      <button onclick="removeTask(${task.id})" style="border:none; background:transparent; color:#e74c3c; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
    `;
    container.appendChild(taskEl);
  });

  // Update Metrics
  document.getElementById('total-blocks').innerText = tasks.length;
  document.getElementById('metric-scheduled').innerText = tasks.length;
  const rate = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  document.getElementById('metric-completion').innerText = `${rate}%`;
}

// Interactive Calendar Logic
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  document.getElementById('month-year-display').innerText = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid = document.getElementById('calendar-dates');
  grid.innerHTML = '';

  // Empty cells before start of month
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-date empty';
    grid.appendChild(emptyCell);
  }

  // Days of month
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateCell = document.createElement('div');
    dateCell.className = 'calendar-date';
    dateCell.innerText = day;

    if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      dateCell.classList.add('today');
    }

    grid.appendChild(dateCell);
  }
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

// Task Handlers
function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  renderTasks();
}

function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function addSubjectTask(e) {
  e.preventDefault();
  const title = document.getElementById('subject-title').value;
  const time = document.getElementById('subject-time').value;

  tasks.push({
    id: Date.now(),
    title: title,
    time: time,
    tag: title.split(':')[0] || 'General',
    completed: false
  });

  document.getElementById('subject-title').value = '';
  document.getElementById('subject-time').value = '';
  renderTasks();
  switchPage('dashboard');
}

function openAddTaskModal() {
  switchPage('study-plan');
}

// Timer Controls
function updateTimerDisplay() {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  document.getElementById('timer').innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      alert('Session complete! Take a break.');
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  pauseTimer();
  timeLeft = 25 * 60;
  updateTimerDisplay();
}

// Settings Profile Update
function updateProfile() {
  const name = document.getElementById('setting-name').value;
  document.getElementById('user-name-display').innerText = name;
  document.getElementById('welcome-msg').innerText = `Welcome back, ${name}! 👋`;
  alert('Settings updated successfully!');
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});