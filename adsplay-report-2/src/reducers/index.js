import {combineReducers} from 'redux';

import ChartsReducer from './Charts/reducer';
import DetailsReducer from './Details/reducer';

const rootReducer = combineReducers({
    charts: ChartsReducer,
    details: DetailsReducer,
});

export default rootReducer;