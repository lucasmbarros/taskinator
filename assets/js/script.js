var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

// Function to get user input and call a function to create a task item
var taskFormHandler = function () {
  // Prevent a page refresh, losing local data
  event.preventDefault();

  // Get the user input from the form
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // Validate that an input was provided
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  // Reset the form, ready for the user to input another task
  formEl.reset();

  // If the form is being used to edit a task, a data task id will have been assigned to the form in editTask() below
  var isEdit = formEl.hasAttribute("data-task-id");

  // If an edit is being done, the task will be updated with a function
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  // If there is no data attribute, a new task is being created.
  else {
    // Package the data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do",
    };
    // Send the data as an argument to createTaskEl
    createTaskEl(taskDataObj);
  }
};

var completeEditTask = function (taskName, taskType, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  // loop through tasks array and task object with new content
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }

  alert("Task Updated!");

  saveTasks();

  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
};

// Function to create a task item using user input and appending that task item to the list
var createTaskEl = function (taskDataObj) {
  // Create the list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // Add a unique task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  //Make the task item draggable
  listItemEl.setAttribute("draggable", "true");

  // Create a div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  // and give it a class name
  taskInfoEl.className = "task-info";

  // Add HTML content to the div
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";
  listItemEl.appendChild(taskInfoEl);

  // Add the task actions to the div
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  // Append the tasks to their correct lists, whether the task is newly created or loaded from local storage
  if (taskDataObj.status === "to do") {
    listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
    // Add the entire list item to the To Do list
    tasksToDoEl.appendChild(listItemEl);
  } else if (taskDataObj.status === "in progress") {
    listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
    // Add the entire list item to the In Progress list
    tasksInProgressEl.appendChild(listItemEl);
  } else if (taskDataObj.status === "completed") {
    listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
    // Add the entire list item to the To Do list
    tasksCompletedEl.appendChild(listItemEl);
  }

  // Add the unique task id to the taskDataObj for this task
  taskDataObj.id = taskIdCounter;
  //and add the taskDataObj to the tasks array - this will allow for data persistence
  tasks.push(taskDataObj);

  // Save the data to local storage
  saveTasks();

  // Increase the task counter for the next unique id
  taskIdCounter++;
};

var createTaskActions = function (taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(statusSelectEl);

  var statusChoices = ["To Do", "In Progress", "Completed"];

  for (var i = 0; i < statusChoices.length; i++) {
    // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function (event) {
  // get target element from event
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var editTask = function (taskId) {
  // get task list item element
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;

  var taskType = taskSelected.querySelector("span.task-type").textContent;

  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);
};

var deleteTask = function (taskId) {
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();

  // create new array to hold updated list of tasks
  var updatedTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reassign tasks array to be the same as updatedTaskArr
  tasks = updatedTaskArr;

  saveTasks();
};

// Function for changing a task's status
var taskStatusChangeHandler = function () {
  // Get the task item's id
  var taskId = event.target.getAttribute("data-task-id");
  // Get the currently selected option's value and convert to lower case
  var statusValue = event.target.value.toLowerCase();
  // Find the parent task item element base on the id
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  // Move the task as needed based on the selected status
  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // Update the task object in the tasks array as well
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }

  // Save the data to local storage
  saveTasks();
};

var dragTaskHandler = function (event) {
  var taskId = event.target.getAttribute("data-task-id");
  event.dataTransfer.setData("text/plain", taskId);
  var getId = event.dataTransfer.getData("text/plain");
};

var dropZoneDragHandler = function (event) {
  var taskListEl = event.target.closest(".task-list");
  if (taskListEl) {
    event.preventDefault();
    taskListEl.setAttribute(
      "style",
      "background: rgba(68, 233, 255, 0.7); border-style: dashed;"
    );
  }
};

var dropTaskHandler = function (event) {
  var id = event.dataTransfer.getData("text/plain");

  var draggableElement = document.querySelector("[data-task-id='" + id + "']");

  var dropZoneEl = event.target.closest(".task-list");
  var statusType = dropZoneEl.id;

  // set status of task based on dropZone id
  var statusSelectEl = draggableElement.querySelector(
    "select[name='status-change']"
  );

  if (statusType === "tasks-to-do") {
    statusSelectEl.selectedIndex = 0;
  } else if (statusType === "tasks-in-progress") {
    statusSelectEl.selectedIndex = 1;
  } else if (statusType === "tasks-completed") {
    statusSelectEl.selectedIndex = 2;
  }

  dropZoneEl.removeAttribute("style");

  dropZoneEl.appendChild(draggableElement);

  // loop through tasks array to find and update the updated task's status
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(id)) {
      tasks[i].status = statusSelectEl.value.toLowerCase();
    }
  }

  saveTasks();
};

var dragLeaveHandler = function (event) {
  var taskListEl = event.target.closest(".task-list");
  if (taskListEl) {
    taskListEl.removeAttribute("style");
  }
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// A function to load tasks from local storage
var loadTasks = function () {
  // Get task items from local storage
  var savedTasks = localStorage.getItem("tasks");
  console.log(savedTasks);
  // If the tasks item does not exist, it will be null, and the function will exit without loading anything
  if (!savedTasks) {
    return false;
  }

  // Convert tasks from the stringified format back into the array of objects
  savedTasks = JSON.parse(savedTasks);

  // Use the createTaskEl function to re-create the stored tasks
  for (var i = 0; i < savedTasks.length; i++) {
    createTaskEl(savedTasks[i]);
  }
};

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);

loadTasks();
