import './main.css';


const tasks = [ 'First task', 'Second task' ];

const addTodoInput  = document.querySelector<HTMLInputElement>('#todo-input')!;
const addTodoButton = document.querySelector<HTMLButtonElement>('#add-todo-button')!;
const todoList      = document.querySelector<HTMLOListElement>('#todo-list')!;

const createTaskInReadMode = (task: string) => {
    const element     = document.createElement('li');
    element.innerHTML = `
        <span>${ task }</span><button>Done</button>
    `;
    element.classList.add('task');

    const title = element.querySelector<HTMLSpanElement>('span')!;
    title.addEventListener('dblclick', () => {
        todoList.replaceChild(createTaskInEditMode(task), element);
    });

    const doneButton = element.querySelector<HTMLButtonElement>('button')!;
    doneButton.addEventListener('click', () => {
        element.remove();
    });

    return element;
};

const createTaskInEditMode = (task: string) => {
    const element     = document.createElement('li');
    element.innerHTML = `
        <input value="${ task }" type="text" autofocus/>
        <button data-type="edit">Edit</button>
        <button data-type="cancel">Cancel</button>
    `;
    element.classList.add('task');

    const input = element.querySelector<HTMLInputElement>('input')!;
    input.addEventListener('keydown', ({ key }) => {
        if (key === 'Enter' && taskTitleIsValid(input.value)) {
            todoList.replaceChild(createTaskInReadMode(input.value), element);
        }
    });

    input.addEventListener('input', () => {
        editButton.disabled = !taskTitleIsValid(input.value);
    });

    const editButton = element.querySelector<HTMLButtonElement>('button[data-type="edit"]')!;
    editButton.addEventListener('click', () => {
        if (taskTitleIsValid(input.value)) {
            todoList.replaceChild(createTaskInReadMode(input.value), element);
        }
    });

    const cancelButton = element.querySelector<HTMLButtonElement>('button[data-type="cancel"]')!;
    cancelButton.addEventListener('click', () => {
        todoList.replaceChild(createTaskInReadMode(task), element);
    });

    return element;
};

const addTask = (task: string) => {
    addTodoInput.value = '';
    addTodoInput.dispatchEvent(new Event('input'));
    todoList.append(createTaskInReadMode(task));
};

const taskTitleIsValid = (task: string) => task.length > 3;

addTodoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && taskTitleIsValid(addTodoInput.value)) {
        addTask(addTodoInput.value);
    }
});

addTodoInput.addEventListener('input', () => {
    addTodoButton.disabled = !taskTitleIsValid(addTodoInput.value);
});

addTodoButton.addEventListener('click', () => {
    if (taskTitleIsValid(addTodoInput.value)) {
        addTask(addTodoInput.value);
    }
});

tasks.forEach(addTask);