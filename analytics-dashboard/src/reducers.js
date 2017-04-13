import {combineReducers} from 'redux';

import ChartsReducer from './components/Charts/_Reducer';
import TotalReducer from './components/Total/_Reducer';

const rootReducer = combineReducers({
  charts: ChartsReducer,
  totals: TotalReducer
});

export default rootReducer;
