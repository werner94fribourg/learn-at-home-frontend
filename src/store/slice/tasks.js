/**
 * Tasks slice of the redux store
 * @module store
 */
import {
  completeTask,
  createNewTask,
  createStudentTask,
  getDoneStudentsTasks,
  getOwnTasks,
  getTodoStudentsTasks,
  getValidatedStudentsTasks,
  validateTask,
} from '../../utils/api';
import { createSlice } from '@reduxjs/toolkit';

/**
 * The data of a task's notification
 * @typedef NotificationData
 * @property {string} id - the id of the task that generated the notification
 * @property {string} username - the username of the user that sent the notification
 * @property {string} title - the title of the task
 * @property {string} message - the description of the task
 * @property {string} type - the type of the notification (task_created, task_modified, ...)
 * @property {string} validated - the validation status of the task
 */

/**
 * The tasks store object
 * @typedef TasksInitialState
 * @property {Object[]} tasks - the array containing the tasks of the user (student) or the todo tasks of the supervised students (teacher)
 * @property {Object[]} doneTasks - the array containing the done tasks of the supervised students (teacher)
 * @property {Object[]} validatedTasks - the array containing the validated tasks of the supervised students (teacher)
 * @property {NotificationData} notificationData - the data we want to display in the notification
 *
 * The initial state for the tasks store of the user
 * @type {TasksInitialState}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const initialState = {
  tasks: [],
  doneTasks: [],
  validatedTasks: [],
  notificationData: undefined,
};

/**
 * The slice of the store representing the tasks state
 * @type {Slice<TasksInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setAllTasks(state, action) {
      const { payload: tasks } = action;
      state.tasks = tasks;
    },
    setDoneTasks(state, action) {
      const { payload: tasks } = action;
      state.doneTasks = tasks;
    },
    setValidatedTasks(state, action) {
      const { payload: tasks } = action;
      state.validatedTasks = tasks;
    },
    setTaskCompleted(state, action) {
      const { payload: task } = action;

      state.tasks = state.tasks.filter(t => t._id !== task._id);

      state.doneTasks.push(task);
    },
    setTaskValidated(state, action) {
      const { payload: task } = action;

      state.doneTasks = state.doneTasks.filter(t => t._id !== task._id);

      state.validatedTasks.push(task);
    },
    modifyTask(state, action) {
      const {
        payload: { task, role },
      } = action;

      if (role === 'student') {
        const taskIndex = state.tasks.findIndex(t => t._id === task._id);
        if (taskIndex === -1) return;
        state.tasks[taskIndex] = task;
        return;
      }

      if (task.validated) {
        const taskIndex = state.doneTasks.findIndex(t => t._id === task._id);
        if (taskIndex === -1) return;
        state.doneTasks = state.doneTasks.filter(t => t._id !== task._id);
        state.validatedTasks.push(task);
        return;
      }

      const taskIndex = state.tasks.findIndex(t => t._id === task._id);
      if (taskIndex === -1) return;
      state.tasks = state.tasks.filter(t => t._id !== task._id);
      state.doneTasks.push(task);
    },
    setNotification(state, action) {
      const { payload: data } = action;
      state.notificationData = data;
    },
    createTask(state, action) {
      const { payload: task } = action;

      state.tasks.push(task);
    },
  },
});

/**
 * The actions associated with the tasks state
 * @type {CaseReducerActions<TasksInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const tasksActions = tasksSlice.actions;

/**
 * The reducer associated with the tasks state
 * @type {Reducer<TasksInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const tasksReducer = tasksSlice.reducer;

export default tasksReducer;

/**
 * Async function used to get the displayed tasks of the connected user
 * @param {string} token the jwt token of the connected user
 * @param {string} role the role of the user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated a authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getTasks = async (token, role, dispatch) => {
  const { valid, authorized, tasks } = await (role === 'teacher'
    ? getTodoStudentsTasks(token)
    : getOwnTasks(token));

  if (valid) dispatch(tasksActions.setAllTasks(tasks));

  return authorized;
};

/**
 * Async function used to retrieve the done tasks of the supervised students
 * @param {string} token the jwt token of the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getDoneTasks = async (token, dispatch) => {
  const { valid, authorized, tasks } = await getDoneStudentsTasks(token);

  if (valid) dispatch(tasksActions.setDoneTasks(tasks));

  return authorized;
};
/**
 * Async function used to retrieve the validated tasks of the supervised students
 * @param {string} token the jwt token of the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getValidatedTasks = async (token, dispatch) => {
  const { valid, authorized, tasks } = await getValidatedStudentsTasks(token);

  if (valid) dispatch(tasksActions.setValidatedTasks(tasks));

  return authorized;
};

/**
 * Async function used to create a new task for the connected user
 * @param {string} token the jwt token of the connected user
 * @param {Object} data the data of the new task we want to create
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<Array>} an array containing the validity of creating a task, the authorization status of the creation attempt and the new task
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const createTask = async (token, data, dispatch) => {
  const { valid, authorized, task } = await createNewTask(token, data);

  if (valid) dispatch(tasksActions.createTask(task));

  return [valid, authorized, task];
};

/**
 * Async function used to create a new task for a supervised student
 * @param {string} token the jwt token of the connected user
 * @param {string} studentId the id of the student for which we want to create a new task
 * @param {Object} data the data of the new task we want to create
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<Array>} an array containing the validity of creating a task, the authorization status of the creation attempt and the new task
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const createSupervisedStudentTask = async (
  token,
  studentId,
  data,
  dispatch
) => {
  const { valid, authorized, task } = await createStudentTask(
    token,
    studentId,
    data
  );

  if (valid) dispatch(tasksActions.createTask(task));

  return [valid, authorized, task];
};

/**
 * Async function used to mark a task as completed
 * @param {string} token the jwt token of the connected user
 * @param {string} taskId the id of the task we want to set as completed
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<Array>} an array containing the validity of the completion attempt, the authorization status of the creation attempt and the new task
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const finishTask = async (token, taskId, dispatch) => {
  const { valid, authorized, task } = await completeTask(token, taskId);

  if (valid) dispatch(tasksActions.setTaskCompleted(task));

  return [valid, authorized, task];
};

/**
 * Async function used to mark a task as validated
 * @param {string} token the jwt token of the connected user
 * @param {string} taskId the id of the task we want to set as validated
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<Array>} an array containing the validity of the validation attempt, the authorization status of the creation attempt and the new task
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const validateStudentTask = async (token, taskId, dispatch) => {
  const { valid, authorized, task } = await validateTask(token, taskId);

  if (valid) dispatch(tasksActions.setTaskValidated(task));

  return [valid, authorized, task];
};

/**
 * Function used to store a new received task into the store
 * @param {Object} task the new task received
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const receiveCreatedTask = (task, dispatch) => {
  dispatch(tasksActions.createTask(task));
};

/**
 * Function used to modify an existing task in the store
 * @param {Object} task the task that was modified
 * @param {string} role the role of the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const receiveTask = (task, role, dispatch) => {
  dispatch(tasksActions.modifyTask({ task, role }));
};

/**
 * Function used to create a task notification
 * @param {Object} task the task for which we want to create a notification
 * @param {string} username the username of the creator of the task
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const notifyTask = (task, username, dispatch) => {
  const message = `${
    !task.done ? 'Created' : task.validated ? 'Validated' : 'Completed'
  } by ${username}`;
  dispatch(
    tasksActions.setNotification({
      username,
      id: task._id,
      valid: true,
      title: task.title,
      message,
      type: !task.done ? 'task_created' : 'task_modified',
      validated: task.validated,
    })
  );
};

/**
 * Function used to close the tasks notification
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const closeNotification = dispatch => {
  dispatch(tasksActions.setNotification(undefined));
};
