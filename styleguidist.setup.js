import selectStyles from './src/components/TeachingDemands/SendTeachingDemandForm/SendTeachingDemandForm.module.scss';
import store from './src/store/store';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

global.React = React;
global.Provider = Provider;
global.store = store;
global.BrowserRouter = BrowserRouter;
global.teachers = [
  {
    _id: '642ad62e06c7aa90eea45cd9',
    email: 'werner96@hotmail.com',
    username: 'werner96',
    firstname: 'Werner',
    lastname: 'Schmid',
    photo: 'https://learnathome.blob.core.windows.net/public/default.jpg',
    role: 'student',
  },
  {
    _id: '64637702083e8c602f88c7ef',
    email: 'werner97@hotmail.com',
    username: 'werner97',
    firstname: 'Werner',
    lastname: 'Schmid',
    photo: 'https://learnathome.blob.core.windows.net/public/default.jpg',
    role: 'student',
  },
];
global.selectStyles = selectStyles;
