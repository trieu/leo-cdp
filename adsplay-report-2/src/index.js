import React from 'react';
import {render} from 'react-dom';
import Routes from './routes';

//Import redux
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import allReducers from './reducers/index';

const store = createStore(
    allReducers,
    (typeof(process.env.NODE_ENV) != '' && process.env.NODE_ENV == 'development') ? 
    applyMiddleware(promise, thunk, createLogger()) : applyMiddleware(promise, thunk)
);

render(
    <Provider store={store}>
        {Routes}
    </Provider>,
    document.getElementById('root')
);