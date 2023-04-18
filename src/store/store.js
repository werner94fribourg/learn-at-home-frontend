/**
 * General redux store of the application
 * @module store
 */
import authReducer from './slice/auth';
import { configureStore } from '@reduxjs/toolkit';

/**
 * General store of the application
 * @type {EnhancedStore}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const store = configureStore({
  reducer: { auth: authReducer },
});

export default store;
