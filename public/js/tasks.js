
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/index.html';
}

const tasksContainer = document.getElementById('tasks-container');
const noTasksDiv = document.getElementById('no-tasks');
const addTaskForm = document.getElementById('add-task-form');
const logoutBtn = document.getElementById('logout-btn');

// Load tasks on page load
loadTasks();

// Add task
addTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description })
        });
        
        if (response.ok) {
            document.getElementById('task-title').value = '';
            document.getElementById('task-description').value = '';
            loadTasks();
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
});


async function loadTasks() {
    try {
        const response = await fetch('/api/tasks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const tasks = await response.json();
        
        if (tasks.length === 0) {
            tasksContainer.innerHTML = '';
            noTasksDiv.classList.remove('hidden');
        } else {
            noTasksDiv.classList.add('hidden');
            displayTasks(tasks);
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Display tasks
function displayTasks(tasks) {
    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task-item border border-gray-200 rounded p-4 ${task.completed ? 'bg-gray-50' : 'bg-white'}" data-id="${task._id}">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}">
                        ${task.title}
                    </h3>
                    ${task.description ? `<p class="text-gray-600 text-sm mt-1">${task.description}</p>` : ''}
                </div>
                <div class="flex gap-2 ml-4">
                    <button 
                        onclick="toggleTask('${task._id}', ${!task.completed})" 
                        class="text-sm px-3 py-1 rounded ${task.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white"
                    >
                        ${task.completed ? 'Undo' : 'Done'}
                    </button>
                    <button 
                        onclick="deleteTask('${task._id}')" 
                        class="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');

 Sortable.create(tasksContainer, {
        animation: 150,
        onEnd: async () => {
            const items = document.querySelectorAll('.task-item');
            const orderedIds = [...items].map(el => el.dataset.id);

            await fetch('/api/tasks/reorder', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ orderedIds })
            });
        }
    });
}

// Toggle task completion
async function toggleTask(taskId, completed) {
    try {
        await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ completed })
        });
        loadTasks();
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Delete task
async function deleteTask(taskId) {
    if (!confirm('Delete this task?')) return;
    
    try {
        await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        loadTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
});