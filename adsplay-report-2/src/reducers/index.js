import {combineReducers} from 'redux';

import PagesReducer from './test/reducer';

const rootReducer = combineReducers({
    pages: PagesReducer
});

export default rootReducer;