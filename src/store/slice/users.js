/**
 * Tasks slice of the redux store
 * @module store
 */
import { getConnectedUser } from '../../utils/api';
import { createSlice } from '@reduxjs/toolkit';

/**
 * The user object
 * @typedef User
 * @property {string} _id - the id of the user
 * @property {string} username - the username of the user
 * @property {string} firstname - the firstname of the user
 * @property {string} lastname - the lastname of the user
 * @property {string} photo - the photo of the user
 * @property {string} role - the role of the user
 */

/**
 * The users store object
 * @typedef UsersInitialState
 * @property {User} me - the data of the connected user
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
        payload: { _id: id, email, username, firstname, lastname, photo, role },
      } = action;
      state.me = { id, email, username, firstname, lastname, photo, role };
      state.loading = false;
    },
    setLoading(state) {
      state.loading = false;
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
