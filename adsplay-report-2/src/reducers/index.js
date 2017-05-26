import {combineReducers} from 'redux';

import ChartsReducer from './Charts/reducer';

const rootReducer = combineReducers({
    charts: ChartsReducer,
});

export default rootReducer;