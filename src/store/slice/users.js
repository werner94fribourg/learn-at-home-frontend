/**
 * Tasks slice of the redux store
 * @module store
 */
import { getConnectedUser, getConnectionStatus } from '../../utils/api';
import { createSlice } from '@reduxjs/toolkit';

/**
 * The user object
 * @typedef User
 * @property {string} _id - the id of the user
 * @property {string} email - the email of the user
 * @property {string} username - the username of the user
 * @property {string} firstname - the firstname of the user
 * @property {string} lastname - the lastname of the user
 * @property {string} photo - the photo of the user
 * @property {string} role - the role of the user
 */

/**
 * The active user object
 * @typedef ActiveUser
 * @property {string} _id - the id of the user
 * @property {string} username - the username of the user
 */

/**
 * The users store object
 * @typedef UsersInitialState
 * @property {User} me - the data of the connected user
 * @property {boolean} loading - the loading status of the connected user
 * @property {ActiveUser} activeUser - the currently active user (i.e. the user with whom we just opened a conversation)
 * @property {boolean} online - the connection status of the active user
 *
 * The initial state for the tasks store of the user
 * @type {UsersInitialState}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const initialState = {
  me: {
    _id: '',
    email: '',
    username: '',
    firstname: '',
    lastname: '',
    photo: '',
    role: '',
  },
  loading: true,
  activeUser: { id: '', username: '' },
  online: false,
};

/**
 * The slice of the store representing the users state
 * @type {Slice<UsersInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setMe(state, action) {
      const {
        payload: { _id, email, username, firstname, lastname, photo, role },
      } = action;
      state.me = { _id, email, username, firstname, lastname, photo, role };
      state.loading = false;
    },
    setLoading(state) {
      state.loading = false;
    },
    setActive(state, action) {
      const { payload: activeUser } = action;
      state.activeUser = activeUser;
    },
    setConnectionStatus(state, action) {
      const { payload: online } = action;
      state.online = online;
    },
  },
});

/**
 * The actions associated with the users state
 * @type {CaseReducerActions<UsersInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const usersActions = usersSlice.actions;

/**
 * The reducer associated with the users state
 * @type {Reducer<UsersInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const usersReducer = usersSlice.reducer;

export default usersReducer;

/**
 * Async function used to get the data of the connected user
 * @param {token} token the jwt token of the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getMe = async (token, dispatch) => {
  const { valid, authorized, me } = await getConnectedUser(token);

  if (valid) {
    dispatch(usersActions.setMe(me));
  } else dispatch(usersActions.setLoading());

  return authorized;
};

/**
 * Function used to modify the active user in the application
 * @param {string} user the user we want to set as an active one
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setActiveUser = (user, dispatch) => {
  dispatch(usersActions.setActive(user));
};

/**
 * Async function used to retrieve the connection status of the active user and store it in the store
 * @param {token} token the jwt token of the connected user
 * @param {string} userId the id of the user from which we want to retrieve the connection status
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getUserConnectionStatus = async (token, userId, dispatch) => {
  const { valid, authorized, connected } = await getConnectionStatus(
    token,
    userId
  );

  if (valid) dispatch(usersActions.setConnectionStatus(connected));

  return authorized;
};

/**
 * Function used to modify the connection status of the active user
 * @param {boolean} status the new connection status of the active user
 * @param {Function} dispatch the dispatcher function used to modify the store
 */
export const setUserConnectionStatus = (status, dispatch) => {
  dispatch(usersActions.setConnectionStatus(status));
};
