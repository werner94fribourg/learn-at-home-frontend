/**
 * Auth slice of the redux store
 * @module store
 */
import { login, modifyPassword } from '../../utils/api';
import { getSocket, resetSocket } from '../../utils/utils';
import { createSlice } from '@reduxjs/toolkit';

/**
 * The authentication store object
 * @typedef AuthInitialState
 * @property {boolean} isAuth - authentication status of the user
 * @property {jwt} jwt - jwt token of the authenticated user
 * @property {string} authErrorMessage - the displayed error message when failing to authenticate / register
 * @property {string} confirmationSuccessMessage - the display success message when successfully confirming the registration into the application
 * @property {boolean} confirmed - a boolean informing the application if an user is able to access the confirmation page
 * @property {string} confirmationMessage - the message displayed in the confirmation page
 * @property {string} confirmationType - the type of the confirmation message displayed in the confirmation page
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
  confirmed: false,
  confirmationMessage: '',
  confirmationType: '',
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
    resetPassword(state, action) {
      const { payload: token } = action;
      state.jwt = token;
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
    setConfirmationStatus(state, action) {
      const { payload: status } = action;
      state.confirmed = status;
    },
    setConfirmationMessage(state, action) {
      const { payload: message } = action;
      state.confirmationMessage = message;
    },
    setConfirmationType(state, action) {
      const { payload: type } = action;
      state.confirmationType = type;
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
 * Async Function used to modify the user password and store the new generated jwt token in the store
 * @param {string} jwt the jwt token of the connected user
 * @param {Object} data the new password data
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<Array>} an array containing the validity of modifying the password, the authorization status code of the attempt, the error message and the fields that generated an error
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const modifyUserPassword = async (jwt, data, dispatch) => {
  const { valid, authorized, token, message, fields } = await modifyPassword(
    jwt,
    data
  );

  if (valid) {
    dispatch(authActions.resetPassword(token));
    localStorage.setItem('jwt', token);
  }

  return [valid, authorized, message, fields];
};

/**
 * Function used to log the user when he successfully confirm its inscription into the platform or changed his password
 * @param {string} token the jwt token returned when succeeding in confirming the inscription
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setToken = (token, dispatch) => {
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
 * Function used to modify the confirmation status of the user, used to manage its access to the confirmation page
 * @param {boolean} status the confirmation status of the non-connected user
 * @param {string} message the message that will displayed into the confirmation confirmation page
 * @param {string} type the type of confirmation that will be displayed in the confirmation page
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setConfirmationStatus = (
  status,
  message,
  dispatch,
  type = 'registration'
) => {
  dispatch(authActions.setConfirmationStatus(status));
  dispatch(authActions.setConfirmationMessage(message));
  dispatch(authActions.setConfirmationType(type));
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

/**
 * Function used to reset the confirmation type
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const resetConfirmationType = dispatch => {
  dispatch(authActions.setConfirmationType(''));
};
