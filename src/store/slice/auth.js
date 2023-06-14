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
 * @property {string} authErrorMessage - the displayed error message when failing to authenticate / register
 * @property {string} confirmationSuccessMessage - the display success message when successfully confirming the registration into the application
 * @property {boolean} signed - a boolean informing the application if an user has recently signed to be able to access the confirmation page
 * @property {string} signupMessage - the message displayed in the signup confirmation page
 *
 * The initial state for the authentication store of the user
 * @type {AuthInitialState}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const initialState = {
  isAuth: false,
  jwt: '',
  authErrorMessage: '',
  confirmationSuccessMessage: '',
  signed: false,
  signupMessage: '',
};

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
    setSuccessMessage(state, action) {
      const { payload: message } = action;
      state.confirmationSuccessMessage = message;
    },
    setSignupStatus(state, action) {
      const { payload: status } = action;
      state.signed = status;
    },
    setSignupMessage(state, action) {
      const { payload: message } = action;
      state.signupMessage = message;
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
 * Function used to log the user when he successfully confirm its inscription into the platform
 * @param {string} token the jwt token returned when succeeding in confirming the inscription
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const confirmInscription = (token, dispatch) => {
  dispatch(authActions.login(token));
  localStorage.setItem('jwt', token);
};

/**
 * Function used to display an error message alert into the application
 * @param {string} message the error message that will be displayed in the alert message
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setErrorMessage = (message, dispatch) => {
  dispatch(authActions.setErrorMessage(message));
};

/**
 * Function used to display an success message alert into the application
 * @param {string} message the success message that will be displayed in the alert message
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setSuccessMessage = (message, dispatch) => {
  dispatch(authActions.setSuccessMessage(message));
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
 * Function used to modify the signup status of the user, used to manage its access to the confirmation page
 * @param {boolean} status the signup status of the non-connected user
 * @param {message} message the message that will displayed into the Signup confirmation page
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setSignupStatus = (status, message, dispatch) => {
  dispatch(authActions.setSignupStatus(status));
  dispatch(authActions.setSignupMessage(message));
};

/**
 * Function used to reset the error message received from the login attempt
 * @param {Function} dispatch The dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const resetErrorMessage = dispatch => {
  dispatch(authActions.setErrorMessage(''));
};

/**
 * Function used to reset the success message received from the confirmation attempt
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const resetSuccessMessage = dispatch => {
  dispatch(authActions.setSuccessMessage(''));
};
