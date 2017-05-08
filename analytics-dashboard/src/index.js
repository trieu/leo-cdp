import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

import React from 'react';
import {render} from 'react-dom';
import Routes from './routes';

//Import redux
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import allReducers from './reducers';

//const logger = createLogger();
const store = createStore(
    allReducers,
    applyMiddleware(thunk, promise)
);

render(
    <Provider store={store}>
        {Routes}
    </Provider>,
    document.getElementById('root')
);
