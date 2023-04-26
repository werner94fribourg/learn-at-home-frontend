/**
 * Auth slice of the redux store
 * @module store
 */
import { login } from '../../utils/api';
import { getSocket, resetSocket } from '../../utils/utils';
import { createSlice } from '@reduxjs/toolkit';

/**
 * The authentication store object
 * @typedef AuthInitialState
 * @property {boolean} isAuth - authentication status of the user
 * @property {jwt} jwt - jwt token of the authenticated user
 * @property {string} authErrorMessage - the displayed error message when failing to authenticate
 *
 * The initial state for the authentication store of the user
 * @type {AuthInitialState}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const initialState = { isAuth: false, jwt: '', authErrorMessage: '' };

/**
 * The slice of the store representing the authentication state
 * @type {Slice<AuthInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { payload: token } = action;
      state.isAuth = true;
      state.jwt = token;
      state.authErrorMessage = '';
    },
    logout(state) {
      state.isAuth = false;
      state.jwt = '';
    },
    setErrorMessage(state, action) {
      const { payload: message } = action;
      state.authErrorMessage = message;
    },
  },
});

/**
 * The actions associated with the authentication state
 * @type {CaseReducerActions<AuthInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const authActions = authSlice.actions;

/**
 * The reducer associated with the authentication state
 * @type {Reducer<AuthInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const authReducer = authSlice.reducer;

export default authReducer;

/**
 * Async function used to log the user into the app and store the result of the login process into the store
 * @param {Object} credentials the credential object
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise} a promise that will resolve if the login process works correctly
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const connect = async (credentials, dispatch) => {
  const data = await login(credentials);

  if (data.valid) {
    dispatch(authActions.login(data.token));
    localStorage.setItem('jwt', data.token);
    return;
  }

  dispatch(authActions.setErrorMessage(data.message));
};

/**
 * Function used to logout the user
 * @param {Function} dispatch The dispatcher function
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const logout = dispatch => {
  const socket = getSocket();
  if (socket) {
    socket.disconnect();
    resetSocket();
  }

  localStorage.removeItem('jwt');
  dispatch(authActions.logout());
};

/**
 * Function used to initialize the state of the authentication by retrieving the jwt token from the localStorage
 * @param {string} token the jwt token retrieved from the localStorage
 * @param {Function} dispatch The dispatcher function
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const initialize = (token, dispatch) => {
  if (token) dispatch(authActions.login(token));
  else logout(dispatch);
};

/**
 * Function used to reset the error message received from the login attempt
 * @param {Function} dispatch The dispatcher function
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const resetErrorMessage = dispatch => {
  dispatch(authActions.setErrorMessage(''));
};
