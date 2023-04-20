/**
 * Navbar slice of the redux store
 * @module store
 */
import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef NavbarInitialState
 * @property {boolean} isOpen - navbar opening status in the page
 * The initial state for the navbar store of the user
 * @type {NavbarInitialState}
 */
const initialState = { isOpen: false };

/**
 * The slice of the store representing the navbar state
 * @type {Slice<NavbarInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    setOpenState(state) {
      state.isOpen = !state.isOpen;
    },
  },
});

/**
 * The actions associated with the navbar state
 * @type {CaseReducerActions<NavbarInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const navbarActions = navbarSlice.actions;

/**
 * The reducer associated with the navbar state
 * @type {Reducer<NavbarInitialState>}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const navbarReducer = navbarSlice.reducer;

export default navbarReducer;
