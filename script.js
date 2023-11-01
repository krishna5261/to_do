document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const addTaskButton = document.getElementById("addTask");
    const completedTaskList = document.getElementById("completedTaskList");
    const incompletedTaskList = document.getElementById("incompletedTaskList");
    const notesTextarea = document.getElementById("notes");
    const dateDisplay = document.getElementById("dateDisplay");
    const saveNotesButton = document.getElementById("saveNotes");
    const resetNotesButton = document.getElementById("resetNotes");
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const savedNotes = localStorage.getItem("notes");
    const savedTaskStatus = JSON.parse(localStorage.getItem("taskStatus")) || { completed: [], incompleted: [] };

    for (const task of savedTasks) {
        createTaskElement(task.text, task.completed, task.id);
    }

    if (savedNotes) {
        notesTextarea.value = savedNotes;
    }

    if (savedTaskStatus.completed.length > 0) {
        for (const taskId of savedTaskStatus.completed) {
            moveTaskToCompleted(taskId);
        }
    }

    if (savedTaskStatus.incompleted.length > 0) {
        for (const taskId of savedTaskStatus.incompleted) {
            moveTaskToIncompleted(taskId);
        }
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    const dateString = today.toLocaleDateString(undefined, options);
    dateDisplay.textContent = dateString;

    addTaskButton.addEventListener("click", function () {
        const taskText = taskInput.value.trim();

        if (taskText !== "") {
            createTaskElement(taskText, false, Date.now()); 
            taskInput.value = "";
            saveTasksToLocalStorage();
        }
    });

    taskInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            addTaskButton.click();
        }
    });

    saveNotesButton.addEventListener("click", function () {
        saveNotesToLocalStorage();
    });

    resetNotesButton.addEventListener("click", function () {
        notesTextarea.value = "";
        saveNotesToLocalStorage();
    });

    function createTaskElement(taskText, completed, taskId) {
        const listItem = document.createElement("li");
        listItem.dataset.id = taskId; 
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;
        const label = document.createElement("label");
        label.textContent = taskText;
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete";
        deleteButton.textContent = "Delete";
        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        listItem.appendChild(deleteButton);
        if (completed) {
            completedTaskList.appendChild(listItem);
        } else {
            incompletedTaskList.appendChild(listItem);
        }
        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                moveTaskToCompleted(taskId);
            } else {
                moveTaskToIncompleted(taskId);
            }
        });
        deleteButton.addEventListener("click", function () {
            listItem.remove();
            removeTaskFromLocalStorage(taskId);
        });
        saveTasksToLocalStorage();
    }   
        function moveTaskToCompleted(taskId) {
                const listItem = document.querySelector(`li[data-id="${taskId}"]`);
                if (listItem) {
                    incompletedTaskList.removeChild(listItem);
                    completedTaskList.appendChild(listItem);
                    saveTasksToLocalStorage();
                }
            }
        
            function moveTaskToIncompleted(taskId) {
                const listItem = document.querySelector(`li[data-id="${taskId}"]`);
                if (listItem) {
                    completedTaskList.removeChild(listItem);
                    incompletedTaskList.appendChild(listItem);
                    saveTasksToLocalStorage();
                }
            }
        
            function saveTasksToLocalStorage() {
                const taskItems = Array.from(document.querySelectorAll("li[data-id]"));
                const tasks = taskItems.map(taskItem => ({
                    id: taskItem.dataset.id,
                    text: taskItem.querySelector("label").textContent,
                    completed: taskItem.querySelector("input[type='checkbox']").checked,
                }));
        
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }
        
            function removeTaskFromLocalStorage(taskId) {
                const taskItems = JSON.parse(localStorage.getItem("tasks")) || [];
                const updatedTasks = taskItems.filter(task => task.id !== taskId);
                localStorage.setItem("tasks", JSON.stringify(updatedTasks));
            }
        });





