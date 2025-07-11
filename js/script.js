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
