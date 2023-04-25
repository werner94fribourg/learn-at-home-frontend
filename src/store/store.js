/**
 * General redux store of the application
 * @module store
 */
import authReducer from './slice/auth';
import messagesReducer from './slice/messages';
import navbarReducer from './slice/navbar';
import tasksReducer from './slice/tasks';
import usersReducer from './slice/users';
import { configureStore } from '@reduxjs/toolkit';

/**
 * General store of the application
 * @type {EnhancedStore}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    navbar: navbarReducer,
    users: usersReducer,
    messages: messagesReducer,
    tasks: tasksReducer,
  },
});

export default store;
