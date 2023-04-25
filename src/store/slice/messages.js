/**
 * Messages slice of the redux store
 * @module store
 */
import { getTotalUnreadMessages } from '../../utils/api';
import { createSlice } from '@reduxjs/toolkit';

/**
 * The messages store object
 * @typedef MessagesInitialState
 * @property {number} totalUnread - the total number of unread messages of the user
 *
 * The initial state for the messages store of the user
 * @type {MessagesInitialState}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const initialState = {
  totalUnread: -1,
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
