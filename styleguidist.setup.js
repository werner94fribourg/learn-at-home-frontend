import store from './src/store/store';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

global.React = React;
global.Provider = Provider;
global.store = store;
global.BrowserRouter = BrowserRouter;
