function addTaskOLD() {
    const description = document.getElementById('description').value;
    const time = document.getElementById('time').value;
    if (description && time) {
        const taskList = document.getElementById('taskList');
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.draggable = true;
        taskItem.innerHTML = `
            <span class="handle">☰</span>
            <input type="checkbox" checked>
            <input type="text" value="${description}" readonly class="task-description">
            <span class="task-time">${time} minutos</span>
            <button onclick="editTask(this)">Edit</button>
            <button onclick="deleteTask(this)">Delete</button>
        `;
        taskList.appendChild(taskItem);
        document.getElementById('description').value = '';
        document.getElementById('time').value = '';
        updateSummary();
    }
}

function addTask() {
    const description = document.getElementById('description').value;
    const time = document.getElementById('time').value;
    if (description && time) {
        const taskList = document.getElementById('taskList');
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.draggable = true;
        taskItem.innerHTML = `
            <span class="handle">☰</span>
            <input type="checkbox" checked>
            <input type="text" value="${description}" readonly class="task-description">
            <span class="task-time">${time} minutos</span>
            <button onclick="editTask(this)">Edit</button>
            <button onclick="deleteTask(this)">Delete</button>
        `;
        taskList.appendChild(taskItem);
        document.getElementById('description').value = '';
        document.getElementById('time').value = '';
        updateSummary();
    }
}

function editTask(button) {
    const taskItem = button.parentElement;
    const descriptionInput = taskItem.querySelector('.task-description');
    const timeSpan = taskItem.querySelector('.task-time');
    if (button.innerText === 'Edit') {
        descriptionInput.removeAttribute('readonly');
        const time = timeSpan.textContent.split(' ')[0];
        timeSpan.innerHTML = `<input type="number" value="${time}" class="time-input">`;
        button.innerText = 'Save';
        const timeInput = timeSpan.querySelector('input');
        timeInput.focus();
        timeInput.select();
    } else {
        saveTask(taskItem);
    }
}

function saveTask(taskItem) {
    const descriptionInput = taskItem.querySelector('.task-description');
    const timeInput = taskItem.querySelector('.task-time input');
    const saveButton = taskItem.querySelector('button');
    descriptionInput.setAttribute('readonly', true);
    const timeSpan = taskItem.querySelector('.task-time');
    timeSpan.textContent = `${timeInput.value} minutos`;
    saveButton.innerText = 'Edit';
    updateSummary();
}

function deleteTask(button) {
    const taskItem = button.parentElement;
    taskItem.remove();
    updateSummary();
}

function exportTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.children).map(taskItem => {
        return {
            active: taskItem.querySelector('input[type="checkbox"]').checked,
            description: taskItem.querySelector('.task-description').value,
            time: parseInt(taskItem.querySelector('.task-time').textContent)
        };
    });
    const tasksJSON = JSON.stringify(tasks, null, 2);
    const blob = new Blob([tasksJSON], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importTasks() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = readerEvent => {
            const content = readerEvent.target.result;
            const tasks = JSON.parse(content);
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.className = 'task-item';
                taskItem.draggable = true;
                taskItem.innerHTML = `
                    <span class="handle">☰</span>
                    <input type="checkbox" ${task.active ? 'checked' : ''}>
                    <input type="text" value="${task.description}" readonly class="task-description">
                    <span class="task-time">${task.time} minutos</span>
                    <button onclick="editTask(this)">Edit</button>
                    <button onclick="deleteTask(this)">Delete</button>
                `;
                taskList.appendChild(taskItem);
            });
            updateSummary();
        };
        reader.readAsText(file);
    };
    input.click();
}

function generateCalendar(year, month, elementId, startDay = 1, endDay = null) {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDay = new Date(year, month, 1).getDay() - 1;
    if (firstDay === -1) firstDay = 6;

    const calendarElement = document.getElementById(elementId);
    const monthNameElement = calendarElement.querySelector('.month-name');
    const tableElement = calendarElement.querySelector('.calendar-table');

    monthNameElement.textContent = `${monthNames[month]} ${year}`;

    let html = '<tr><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th><th>Dom</th></tr>';
    let day = 1;
    for (let i = 0; i < 6; i++) {
        html += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                html += '<td></td>';
            } else if (day > daysInMonth) {
                html += '<td></td>';
            } else {
                let classes = [];
                if (day >= startDay && (endDay === null || day <= endDay)) {
                    classes.push('project-day');
                }
                html += `<td class="${classes.join(' ')}">${day}</td>`;
                day++;
            }
        }
        html += '</tr>';
        if (day > daysInMonth) {
            break;
        }
    }

    tableElement.innerHTML = html;
}

function generateCalendarOLD2(year, month, elementId) {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDay = new Date(year, month, 1).getDay() - 1; // Ajustamos para que lunes sea 0
    if (firstDay === -1) firstDay = 6; // Si es domingo, lo movemos al final

    const calendarElement = document.getElementById(elementId);
    const monthNameElement = calendarElement.querySelector('.month-name');
    const tableElement = calendarElement.querySelector('.calendar-table');

    monthNameElement.textContent = `${monthNames[month]} ${year}`;

    let html = '<tr><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th><th>Dom</th></tr>';
    let day = 1;
    for (let i = 0; i < 6; i++) {
        html += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                html += '<td></td>';
            } else if (day > daysInMonth) {
                html += '<td></td>';
            } else {
                html += `<td>${day}</td>`;
                day++;
            }
        }
        html += '</tr>';
        if (day > daysInMonth) {
            break;
        }
    }

    tableElement.innerHTML = html;
}

function generateCalendarOLD(year, month, elementId) {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const calendarElement = document.getElementById(elementId);
    const monthNameElement = calendarElement.querySelector('.month-name');
    const tableElement = calendarElement.querySelector('.calendar-table');

    monthNameElement.textContent = `${monthNames[month]} ${year}`;

    let html = '<tr><th>Dom</th><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th></tr>';
    let day = 1;
    for (let i = 0; i < 6; i++) {
        html += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                html += '<td></td>';
            } else if (day > daysInMonth) {
                html += '<td></td>';
            } else {
                html += `<td>${day}</td>`;
                day++;
            }
        }
        html += '</tr>';
        if (day > daysInMonth) {
            break;
        }
    }

    tableElement.innerHTML = html;
}

function updateCalendars() {
    const startDateInput = document.getElementById('start-date');
    const startDate = new Date(startDateInput.value);
    const totalDaysElement = document.getElementById('total-days');
    const totalDays = parseInt(totalDaysElement.textContent) || 0;

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + totalDays - 1); // Restamos 1 porque el día de inicio cuenta como día de proyecto
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endDay = endDate.getDate();

    // Para el mes de inicio
    generateCalendar(startYear, startMonth, 'leftCalendar', startDay);

    // Para el mes final
    if (startYear === endYear && startMonth === endMonth) {
        // Si el proyecto termina en el mismo mes que comienza
        generateCalendar(endYear, endMonth, 'rightCalendar', 1, endDay);
    } else {
        // Si el proyecto termina en un mes diferente
        generateCalendar(endYear, endMonth, 'rightCalendar', 1, endDay);
    }
}
function updateCalendarsOLD() {
    const startDateInput = document.getElementById('start-date');
    const startDate = new Date(startDateInput.value);
    const totalDaysElement = document.getElementById('total-days');
    const totalDays = parseInt(totalDaysElement.textContent) || 0;

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + totalDays);
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    generateCalendar(startYear, startMonth, 'leftCalendar');
    generateCalendar(endYear, endMonth, 'rightCalendar');
}


function updateSummary() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.children);
    const servers = parseInt(document.getElementById('servers').value) || 1;
    const concurrency = parseInt(document.getElementById('simultaneous-execution').value) || 1;
    const startTime = parseInt(document.getElementById('start-time').value) || 0;
    const endTime = parseInt(document.getElementById('end-time').value) || 23;

    let totalMinutes = tasks.reduce((sum, task) => {
        const timeElement = task.querySelector('.task-time');
        const time = parseInt(timeElement.textContent) || 0;
        const isActive = task.querySelector('input[type="checkbox"]').checked;
        return sum + (isActive ? time : 0);
    }, 0);

    const totalHours = ((totalMinutes / 60) * servers)/concurrency;
    const workingHoursPerDay = endTime - startTime;
    const totalDays = workingHoursPerDay > 0 ? totalHours / workingHoursPerDay : 0;
    const serversPerDay = totalDays > 0 ? servers / totalDays : 0;

    document.getElementById('total-hours').textContent = Math.ceil(totalHours);
    document.getElementById('total-days').textContent = Math.ceil(totalDays);
    document.getElementById('servers-per-day').textContent = Math.ceil(serversPerDay);
    updateCalendars();
}


let draggedItem = null;

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');

    taskList.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        setTimeout(() => e.target.style.display = 'none', 0);
    });

    taskList.addEventListener('dragend', (e) => {
        setTimeout(() => {
            e.target.style.display = '';
            draggedItem = null;
        }, 0);
    });

    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        const currentItem = draggedItem;
        if (afterElement == null) {
            taskList.appendChild(currentItem);
        } else {
            taskList.insertBefore(currentItem, afterElement);
        }
    });

    document.getElementById('time').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    document.getElementById('start-date').addEventListener('change', updateCalendars);

    taskList.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && (e.target.classList.contains('task-description') || e.target.classList.contains('time-input'))) {
            const taskItem = e.target.closest('.task-item');
            if (taskItem) {
                saveTask(taskItem);
            }
        }
    });

    const simultaneousExecutionInput = document.getElementById('simultaneous-execution');
    const simultaneousExecutionValue = document.getElementById('simultaneous-execution-value');
    simultaneousExecutionInput.addEventListener('input', function() {
        simultaneousExecutionValue.textContent = this.value;
        updateSummary(); 
    });

    // Event listener para los checkboxes de las tareas
    document.getElementById('taskList').addEventListener('change', function(e) {
        if (e.target.type === 'checkbox') {
            updateSummary();
        }
    });    

    document.getElementById('servers').addEventListener('change', updateSummary);
    document.getElementById('start-time').addEventListener('change', updateSummary);
    document.getElementById('end-time').addEventListener('change', updateSummary);

    // Llamar a updateSummary inicialmente
    updateSummary();
});