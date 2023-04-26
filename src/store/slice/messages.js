/**
 * Messages slice of the redux store
 * @module store
 */
import {
  getConversation,
  getLastMessage,
  getLastMessages,
  getTotalUnreadMessages,
  getUnread,
  readMessage,
  sendMessage,
  sendMessageWithFiles,
} from '../../utils/api';
import { createSlice } from '@reduxjs/toolkit';

/**
 * The messages store object
 * @typedef MessagesInitialState
 * @property {number} totalUnread - the total number of unread messages of the user
 * @property {Object[]} lasts - the array of last messages retrieved from all the conversations of the connected user
 * @property {Object[]} displayed - the array of displayed last messages from the searched conversations
 * @property {Object[]} messages - the array of messages of the currently opened conversation
 * @property {boolean} loading - the loading state of the application when retrieving the first messages from an open conversation
 * @property {boolean} loadPage - the loading state of the application when retrieving older messages pages from an open conversation
 * @property {number} page - the last retrieved page in an opened conversation
 * @property {string} searchedUsername - the currently searched username filter for the array of last conversations
 * @property {Object} notification - the currently message received message setted as a notification in the screen
 * @property {Object[]} messageUnreads - the array of number of unread messages for each existing conversation of the user
 *
 * The initial state for the messages store of the user
 * @type {MessagesInitialState}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const initialState = {
  totalUnread: -1,
  lasts: undefined,
  displayed: undefined,
  messages: undefined,
  loading: false,
  loadPage: false,
  page: 1,
  searchedUsername: '',
  notification: undefined,
  messageUnreads: [],
};

/**
 * The slice of the store representing the messages state
 * @type {Slice<MessagesInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setTotalUnread(state, action) {
      const { payload: totalUnread } = action;
      state.totalUnread = totalUnread;
    },
    setLastMessages(state, action) {
      const { payload: messages } = action;
      state.lasts = messages;
      state.displayed = messages;
      state.searchedUsername = '';
    },
    setLastMessage(state, action) {
      const {
        payload: { message, userId },
      } = action;

      const conversation = state.lasts?.find(mess => {
        return mess.sender === userId || mess.receiver === userId;
      });

      if (conversation) {
        conversation.sender = message.sender;
        conversation.receiver = message.receiver;
        conversation.sent = message.sent;
        conversation.files = message.files;
        conversation.content = message.content;
        conversation.read = message.read;
      }

      const displayedConversation = state.displayed?.find(mess => {
        return mess.sender === userId || mess.receiver === userId;
      });

      if (displayedConversation) {
        displayedConversation.sent = message.sent;
        displayedConversation.files = message.files;
        displayedConversation.content = message.content;
        displayedConversation.read = message.read;
      }
    },
    setConversationStatus(state, action) {
      const { payload: userId } = action;
      state.lasts.forEach(conversation => {
        if (userId === conversation.sender) conversation.read = true;
      });
    },
    setMessages(state, action) {
      const { payload: messages } = action;
      state.messages = messages;
    },
    setInvalid(state) {
      state.messages = undefined;
    },
    setLoading(state, action) {
      const { payload: status } = action;
      state.loading = status;
    },
    setLoadPage(state, action) {
      const { payload: status } = action;
      state.loadPage = status;
    },
    addMessage(state, action) {
      const { payload: message } = action;
      state.messages.unshift(message);
    },
    loadPreviousMessages(state, action) {
      const { payload: messages } = action;
      messages.forEach(message => {
        state.messages.push(message);
      });
    },
    setPage(state, action) {
      const { payload: page } = action;
      state.page = page;
    },
    searchUsername(state, action) {
      const {
        payload: { connectedUser, username },
      } = action;
      if (username.length === 0) state.displayed = state.lasts;
      else if (username.slice(0, -1) === state.searchedUsername)
        state.displayed = state.displayed.filter(conversation => {
          const {
            _id: { sender, receiver },
          } = conversation;
          const other = sender === connectedUser ? receiver : sender;
          return other.includes(username);
        });
      else
        state.displayed = state.lasts.filter(conversation => {
          const {
            _id: { sender, receiver },
          } = conversation;
          const other = sender === connectedUser ? receiver : sender;
          return other.includes(username);
        });
    },
    setNotification(state, action) {
      const { payload: message } = action;
      state.notification = message;
    },
    hideNotification(state) {
      state.notification = undefined;
    },
    setTotalUnreadConversation(state, action) {
      const {
        payload: { sender, receiver, count: totalUnread },
      } = action;

      const conversation = state.messageUnreads?.find(mess => {
        const { sender: messSender, receiver: messReceiver } = mess;
        return messSender === sender && messReceiver === receiver;
      });

      if (conversation) conversation.totalUnread = totalUnread;
      else state.messageUnreads.push({ sender, receiver, totalUnread });
    },
    incrementTotalUnreadConversation(state, action) {
      const {
        payload: { sender, receiver },
      } = action;

      const conversation = state.messageUnreads?.find(mess => {
        const { sender: messSender, receiver: messReceiver } = mess;
        return messSender === sender && messReceiver === receiver;
      });

      if (conversation) conversation.totalUnread += 1;
    },
  },
});

/**
 * The actions associated with the messages state
 * @type {CaseReducerActions<MessagesInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const messagesActions = messagesSlice.actions;

/**
 * The reducer associated with the messages state
 * @type {Reducer<MessagesInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const messagesReducer = messagesSlice.reducer;

export default messagesReducer;

/**
 * Async function used to get the total number of unread messages for the logged user
 * @param {string} token the jwt token of the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated a authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getTotalUnread = async (token, dispatch) => {
  const { count, valid, authorized } = await getTotalUnreadMessages(token);

  if (valid) dispatch(messagesActions.setTotalUnread(count));
  else dispatch(messagesActions.setTotalUnread(-2));

  return authorized;
};

/**
 * Async function used to retrieve all conversations and last messages for the connected user
 * @param {string} token the jwt token of the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated a authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getLastConversations = async (token, dispatch) => {
  const { valid, authorized, messages } = await getLastMessages(token);

  if (valid) dispatch(messagesActions.setLastMessages(messages));

  return authorized;
};

/**
 * Async function used to retrieve a conversation and its last message with a specific user
 * @param {string} token the jwt token of the connected user
 * @param {string} userId the id of the user from which we want to retrieve the last conversation
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated a authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getLastConversation = async (token, userId, dispatch) => {
  const { valid, authorized, message } = await getLastMessage(token, userId);

  if (valid) dispatch(messagesActions.setLastMessage({ userId, message }));

  return authorized;
};

/**
 * Async function used to get the messages from a conversation between the connected user and another one
 * @param {string} token the jwt token of the connected user
 * @param {string} userId the id of the user from which we want to retrieve the messages
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @param {number} page the page we want to retrieve
 * @param {number} limit the number of elements per page we want to retrieve
 * @returns {Promise<boolean>} false if the request generated a authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getMessages = async (
  token,
  userId,
  dispatch,
  page = 1,
  limit = 10
) => {
  if (page === 1) dispatch(messagesActions.setLoading(true));
  else dispatch(messagesActions.setLoadPage(true));
  const { valid, authorized, messages } = await getConversation(
    token,
    userId,
    page,
    limit
  );
  if (valid) {
    const newMessages = await Promise.all(
      messages.map(async message => {
        const { _id: messageId } = message;
        const {
          sender: { _id: sender },
        } = message;

        if (sender === userId) {
          const {
            valid,
            authorized,
            message: returnedMessage,
          } = await readMessage(token, messageId);
          if (valid && authorized) message.read = returnedMessage.read;
        }
        return message;
      })
    );

    const { count } = await getTotalUnreadMessages(token);

    if (page === 1) dispatch(messagesActions.setMessages(newMessages));
    else dispatch(messagesActions.loadPreviousMessages(newMessages));
    dispatch(messagesActions.setTotalUnread(count));
    dispatch(messagesActions.setPage(page + 1));
  } else {
    if (page === 1) dispatch(messagesActions.setInvalid());
    else dispatch(messagesActions.setPage(-1));
  }

  if (page === 1) dispatch(messagesActions.setLoading(false));
  else dispatch(messagesActions.setLoadPage(false));
  return { valid, authorized };
};

/**
 * Function used to handle the selection of a conversation and change its status to read
 * @param {Object} user the user for which we selected a conversation
 * @param {*} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const selectConversation = (user, dispatch) => {
  const { id: userId } = user;

  dispatch(messagesActions.setConversationStatus(userId));
};

/**
 * Async function used to send a message to another user and store it in the store if the process happened successfully
 * @param {string} token the jwt token of the connected user
 * @param {string} userId the id of the user to which we want to send a message
 * @param {string} message the content of the message we want to send
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<Object>} a promise returning the sent message and its property if the sending happened successfully
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const addMessage = async (token, userId, message, dispatch) => {
  const {
    valid,
    authorized,
    message: returnedMessage,
  } = await sendMessage(token, userId, message);

  if (valid) dispatch(messagesActions.addMessage(returnedMessage));

  return { valid, authorized, message: returnedMessage };
};

/**
 * Async function used to send a message (with a file) to another user
 * @param {string} token the jwt token of the connected user
 * @param {string} userId the id of the user to which we want to send a message
 * @param {FormData} data The data (content and files) we want to send to another user
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<Object>} a promise returning the sent message and its property if the sending happened successfully
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const addMessageWithFiles = async (token, userId, data, dispatch) => {
  const { valid, authorized, message } = await sendMessageWithFiles(
    token,
    userId,
    data
  );

  if (valid) dispatch(messagesActions.addMessage(message));

  return { valid, authorized, message };
};

/**
 * Function used to store a received message into the store of the application
 * @param {Object} message the message sent to the connected user
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const receiveMessage = (message, dispatch) => {
  dispatch(messagesActions.addMessage(message));
};

/**
 * Function used to search a conversation with a username matching the one given in the search input
 * @param {string} connectedUser the username of the connected user
 * @param {string} username the username of the other user we are searching in the input
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const search = (connectedUser, username, dispatch) => {
  dispatch(messagesActions.searchUsername({ connectedUser, username }));
};

/**
 * Function used to store a received message as a notification and delete it after 3.5s
 * @param {Object} message the message we want to display as a notification
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const notifyMessage = (message, dispatch) => {
  dispatch(messagesActions.setNotification(message));

  setTimeout(() => {
    dispatch(messagesActions.hideNotification());
  }, 3500);
};

/**
 * Async function used to get the number of unread message for a specific conversation
 * @param {*} token
 * @param {string} sender the sender of the last message of the conversation
 * @param {string} receiver the receiver of the last message of the conversation
 * @param {string} userId the id of the user (receiver or sender) from which we want to retrieve the number of unread messages
 * @param {Function} dispatch the dispatcher function used to modify the store
 * @returns {Promise<boolean>} false if the request generated a authorization status code from the server, true otherwise
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getUnreadForConversation = async (
  token,
  sender,
  receiver,
  userId,
  dispatch
) => {
  const { valid, authorized, count } = await getUnread(token, userId);

  if (valid)
    dispatch(
      messagesActions.setTotalUnreadConversation({ sender, receiver, count })
    );

  return authorized;
};

/**
 * Function used to modify the total of unread messages in a specific conversation
 * @param {string} sender the sender of the last message of the conversation
 * @param {string} receiver the receiver of the last message of the conversation
 * @param {number} count the new value of the number of unread messages in the conversation
 * @param {Function} dispatch the dispatcher function used to modify the store
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setConversationUnread = (sender, receiver, count, dispatch) => {
  dispatch(
    messagesActions.setTotalUnreadConversation({ sender, receiver, count })
  );
};

export const incrementConversationUnread = (sender, receiver, dispatch) => {
  dispatch(
    messagesActions.incrementTotalUnreadConversation({ sender, receiver })
  );
};
