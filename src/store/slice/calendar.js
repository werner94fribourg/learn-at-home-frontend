/**
 * Calendar slice of the redux store
 * @module store
 */
import {
  acceptEventInvitation,
  createNewEvent,
  declineEventInvitation,
  deleteSingleEvent,
  getPeriodEvents,
  modifyExistingEvent,
} from '../../utils/api';
import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';

/**
 * The data of a calendar's notification
 * @typedef NotificationData
 * @property {string} id - the id of the event that generated the notification
 * @property {string} username - the username of the user that sent the notification
 * @property {string} title - the title of the event
 * @property {string} message - the description of the event
 * @property {string} type - the type of the notification (receive_event, event_deleted, ...)
 * @property {string} beginning - the beginning of the event
 * @property {string} end - the end of the event
 * @property {boolean} accepted - the acceptation status of the event
 */

/**
 * The calendar store object
 * @typedef CalendarInitialState
 * @property {number} selectedDate - the actual selected date by the user
 * @property {Object[]} events - the array of the displayed events in the calendar
 * @property {string} period - the actual selected period used to get the displayed events
 * @property {boolean} loading - the loading state of the application when retrieving the events we want to display in the calendar
 * @property {NotificationData} notificationData - the data we want to display in the notification
 *
 * The initial state for the calendar store of the user
 * @type {CalendarInitialState}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const initialState = {
  selectedDate: Date.now(),
  events: [],
  period: 'week',
  loading: false,
  notificationData: undefined,
};

/**
 * The slice of the store representing the calendar state
 * @type {Slice<CalendarInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      const { payload: selected } = action;
      state.selectedDate = selected;
    },
    setEvents(state, action) {
      const { payload: events } = action;
      state.events = events;

      state.events.sort((e1, e2) => {
        const e1Beginning = moment(e1.beginning).tz('Europe/Zurich').valueOf();
        const e2Beginning = moment(e2.beginning).tz('Europe/Zurich').valueOf();
        if (e1Beginning > e2Beginning) return -1;

        if (e1Beginning < e2Beginning) return 1;

        return 0;
      });
    },
    setPeriod(state, action) {
      const { payload: period } = action;
      state.period = period;
    },
    setLoading(state, action) {
      const { payload: status } = action;
      state.loading = status;
    },
    addNewEvent(state, action) {
      const { payload: event } = action;

      const formattedEvent = moment(event.beginning).tz('Europe/Zurich');
      const formattedSelectedDate = moment(state.selectedDate).tz(
        'Europe/Zurich'
      );

      if (!formattedEvent.isSame(formattedSelectedDate, state.period)) return;

      state.events.push(event);

      state.events.sort((e1, e2) => {
        const e1Beginning = moment(e1.beginning).tz('Europe/Zurich').valueOf();
        const e2Beginning = moment(e2.beginning).tz('Europe/Zurich').valueOf();
        if (e1Beginning > e2Beginning) return -1;

        if (e1Beginning < e2Beginning) return 1;

        return 0;
      });
    },
    modifyEvent(state, action) {
      const { payload: event } = action;

      const eventIndex = state.events.findIndex(e => e._id === event._id);

      if (eventIndex === -1) return;

      state.events[eventIndex] = event;
    },
    removeEvent(state, action) {
      const { payload: eventId } = action;

      state.events = state.events.filter(event => event._id !== eventId);
    },
    setNotification(state, action) {
      const { payload: data } = action;
      state.notificationData = data;
    },
  },
});

/**
 * The actions associated with the calendar state
 * @type {CaseReducerActions<CalendarInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const calendarActions = calendarSlice.actions;

/**
 * The reducer associated with the calendar state
 * @type {Reducer<CalendarInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const calendarReducer = calendarSlice.reducer;

export default calendarReducer;

/**
 * Async Function used to modify the selected date in the application and get all the same period events for the required one
 * @param {string} token the jwt token of the connected user
 * @param {number} date the new date (in timestamp) we want to set as the selected date
 * @param {string} period the period for which we want to get all the user's events
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setSelectedDate = async (token, date, period, dispatch) => {
  dispatch(calendarActions.setLoading(true));
  const formattedDate = moment(date).tz('Europe/Zurich').format('YYYY-MM-DD');

  const { valid, authorized, events } = await getPeriodEvents(
    token,
    formattedDate,
    period
  );

  if (valid) dispatch(calendarActions.setEvents(events));

  dispatch(calendarActions.setSelectedDate(date));
  dispatch(calendarActions.setLoading(false));

  return authorized;
};

/**
 * Async function used to modify the type of period displayed in the calendar and retrieve all the events within the period at the selected date
 * @param {string} token the jwt token of the connected user
 * @param {string} period the new period we want to set
 * @param {number} date the actual selected date
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated an authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setPeriod = (token, period, date, dispatch) => {
  dispatch(calendarActions.setPeriod(period));

  return setSelectedDate(token, date, period, dispatch);
};

/**
 * Async function used to create a new event and notify the success of its creation
 * @param {string} token the jwt token of the connected user
 * @param {string} username the username of the connected user
 * @param {Object} newEvent the new event's data
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean[]>} an array containing the validity of creating an event, the authorization status of the creation attempt and the new event
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const createEvent = async (token, username, newEvent, dispatch) => {
  newEvent.participants = undefined;
  newEvent.guests = newEvent.guests.map(guest => guest._id);
  newEvent.attendees = newEvent.attendees.map(attendee => attendee._id);

  const { valid, authorized, event } = await createNewEvent(token, newEvent);

  if (valid) {
    const organizerId = event.organizer;
    event.organizer = {
      _id: organizerId,
      username,
    };

    dispatch(
      calendarActions.setNotification({
        username,
        id: event._id,
        valid: true,
        title: event.title,
        message: event.description,
        type: 'event_created',
        beginning: event.beginning,
        end: event.end,
      })
    );
    dispatch(calendarActions.addNewEvent(event));
  }

  return [valid, authorized, event];
};

/**
 * Async function used to modify an existing demand
 * @param {string} token the jwt token of the connected user
 * @param {Object} event the event we want to modify
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean[]>} an array containing the validity of modifying an event, the authorization status of the modification attempt and the new event
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const modifyEvent = async (token, _, event, dispatch) => {
  event.participants = undefined;
  event.guests = event.guests.map(guest => guest._id);
  event.attendees = event.attendees.map(attendee => attendee._id);

  const {
    valid,
    authorized,
    event: modifiedEvent,
  } = await modifyExistingEvent(token, event);

  if (valid) dispatch(calendarActions.modifyEvent(modifiedEvent));

  return [valid, authorized, modifiedEvent];
};

/**
 * Function used to notify an event notification sent to the connected user and store the event in the store
 * @param {Object} event the event that was received by the connected user and to which he is invited
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const receiveEvent = (event, dispatch) => {
  dispatch(
    calendarActions.setNotification({
      username: event.organizer.username,
      id: event._id,
      valid: true,
      title: event.title,
      message: event.description,
      type: 'receive_event',
      beginning: event.beginning,
      end: event.end,
    })
  );
  dispatch(calendarActions.addNewEvent(event));
};

/**
 * Function used to display an event notification
 * @param {Object} event the event data that we want to display in the notification
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @param {boolean} accepted the acceptation status of the event
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const displayEventNotification = (event, dispatch, accepted = false) => {
  dispatch(
    calendarActions.setNotification({
      username: event.organizer.username,
      id: event._id,
      valid: true,
      title: event.title,
      message: event.description,
      type: 'receive_event',
      beginning: event.beginning,
      end: event.end,
      accepted,
    })
  );
};

/**
 * Function used to store a modified event in which the user participates sent by the organizer
 * @param {Object} event the event that was modified
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const receiveModifiedEvent = (event, dispatch) => {
  dispatch(calendarActions.modifyEvent(event));
};

/**
 * Async function used to delete an existing event and notify the success of the process
 * @param {string} token the jwt token of the connected user
 * @param {Object} event the event we want to deleted
 * @param {string} username the username of the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean[]>} an array containing the validity of deleting an event and the authorization status of the deletion attempt
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const deleteEvent = async (token, event, username, dispatch) => {
  const { valid, authorized } = await deleteSingleEvent(token, event._id);

  if (valid) {
    dispatch(calendarActions.removeEvent(event._id));
    dispatch(
      calendarActions.setNotification({
        username: 'Removal',
        id: event._id,
        valid: true,
        title: event.title,
        message: `Organized by ${username}`,
        type: 'event_deleted',
        beginning: event.beginning,
        end: event.end,
      })
    );
  }

  return [valid, authorized];
};

/**
 * Async function used to accept the participation in an event
 * @param {string} token the jwt token of the connected user
 * @param {string} eventId the id of the event we want to accept the invitation
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean[]>} an array containing the validity of acceptating an event's invitation, the authorization status of the acceptation attempt and the updated event
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const participateInEvent = async (token, eventId, dispatch) => {
  const { valid, authorized, event } = await acceptEventInvitation(
    token,
    eventId
  );

  if (valid) dispatch(calendarActions.modifyEvent(event));

  return [valid, authorized, event];
};

/**
 * Async function used to decline the participation in an event
 * @param {string} token the jwt token of the connected user
 * @param {string} eventId the id of the event we want to decline the invitation
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean[]>} an array containing the validity of declining an event's invitation, the authorization status of the decline attempt and the updated event
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const declineParticipation = async (token, eventId, dispatch) => {
  const { valid, authorized, event } = await declineEventInvitation(
    token,
    eventId
  );

  if (valid) dispatch(calendarActions.removeEvent(eventId));

  return [valid, authorized, event];
};

/**
 * Function used to notify the acceptation of participating to an event and modify the relating object
 * @param {Object} event the event which participation was accepted by another user
 * @param {string} sender the user that accepted the participation
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const participationAccepted = (event, sender, dispatch) => {
  dispatch(calendarActions.modifyEvent(event));

  dispatch(
    calendarActions.setNotification({
      username: sender,
      id: event._id,
      valid: true,
      title: event.title,
      message: event.description,
      type: 'event_accepted',
      beginning: event.beginning,
      end: event.end,
    })
  );
};

/**
 * Function used to notify the decline of participating to an event and modify the relating object
 * @param {Object} event the event which participation was declined by another user
 * @param {string} sender the user that declined the participation
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const participationDeclined = (event, sender, dispatch) => {
  dispatch(calendarActions.modifyEvent(event));

  dispatch(
    calendarActions.setNotification({
      username: sender,
      id: event._id,
      valid: true,
      title: event.title,
      message: event.description,
      type: 'event_declined',
      beginning: event.beginning,
      end: event.end,
    })
  );
};

/**
 * Function used to notify the modification of an event
 * @param {Object} event the event which participation was modified by the organizer
 * @param {string} sender the username of the organizer
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const eventModified = (event, username, dispatch) => {
  dispatch(
    calendarActions.setNotification({
      username: 'Date',
      id: event._id,
      valid: true,
      title: event.title,
      message: `Organized by ${username}`,
      type: 'event_modified',
      beginning: event.beginning,
      end: event.end,
    })
  );
};

/**
 * Function used to notify the deletion of an event and remove it from the events list
 * @param {Object} event the event which was deleted
 * @param {string} sender the username of the organizer
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const eventDeleted = (event, username, dispatch) => {
  dispatch(calendarActions.removeEvent(event._id));
  dispatch(
    calendarActions.setNotification({
      username: 'Removal',
      id: event._id,
      valid: true,
      title: event.title,
      message: `Organized by ${username}`,
      type: 'event_deleted',
      beginning: event.beginning,
      end: event.end,
    })
  );
};

/**
 * Function used to close the calendar notification
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const closeNotification = dispatch => {
  dispatch(calendarActions.setNotification(undefined));
};
