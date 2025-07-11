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
    }
