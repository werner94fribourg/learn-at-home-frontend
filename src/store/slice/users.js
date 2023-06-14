/**
 * Tasks slice of the redux store
 * @module store
 */
import {
  getSupervisedStudents,
  modifyConnectedUser,
  modifyConnectedUserWithProfilePicture,
} from '../../utils/api';
import {
  addContact,
  declineInvitation,
  getAllContacts,
  getAllInvitations,
  getAllMembers,
  getConnectedUser,
  getConnectionStatus,
  getSupervisedStatus,
  getUser,
  removeContact,
  sendInvitation,
} from '../../utils/api';
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
 * @property {User} supervisor - the supervisor of the student
 */

/**
 * The active user object
 * @typedef ActiveUser
 * @property {string} _id - the id of the user
 * @property {string} username - the username of the user
 */

/**
 * The data of a user's notification
 * @typedef NotificationData
 * @property {string} id - the id of the user that sent a notification to the connected user
 * @property {string} username - the username of the user that sent a notification
 * @property {string} message - the content of the message of the notification
 * @property {boolean} status - the status of the operation that generated the notification (true for success, false otherwise)
 * @property {string} type - the type of the notification (invitation, contact deletion, ...)
 */

/**
 * The users store object
 * @typedef UsersInitialState
 * @property {User} me - the data of the connected user
 * @property {boolean} loading - the loading status of the connected user
 * @property {ActiveUser} activeUser - the currently active user (i.e. the user with whom we just opened a conversation)
 * @property {boolean} online - the connection status of the active user
 * @property {User[]} members - the array of existing users in the platform
 * @property {User[]} contacts - the array of contacts of the connected user
 * @property {User[]} invitations - the array of users that sent a contact invitation to the connected one
 * @property {number} page - the last loaded page of the array of members
 * @property {boolean} membersLoading - the loading status of getting the list of members
 * @property {boolean} contactsLoading - the loading status of getting the list of contacts
 * @property {boolean} invitationsLoading - the loading status of getting the list of invitations
 * @property {boolean} loadPage - the loading state of the application when retrieving older users pages
 * @property {NotificationData} notificationData - the data we want to display in the notification
 * @property {boolean} supervised - the supervision status of the user (used for connected students)
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
    supervisor: undefined,
  },
  loading: true,
  activeUser: { id: '', username: '' },
  online: false,
  members: [],
  contacts: [],
  invitations: [],
  page: 1,
  membersLoading: false,
  contactsLoading: false,
  invitationsLoading: false,
  loadPage: false,
  notificationData: undefined,
  supervised: true,
  students: [],
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
        payload: {
          _id,
          email,
          username,
          firstname,
          lastname,
          photo,
          role,
          supervisor,
        },
      } = action;
      state.me = {
        _id,
        email,
        username,
        firstname,
        lastname,
        photo,
        role,
        supervisor,
      };
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
    setPage(state, action) {
      const { payload: page } = action;
      state.page = page;
    },
    setMembers(state, action) {
      const { payload: users } = action;

      state.members = users;
    },
    loadNextMembers(state, action) {
      const { payload: users } = action;

      state.members.push(...users);
    },
    setMembersLoading(state, action) {
      const { payload: status } = action;

      state.membersLoading = status;
    },
    setContactsLoading(state, action) {
      const { payload: status } = action;

      state.contactsLoading = status;
    },
    setInvitationsLoading(state, action) {
      const { payload: status } = action;

      state.invitationsLoading = status;
    },
    setLoadNextMembers(state, action) {
      const { payload: status } = action;

      state.loadPage = status;
    },
    setContacts(state, action) {
      const { payload: users } = action;
      state.contacts = users;
    },
    addContact(state, action) {
      const { payload: user } = action;
      const storedUser = state.contacts.find(u => u._id === user._id);
      if (!storedUser) state.contacts.push(user);
    },
    removeContact(state, action) {
      const { payload: userId } = action;
      state.contacts = state.contacts.filter(user => user._id !== userId);
    },
    setInvitations(state, action) {
      const { payload: users } = action;
      state.invitations = users;
    },
    addInvitation(state, action) {
      const { payload: user } = action;
      const storedUser = state.invitations.find(u => u._id === user._id);
      if (!storedUser) state.invitations.push(user);
    },
    removeInvitation(state, action) {
      const { payload: userId } = action;
      state.invitations = state.invitations.filter(user => user._id !== userId);
    },
    setNotification(state, action) {
      const { payload: data } = action;
      state.notificationData = data;
    },
    setSupervised(state, action) {
      const { payload: status } = action;
      state.supervised = status;
    },
    setSupervisedStudents(state, action) {
      const { payload: students } = action;
      state.students = students;
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
 * @param {string} token the jwt token of the connected user
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
 * Async Function used to modify the data of the connected user
 * @param {string} token the jwt token of the connected user
 * @param {Object} data the new values of the connected user (username, ...)
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<Array>} an array containing the validity of modifying the user's data, the authorization status of the attempt, the error message and the fields that generated an error
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setMe = async (token, data, dispatch) => {
  const { valid, authorized, message, fields, me } = await modifyConnectedUser(
    token,
    data
  );

  if (valid) dispatch(usersActions.setMe(me));

  return [valid, authorized, message, fields];
};

/**
 * Async Function used to modify the data of the connected user when containing the user's profile picture
 * @param {string} token the jwt token of the connected user
 * @param {FormData} formData the new values of the connected user, containing the new profile picture
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<Array>} an array containing the validity of modifying the user's data, the authorization status of the attempt, the error message, the fields that generated an error and the new profile picture url
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setMeWithProfilePicture = async (token, formData, dispatch) => {
  const { valid, authorized, message, fields, me } =
    await modifyConnectedUserWithProfilePicture(token, formData);

  if (valid) dispatch(usersActions.setMe(me));

  const { photo } = me;
  return [valid, authorized, message, fields, photo];
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
 * @param {string} token the jwt token of the connected user
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
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setUserConnectionStatus = (status, dispatch) => {
  dispatch(usersActions.setConnectionStatus(status));
};

/**
 * Async function used to get the existing members in the platform
 * @param {string} token the jwt token of the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @param {number} page the page we want to retrieve
 * @param {number} limit the number of elements per page
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getMembers = async (token, dispatch, page = 1, limit = 8) => {
  if (page === 1) dispatch(usersActions.setMembersLoading(true));
  else dispatch(usersActions.setLoadNextMembers(true));
  const { valid, authorized, users } = await getAllMembers(token, page, limit);

  if (valid) {
    if (page === 1) dispatch(usersActions.setMembers(users));
    else dispatch(usersActions.loadNextMembers(users));
    dispatch(usersActions.setPage(page + 1));
  } else dispatch(usersActions.setPage(-1));

  if (page === 1) dispatch(usersActions.setMembersLoading(false));
  else dispatch(usersActions.setLoadNextMembers(false));

  return authorized;
};

/**
 * Async function used to get all the contacts of the connected user
 * @param {string} token the jwt token of the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getContacts = async (token, dispatch) => {
  dispatch(usersActions.setContactsLoading(true));
  const { valid, authorized, users } = await getAllContacts(token);

  if (valid) dispatch(usersActions.setContacts(users));

  dispatch(usersActions.setContactsLoading(false));
  return authorized;
};

/**
 * Async function used to get all the users that sent an invitation to the connected user
 * @param {string} token the jwt token of the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getInvitations = async (token, dispatch) => {
  dispatch(usersActions.setInvitationsLoading(true));
  const { valid, authorized, users } = await getAllInvitations(token);

  if (valid) dispatch(usersActions.setInvitations(users));

  dispatch(usersActions.setInvitationsLoading(false));
  return authorized;
};

/**
 * Async function used to send a contact invitation to another user
 * @param {string} token the jwt token of the connected user
 * @param {string} userId the id of the user we want to invite
 * @param {string} username the username of the user we want to invite
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const invite = async (token, userId, username, dispatch) => {
  const { valid, authorized, message } = await sendInvitation(token, userId);

  dispatch(
    usersActions.setNotification({
      username,
      id: userId,
      valid,
      message,
      type: 'invitation',
    })
  );

  return [valid, authorized];
};

/**
 * Async function used to display and store a contact invitation received from another user
 * @param {Object} user the user from which we received an invitation
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const receiveInvitation = async (user, dispatch) => {
  dispatch(
    usersActions.setNotification({
      username: user.username,
      id: user.id,
      valid: true,
      message: `${user.username} just sent you a contact request.`,
      type: 'receive_invitation',
    })
  );
  dispatch(usersActions.setInvitationsLoading(true));
  const { valid, user: userToAdd } = await getUser(user.id);
  if (valid) dispatch(usersActions.addInvitation(userToAdd));
  dispatch(usersActions.setInvitationsLoading(false));
};

/**
 * Async function used to notify the connected user that another one has accepted his previous contact request
 * @param {Object} user the user that accepted the contact request from the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const invitationAccepted = (user, dispatch) => {
  dispatch(
    usersActions.setNotification({
      username: user.username,
      id: user.id,
      valid: true,
      message: `${user.username} accepted your contact invitation.`,
      type: 'invitation_accepted',
    })
  );
};

/**
 * Async function used to accept a contact invitation from another user
 * @param {string} token the jwt token of the connected user
 * @param {string} userId the id of the user we want to accept a contact invitation
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean[]>} an array containing the validity of retrieving the invitations and the authorization status
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const acceptInvitation = async (token, userId, dispatch) => {
  dispatch(usersActions.setContactsLoading(true));
  const { valid, authorized, users } = await addContact(token, userId);

  if (valid) dispatch(usersActions.setContacts(users));
  dispatch(usersActions.setContactsLoading(false));

  dispatch(usersActions.setInvitationsLoading(true));
  dispatch(usersActions.removeInvitation(userId));
  dispatch(usersActions.setInvitationsLoading(false));
  return [valid, authorized];
};

/**
 * Async function used to decline a contact invitation from another user
 * @param {string} token the jwt token of the connected user
 * @param {string} userId the id of the user we want to decline the contact invitation
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean[]>}  an array containing the validity of the contact declination attempt and the authorization status
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const decline = async (token, userId, dispatch) => {
  const { valid, authorized } = await declineInvitation(token, userId);

  if (valid) {
    dispatch(usersActions.setInvitationsLoading(true));
    dispatch(usersActions.removeInvitation(userId));
    dispatch(usersActions.setInvitationsLoading(false));
  }

  return [valid, authorized];
};

/**
 * Function used to close the user notification
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const closeNotification = dispatch => {
  dispatch(usersActions.setNotification(undefined));
};

/**
 * Async function used to delete a contact from the logged user's list
 * @param {string} token the jwt token of the connected user
 * @param {string} userId the id of the user the logged one wants to remove from his contact list
 * @param {string} username the username of the user the logged one wants to remove from his contact list
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean[]>} an array containing the validity of retrieving the invitations and the authorization status
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const deleteContact = async (token, userId, username, dispatch) => {
  dispatch(usersActions.setContactsLoading(true));
  const { valid, authorized, users, message } = await removeContact(
    token,
    userId
  );

  dispatch(
    usersActions.setNotification({
      username,
      id: userId,
      valid,
      message,
      type: 'delete_contact',
    })
  );

  if (valid) dispatch(usersActions.setContacts(users));
  dispatch(usersActions.setContactsLoading(false));

  return [valid, authorized];
};

/**
 * Function used to remove an user from the logged one's contact list
 * @param {string} userId the id of the user we want to remove from the contact's list
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const removeUserFromContactList = (userId, dispatch) => {
  dispatch(usersActions.setContactsLoading(true));
  dispatch(usersActions.removeContact(userId));
  dispatch(usersActions.setContactsLoading(false));
};

/**
 * Async function used to add an user to the logged one's contact list
 * @param {string} userId the id of the user we want to add to the contact's list
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const addUserToContactList = async (userId, dispatch) => {
  dispatch(usersActions.setContactsLoading(true));
  const { valid, authorized, user } = await getUser(userId);

  if (valid) dispatch(usersActions.addContact(user));
  dispatch(usersActions.setContactsLoading(false));
  return authorized;
};

/**
 * Async function used to get the supervision status of the connected student
 * @param {string} token the jwt token of the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getSupervision = async (token, dispatch) => {
  const { valid, authorized, supervised } = await getSupervisedStatus(token);

  if (valid) dispatch(usersActions.setSupervised(supervised));

  return authorized;
};

/**
 * Function used to modify the supervision status of the connected user
 * @param {boolean} status the new supervision status of the connected student
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setSupervisionStatus = (status, dispatch) => {
  dispatch(usersActions.setSupervised(status));
};

export const getStudents = async (token, dispatch) => {
  const {
    valid,
    authorized,
    users: students,
  } = await getSupervisedStudents({ token });

  if (valid) dispatch(usersActions.setSupervisedStudents(students));

  return authorized;
};
