/* eslint-disable */
import localStorageMock from "./localStorage";

function addTask(taskTodo) {
  const newTask = {
    description: document.getElementById('input-box').value,
    completed: false,
    index: taskTodo.length + 1,
  };
  taskTodo.push(newTask);
  localStorageMock.setItem('todo', taskTodo);
}

export default addTask;

/* eslint-disable */
import localStorageMock from "./localStorage";

function deleteTask(taskTodo, tasksToDo) {
  let index = taskTodo.index
  const currentTasks = tasksToDo.filter(taskTodo => taskTodo.index !== index);
  tasksToDo.forEach((object, index) => {
    object.index = index + 1;
  });
  localStorageMock.setItem('taskTodo', currentTasks);
  return currentTasks
}
export default deleteTask

/* eslint-disable */
const storage = [];

const localStorageMock = {
  getItem: (key) => storage [key],
  setItem: (key, value) => {
    storage [key] = value;
  }
}

export default localStorageMock;

/**
 * @jest-environment jsdom
 */
/* eslint-disable */
import addTask from "../_edit_/addItem";
import localStorageMock from "../_edit_/localStorage";

describe('Add new task to the list', () => {
  const tasksToDo  = [];
  test ('Add a new entry to the todo list', () => {
    document.body.innerHTML = `<input id='input-box' value='complete-project'/>`
    addTask(tasksToDo)
    expect(tasksToDo).toHaveLength(1);
  })
   test('Local Storage should be updated for every input', () => {
    expect(localStorageMock.getItem('todo')).toHaveLength(1);
   })
   test ('Add a second entry to the todo list', () => {
    document.body.innerHTML = `<input id='input-box' value='complete-second'/>`
    addTask(tasksToDo)
    expect(tasksToDo[1].index).toBe(2);
  })
})

/**
 * @jest-environment jsdom
 */
/* eslint-disable */
import deleteTask from "../_edit_/deleteItem";

describe('remove a task from the to-do list', () => {
  const tasksToDo = [
    {
      description: 'complete',
      status: false,
      index: '1',
    },
    {
      description: 'two',
      status: false,
      index: '2',
    },
    {
      description: 'three',
      status: false,
      index: '3',
    }
  ]
  test ('remove an entry from the to-do list', () => {
    let taskTodo = tasksToDo[1]
    expect(deleteTask(taskTodo, tasksToDo)).toHaveLength(2)
  })
})

import {
    addTask, deleteTask, editTask, clearCompleted,
  } from './status.js';
  import './style.css';
  
  window.onload = () => {
    const todos = JSON.parse(localStorage.getItem('todo') || '[]');
    const todoList = document.querySelector('.todoList');
  
    todos.forEach(({ description, id, completed }) => {
      todoList.innerHTML += `
        <li class="listElements">
          <div class="d-flex center-items list-group-1">
            <input type="checkbox" ${completed && 'checked'} class="check-box" id="check-${id}">
            <p class="task-description ${completed ? 'text-line' : ''}">${description}</p>
            <input type="input" class="edit-input no-outline">
          </div>
          <div>
            <i class="fas fa-trash-alt trash"></i>
            <i class="fas fa-ellipsis-v"></i>
          </div>
        </li>
        <hr>`;
    });
  
    const changeTaskStatus = (index, status) => {
      todos.filter((todo, todoIndex) => {
        if (index === todoIndex) {
          todo.completed = status;
          todos.splice(index, 1, todo);
        }
        return false;
      });
      localStorage.setItem('todo', JSON.stringify(todos));
      window.location.reload();
    };
  
    const inputElements = document.getElementById('input-box');
    inputElements.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const newTask = {
          description: inputElements.value,
          completed: false,
          index: todos.length + 1,
        };
        addTask(newTask, todos);
      }
    });
  
    document.querySelectorAll('.listElements').forEach((element, index) => {
      element.addEventListener('dblclick', () => {
        element.style.backgroundColor = 'bisque';
        const deleteIcon = element.childNodes[3].childNodes[1];
        const ellipsisIcon = element.childNodes[3].childNodes[3];
        const taskDescription = element.childNodes[1].childNodes[3];
        const editInput = element.childNodes[1].childNodes[5];
  
        deleteIcon.style.display = 'flex';
        ellipsisIcon.style.display = 'none';
        editInput.style.display = 'flex';
        taskDescription.style.display = 'none';
  
        element.addEventListener('mouseleave', () => {
          element.style.backgroundColor = 'transparent';
          deleteIcon.style.display = 'none';
          editInput.style.display = 'none';
          ellipsisIcon.style.display = 'flex';
          taskDescription.style.display = 'flex';
        });
  
        deleteIcon.addEventListener('click', () => {
          deleteTask(index, todos);
        });
  
        editInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            const { value } = editInput;
            editTask(index, value);
          }
        });
      });
    });
  
    document.querySelectorAll('.check-box').forEach((element, index) => {
      element.addEventListener('change', () => {
        if (element.checked) {
          changeTaskStatus(index, true);
        } else {
          changeTaskStatus(index, false);
        }
      });
    });
  
    document.querySelector('.clear-all-completed').addEventListener('click', () => {
      clearCompleted();
    });
  };

  const todos = JSON.parse(localStorage.getItem('todo') || '[]');
export function addTask(entry, todos) {
  todos.push(entry);
  localStorage.setItem('todo', JSON.stringify(todos));
  window.location.reload();
}

export function deleteTask(index, todos) {
  const currentTasks = todos.filter((todo, todoIndex) => todoIndex !== index);
  currentTasks.forEach((object, index) => {
    object.index = index + 1;
  });
  localStorage.setItem('todo', JSON.stringify(currentTasks));
  window.location.reload();
}

export function editTask(index, text) {
  todos.filter((todo, todoIndex) => {
    if (index === todoIndex) {
      todo.description = text;
      todos.splice(index, 1, todo);
    }
    return false;
  });
  localStorage.setItem('todo', JSON.stringify(todos));
  window.location.reload();
}

export function clearCompleted() {
  const newTodos = todos.filter((todo) => todo.completed !== true);
  newTodos.forEach((object, index) => {
    object.index = index + 1;
  });
  localStorage.setItem('todo', JSON.stringify(newTodos));
  window.location.reload();
}