/**
 * Tasks slice of the redux store
 * @module store
 */
import { getOwnTasks, getTodoStudentsTasks } from '../../utils/api';
import { createSlice } from '@reduxjs/toolkit';

/**
 * The tasks store object
 * @typedef TasksInitialState
 * @property {Array} displayedTasks - the array containing the displayed tasks in the interface of the user
 *
 * The initial state for the tasks store of the user
 * @type {TasksInitialState}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const initialState = {
  displayedTasks: [],
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

  if (valid) {
    dispatch(tasksActions.setAllTasks(tasks));
  }

  return authorized;
};
