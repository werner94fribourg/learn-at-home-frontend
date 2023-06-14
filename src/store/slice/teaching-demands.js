/**
 * Teaching demand slice of the redux store
 * @module store
 */
import {
  acceptTeachingDemand,
  cancelTeachingDemand,
  getAllTeachingDemands,
  getAvailableTeachers,
  sendTeachingDemand,
} from '../../utils/api';
import { createSlice } from '@reduxjs/toolkit';

/**
 * The notification message when the user sends a teaching demand to another one (student only)
 * @typedef SendMessage
 * @property {string} type - the status type of the notification (success, fail, ...)
 * @property {string} message - the message displayed in the notification
 */

/**
 * The data of a teaching demand's notification
 * @typedef NotificationData
 * @property {string} id - the id of the teaching demand that generated the notification
 * @property {string} username - the username of the user that sent the notification
 * @property {string} message - the content of the message of the notification
 * @property {boolean} status - the status of the operation that generated the notification (true for success, false otherwise)
 * @property {string} type - the type of the notification (invitation, contact deletion, ...)
 */

/**
 * The teaching demand store object
 * @typedef TeachingDemandInitialState
 * @property {Object[]} demands - the array of teaching demands of the connected user
 * @property {Object[]} teachers - the array of available teachers of the connected user (student only)
 * @property {boolean} loading - the loading state of the application when retrieving the teaching demands
 * @property {SendMessage} sendMessage - the notification displayed when the user try to send a new teaching demand to another (student only)
 * @property {NotificationData} notificationData - the data we want to display in the notification
 *
 * The initial state for the teachind demand store of the user
 * @type {TeachingDemandInitialState}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const initialState = {
  demands: [],
  teachers: [],
  loading: false,
  sendMessage: { type: '', message: '' },
  notificationData: undefined,
};

/**
 * The slice of the store representing the teaching demand state
 * @type {Slice<TeachingDemandInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const teachingDemandsSlice = createSlice({
  name: 'demands',
  initialState,
  reducers: {
    setAllTeachingDemands(state, action) {
      const { payload: demands } = action;
      state.demands = demands;
    },
    setTeachingDemand(state, action) {
      const { payload: demand } = action;
      const storedDemand = state.demands.find(d => d._id === demand._id);

      if (storedDemand) {
        storedDemand.accepted = demand.accepted;
        storedDemand.cancelled = demand.cancelled;
      }
      if (demand.accepted)
        state.demands.forEach(demand => {
          demand.cancelled = true;
        });
    },
    addTeachingDemand(state, action) {
      const { payload: demand } = action;

      const storedDemand = state.demands.find(d => d._id === demand._id);
      if (!storedDemand) state.demands.push(demand);

      state.teachers = state.teachers.filter(
        teacher => teacher._id !== demand.receiver._id
      );
    },
    setAvailableTeachers(state, action) {
      const { payload: teachers } = action;
      state.teachers = teachers;
    },
    setLoading(state, action) {
      const { payload: status } = action;
      state.loading = status;
    },
    setMessage(state, action) {
      const { payload: message } = action;
      state.sendMessage = message;
    },
    setNotification(state, action) {
      const { payload: data } = action;
      state.notificationData = data;
    },
    cancelTeachingDemand(state, action) {
      const { payload: userId } = action;

      const storedDemand = state.demands.find(
        demand => demand.sender._id === userId
      );

      if (storedDemand) {
        storedDemand.cancelled = false;
      }
    },
  },
});

/**
 * The actions associated with the teaching demand state
 * @type {CaseReducerActions<TeachingDemandInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const teachingDemandsActions = teachingDemandsSlice.actions;

/**
 * The reducer associated with the teaching demand state
 * @type {Reducer<TeachingDemandInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const teachingDemandsReducer = teachingDemandsSlice.reducer;

export default teachingDemandsReducer;

/**
 * Async function used to get all teaching demands of the connected user
 * @param {string} token the jwt token of the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getDemands = async (token, dispatch) => {
  dispatch(teachingDemandsActions.setLoading(true));
  const { valid, authorized, demands } = await getAllTeachingDemands(token);

  if (valid) dispatch(teachingDemandsActions.setAllTeachingDemands(demands));

  dispatch(teachingDemandsActions.setLoading(false));
  return authorized;
};

/**
 * Function used to display a notification and store a teaching demand when the connected user receives one (teachers only)
 * @param {Object} demand the teaching demand received as a notification
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const receiveTeachingDemand = (demand, dispatch) => {
  const {
    receiver: { username },
    _id: id,
  } = demand;
  dispatch(teachingDemandsActions.addTeachingDemand(demand));
  dispatch(
    teachingDemandsActions.setNotification({
      username,
      id,
      valid: true,
      message: `${username} just sent you a teaching request.`,
      type: 'receive_teaching_demand',
    })
  );
};

/**
 * Function used to notify the user that his teaching request was accepted by a teacher (students only)
 * @param {Object} demand the teaching demand that was accepted by the teacher
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const demandAccepted = (demand, dispatch) => {
  const {
    receiver: { username },
    _id: id,
  } = demand;
  dispatch(teachingDemandsActions.setTeachingDemand(demand));
  dispatch(
    teachingDemandsActions.setNotification({
      username,
      id,
      valid: true,
      message: `${username} accepted your teaching demand.`,
      type: 'teaching_demand_accepted',
    })
  );
};

/**
 * Function used to notify the user that his teaching request was cancelled by a teacher (students only)
 * @param {Object} demand the teaching demand that was cancelled by the teacher
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const demandCancelled = (demand, dispatch) => {
  dispatch(teachingDemandsActions.setTeachingDemand(demand));
};

/**
 * Function used to close the teaching demand notification
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const closeNotification = dispatch => {
  dispatch(teachingDemandsActions.setNotification(undefined));
};

/**
 * Async function used to send a teaching demand to a teacher (student only)
 * @param {string} token the jwt token of the connected user
 * @param {string} userId the id of the teacher to which the connected user wants to send a teaching demand
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<Array>} an array containing the validity of retrieving the demands, the authorization status, the message sent back by the server and the new created demand
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const sendDemand = async (token, userId, dispatch) => {
  const { valid, authorized, demand, message } = await sendTeachingDemand(
    token,
    userId
  );

  if (valid) dispatch(teachingDemandsActions.addTeachingDemand(demand));

  return [valid, authorized, message, demand];
};

/**
 * Async function used to accept a teaching demand (teachers only)
 * @param {string} token the jwt token of the connected user
 * @param {string} id the id of the demand the connected used wants to accept
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<Array>} an array containing the validity of accepting a demand, the authorization status of the acceptation attempt and the updated demand
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const acceptDemand = async (token, id, dispatch) => {
  const { valid, authorized, demand } = await acceptTeachingDemand(token, id);

  if (valid) dispatch(teachingDemandsActions.setTeachingDemand(demand));

  return [valid, authorized, demand];
};

/**
 * Async function used to cancel a teaching demand (teachers only)
 * @param {string} token the jwt token of the connected user
 * @param {string} id the id of the demand the connected used wants to cancel
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean[]>} an array containing the validity of cancelling a demand, an array containing the authorization status of the cancellation attempt and the updated demand
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const cancelDemand = async (token, id, dispatch) => {
  const { valid, authorized, demand } = await cancelTeachingDemand(token, id);

  if (valid) dispatch(teachingDemandsActions.setTeachingDemand(demand));

  return [valid, authorized, demand];
};

/**
 * Function used to cancel a demand in store
 * @param {string} userId the id of the student for which we want to cancel a teaching demand
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const cancelDemandInStore = async (userId, dispatch) => {
  dispatch(teachingDemandsActions.cancelTeachingDemand(userId));
};

/**
 * Async function used to get the available teachers for a connected student (i.e. teachers to which the user hasn't sent a request)
 * @param {string} token the jwt token of the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getTeachers = async (token, dispatch) => {
  const { valid, authorized, teachers } = await getAvailableTeachers(token);

  if (valid) dispatch(teachingDemandsActions.setAvailableTeachers(teachers));

  return authorized;
};

/**
 * Function used to display a success message if the connected user has successfully sent a teaching request to a teacher (students only)
 * @param {string} message the message we want to display in the send request notification
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setSuccessMessage = (message, dispatch) => {
  dispatch(teachingDemandsActions.setMessage({ type: 'success', message }));
};

/**
 * Function used to display an error message if the teaching request sending failed (students only)
 * @param {string} message the message we want to display in the send request notification
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setErrorMessage = (message, dispatch) => {
  dispatch(teachingDemandsActions.setMessage({ type: 'error', message }));
};

/**
 * Function used to reset the error message data
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const resetMessage = dispatch => {
  dispatch(teachingDemandsActions.setMessage({ type: '', message: '' }));
};
