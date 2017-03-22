import {combineReducers} from 'redux';

import ChartsReducer from './components/Charts/_Reducer';

const rootReducer = combineReducers({
  charts: ChartsReducer
});

export default rootReducer;
