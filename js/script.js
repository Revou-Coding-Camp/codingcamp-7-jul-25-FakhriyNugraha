// Todo List Application
class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderTodos();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add todo on Enter key press
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // Add todo on date input enter
        document.getElementById('dateInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }

    addTodo() {
        const todoInput = document.getElementById('todoInput');
        const dateInput = document.getElementById('dateInput');
        
        const todoText = todoInput.value.trim();
        const dueDate = dateInput.value;

        // Validate input
        if (!this.validateInput(todoText, dueDate)) {
            return;
        }

        // Create new todo
        const newTodo = {
            id: Date.now(),
            text: todoText,
            dueDate: dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(newTodo);
        this.saveTodos();
        this.renderTodos();
        
        // Clear inputs
        todoInput.value = '';
        dateInput.value = '';
        
        // Remove error styling
        this.removeErrorStyling();
    }

    validateInput(todoText, dueDate) {
        let isValid = true;
        
        // Remove previous error styling
        this.removeErrorStyling();
        // Validate todo text
        if (!todoText) {
            this.showInputError('todoInput', 'Please enter a todo item');
            isValid = false;
        } else if (todoText.length > 100) {
            this.showInputError('todoInput', 'Todo text cannot exceed 100 characters');
            isValid = false;
        }

        // Validate date
        if (!dueDate) {
            this.showInputError('dateInput', 'Please select a due date');
            isValid = false;
        } else {
            const selectedDate = new Date(dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                this.showInputError('dateInput', 'Due date cannot be in the past');
                isValid = false;
            }
        }

        return isValid;
    }

    showInputError(inputId, message) {
        const input = document.getElementById(inputId);
        input.classList.add('input-error');
        
        // Create or update error message
        let errorDiv = input.parentNode.querySelector('.error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            input.parentNode.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    removeErrorStyling() {
        const inputs = ['todoInput', 'dateInput'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            input.classList.remove('input-error');
            
            const errorDiv = input.parentNode.querySelector('.error');
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        });
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.renderTodos();
    }

    toggleComplete(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
        }
    }

    deleteAllTodos() {
        if (this.todos.length === 0) {
            return;
        }
        
        if (confirm('Are you sure you want to delete all todos?')) {
            this.todos = [];
            this.saveTodos();
            this.renderTodos();
        }
    } filterTodos() {
        const filterSelect = document.getElementById('filterSelect');
        this.currentFilter = filterSelect.value;
        this.renderTodos();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            case 'pending':
                return this.todos.filter(todo => !todo.completed);
            default:
                return this.todos;
        }
    }

    renderTodos() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            todoList.innerHTML = `
                <div class="empty-state">
                    <p>No task found</p>
                </div>
            `;
            return;
        }

        const todosHTML = filteredTodos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                <div class="todo-date">${this.formatDate(todo.dueDate)}</div>
                <div class="todo-status">
                    <span class="status-badge ${todo.completed ? 'status-completed' : 'status-pending'}">
                        ${todo.completed ? 'Completed' : 'Pending'}
                    </span>
                </div>
                <div class="todo-actions">
                    ${todo.completed 
                        ? `<button class="action-btn undo-btn" onclick="todoApp.toggleComplete(${todo.id})">Undo</button>`
                        : `<button class="action-btn complete-btn" onclick="todoApp.toggleComplete(${todo.id})">Complete</button>`
                    }
                    <button class="action-btn delete-btn" onclick="todoApp.deleteTodo(${todo.id})">Delete</button>
                </div>
            </div>
        `).join('');

        todoList.innerHTML = todosHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}

// Initialize the app
const todoApp = new TodoApp();

// Global functions for onclick handlers
function addTodo() {
    todoApp.addTodo();
}

function filterTodos() {
    todoApp.filterTodos();
}

function deleteAllTodos() {
    todoApp.deleteAllTodos();
}
