/**
 * Store of all global helper functions used in the application
 * @module helpers
 */
import { BACKEND_URL } from './globals';
import moment from 'moment-timezone';
import { io } from 'socket.io-client';

/**
 * Function used to format a given time relative to the actual time
 * @param {Moment} sentTime the time we want to format
 * @returns {[string, number]} a formatted version of the time we just passed and the timer time in which the formatted date should be regenerated
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const generateDisplayedTime = sentTime => {
  const now = moment(Date.now()).tz('Europe/Zurich');

  let diff = now.diff(sentTime, 'seconds');

  if (diff < 60) {
    return ['Now', 60 * 1000];
  }

  diff = now.diff(sentTime, 'minutes');

  if (diff < 60) return [`${diff} minutes ago`, 60 * 1000];

  diff = now.diff(sentTime, 'hours');

  if (diff < 24) return [`${diff} hours ago`, 60 * 60 * 1000];

  diff = now.diff(sentTime, 'days');

  if (diff === 1)
    return [`Yesterday at ${sentTime.format('HH:mm')}`, 24 * 60 * 60 * 1000];

  return [sentTime.format('DD.MM.YYYY [at] HH:mm'), -1];
};

/**
 * Socket connection to the backend
 * @type {Socket}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
let SOCKET = null;

/**
 * Function used to retrieve the socket connection of the application
 * @returns {Socket} the socket connection object
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getSocket = () => SOCKET;

/**
 * Function used to set the socket connection to the server
 * @param {string} userId the id of the connected user for which we want to create a socket connection
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setSocket = userId => {
  SOCKET = io.connect(BACKEND_URL, { query: `userId=${userId}` });
};

/**
 * Function used to delete the socket connection of the application
 * @returns {Socket} the socket connection object
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const resetSocket = () => {
  SOCKET = null;
};

/**
 * Function used to generate a response object when an unknow error happens in the application
 * @returns {Object} the generated response object in case where an unknown error happens in the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getUnknowErrorObject = () => {
  return {
    valid: false,
    authorized: false,
    message: 'An unknow error happened. Try again later.',
  };
};

/**
 * Function used to generate a response object when an error status code is sent back by the server
 * @param {number} status the status code of the response
 * @param {string} message the error message sent back by the server
 * @returns {Object} the generated response object in case an error status code is sent back by the server
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getErrorObject = (status, message) => {
  return {
    valid: false,
    authorized: status !== 401 && status !== 403,
    message,
  };
};

/**
 * Function used to make an API Call to a specific url in the backend
 * @param {string} url the url of the endpoint to which we want to make the API call
 * @param {Object} fetchObj the request parameters used to make the API call
 * @param {Function} returnData the handler function used to return the data when successfully retrieving it from the API
 * @param {number} code the status code of the response in case it successfully retrieves it (200 by default)
 * @returns {Promise<Object>} a promise returning a response object data depending on the success of the API Call
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const makeApiCall = async (url, fetchObj, returnData, code = 200) => {
  try {
    const response = await fetch(url, fetchObj);

    const { status } = response;

    if (code === 204 && status === code) return returnData();

    const data = await response.json();

    if (status === code) return returnData(data);

    const { message } = data;
    return getErrorObject(status, message);
  } catch (err) {
    return getUnknowErrorObject();
  }
};

/**
 * Function used to check if a given user is a contact of the connected user
 * @param {string} id the id of the user we want to check if he is a contact
 * @param {Object[]} contacts the array of contacts of the connected user
 * @returns {boolean} true if the requested user is a contact, false otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const isContact = (id, contacts) =>
  contacts.filter(user => user._id === id).length > 0;

/**
 * Function used to generate the display text for a teaching demand status (cancelled or accepted) in the demand's list
 * @param {boolean} status the status of the teaching demand cell
 * @returns {string} 'Yes' if the status is true, 'No' otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const generatedDemandCellText = status => (status ? 'Yes' : 'No');

/**
 * Function used to generate, for a specific choosen date, the array of dates displayed in the month datepicker
 * @param {Moment} date The date moment from which we want to generate the displayed dates
 * @returns {Moment[]} An array of moment dates that will be displayed in the datepicker
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const generateDays = date => {
  const beginning = date.clone().startOf('month');
  const end = date.clone().endOf('month');

  const firstSunday = beginning.clone().startOf('week');

  const lastSaturday = end.clone().endOf('week');

  const nbRows = (lastSaturday.diff(firstSunday, 'day') + 1) / 7;

  return new Array(nbRows)
    .fill(0)
    .map((_, indexX) =>
      new Array(7)
        .fill(0)
        .map((_, indexY) =>
          firstSunday.clone().add(7 * indexX + indexY, 'days')
        )
    );
};

/**
 * Function used to generate, for a specific date, the array of dates belonging to the same week
 * @param {Moment} date the date moment for which we want to generate the week
 * @returns {Moment[]} an array of dates belonging to the same week as the specified date
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getWeekDays = date => {
  const firstWeekDay = date.clone().startOf('week');

  return new Array(7)
    .fill(0)
    .map((_, index) => firstWeekDay.clone().add(index, 'days'));
};

/**
 * Function used to generate, for a specific array of dates, moments happening for those dates at each hour of the day
 * @param {Moment[]} dates the array of dates for which we want to generates the times
 * @returns {Moment[][]} a double array containing, for each hour of the day (00:00, 01:00, ...), the dates given as an array happening at this specific hour
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getWeekTimes = dates => {
  return new Array(24)
    .fill(0)
    .map((_, index) =>
      dates.map(date => date.clone().startOf('day').add(index, 'hours'))
    );
};

/**
 * Function used to check if two dates happen on the same month
 * @param {Moment} date1 the first date we want to compare
 * @param {Moment} date2 the second date we want to compare
 * @returns {boolean} true if the two dates are happening on the same month, false otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const isSameMonth = (date1, date2) => date1.isSame(date2, 'month');

/**
 * Function used to check if two dates happen on the same day
 * @param {Moment} date1 the first date we want to compare
 * @param {Moment} date2 the second date we want to compare
 * @returns {boolean} true if the two dates are happening on the same day, false otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const isSameDay = (date1, date2) => date1.isSame(date2, 'day');

/**
 * Function used to check if two dates happen on the same week
 * @param {Moment} date1 the first date we want to compare
 * @param {Moment} date2 the second date we want to compare
 * @returns {boolean} true if the two dates are happening on the same week, false otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const isSameWeek = (date1, date2) => date1.isSame(date2, 'week');

/**
 * Function used to check if two dates happen on the same year
 * @param {Moment} date1 the first date we want to compare
 * @param {Moment} date2 the second date we want to compare
 * @returns {boolean} true if the two dates are happening on the same year, false otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const isSameYear = (date1, date2) => date1.isSame(date2, 'year');

/**
 * Function used to check if the connected user is the organizer of an event
 * @param {string} connectedId the id of the logged in user
 * @param {string} organizerId the id of the organizer of an event
 * @returns {boolean} true if the connected user is the organizer of an event, false otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const isOrganizer = (connectedId, organizerId) =>
  connectedId === organizerId;

/**
 * Function used to check if the connected user is a guest of an event
 * @param {string} connectedId the id of the logged in user
 * @param {string[]} guestArray the array of guests of an event
 * @returns {boolean} true if the connected user is a guest of an event, false otherwise
 */
export const isGuest = (connectedId, guestArray) =>
  guestArray.includes(connectedId);

/**
 * Function used to display the active period in the calendar page
 * @param {boolean} status the status of the selected period
 * @param {string} normal the classes applied to the period
 * @param {string} active the classes applied to the period if it is an active one
 * @returns {string} all the classes that will be applied to the given period depending on its status
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setActivePeriod = (status, normal, active) => {
  let className = normal;

  if (status) className += ` ${active}`;

  return className;
};

/**
 * Function used to display the navigation text in the calendar
 * @param {string} period the period that was selected by the user
 * @param {Moment} now the actual given time
 * @param {Moment} formattedDate the actual choosen date
 * @returns {string} the formatted text that will be displayed in the header of the calendar
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const displayCalendarHeaderPeriod = (period, now, formattedDate) => {
  switch (period) {
    case 'month':
      return formattedDate.format('MMMM YYYY');
    case 'year':
      return formattedDate.format('YYYY');
    default:
      if (isSameWeek(now, formattedDate)) return 'Today';
      const startOfWeek = formattedDate.clone().startOf('week');
      const endOfWeek = formattedDate.clone().endOf('week');
      const startFormatted = isSameMonth(startOfWeek, endOfWeek)
        ? startOfWeek.format('DD')
        : isSameYear(startOfWeek, endOfWeek)
        ? startOfWeek.format('DD MM')
        : startOfWeek.format('DD MM YYYY');
      return `${startFormatted}-${endOfWeek.format('DD MMMM YYYY')}`;
  }
};

/**
 * Function used to modify a field of the event in the Event form
 * @param {Object} event the event input object we want to modify
 * @param {string} field the field (or action) of the input object we want to modify
 * @param {string|Object} value the new value we want to set or add to the field of the input object
 * @returns {Object} the updated event input object
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setFieldValue = (event, field, value) => {
  if (field === 'remove_participant') {
    event.guests = event.guests.filter(user => user.username !== value);
    event.attendees = event.attendees.filter(user => user.username !== value);
    event.participants = event.participants.filter(
      user => user.username !== value
    );

    return event;
  }
  if (field === 'participants') {
    const guest = event.guests.find(user => user._id === value._id);
    const attendee = event.attendees.find(user => user._id === value._id);

    if (!guest && !attendee) {
      event.guests.push(value);
      event.participants.push(value);
    }
    return event;
  }
  event[field] = value;
  return event;
};

/**
 * Reducer function used to update the event typed by the user in the event form
 * @param {Object} state the state object of the event input object
 * @param {Object} action object containing the type of action we want to apply to the state and the new value associated to this action
 * @returns {Object} an updated version of the state
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const formReducers = (state, action) => {
  let event = {
    title: '',
    description: '',
    beginningDate: '',
    beginningTime: '',
    endDate: '',
    endTime: '',
    attendees: [],
    guests: [],
    participants: [],
    ...state,
  };

  event.participants = [...event.guests, ...event.attendees];

  if (event.beginning) {
    const formattedBeginning = moment(event.beginning).tz('Europe/Zurich');
    event.beginningDate = formattedBeginning.format('YYYY-MM-DD');
    event.beginningTime = formattedBeginning.format('HH:mm');
    delete event.beginning;
  }
  if (event.end) {
    const formattedEnd = moment(event.end).tz('Europe/Zurich');
    event.endDate = formattedEnd.format('YYYY-MM-DD');
    event.endTime = formattedEnd.format('HH:mm');
    delete event.end;
  }

  const { type, payload } = action;

  if (type === 'init') return event;

  return setFieldValue(event, type, payload);
};
