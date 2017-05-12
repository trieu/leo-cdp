import {combineReducers} from 'redux';

import ChartsReducer from './components/Charts/_Reducer';
import TotalReducer from './components/Total/_Reducer';
import TableReducer from './components/Table/_Reducer';
import SearchReducer from './components/SearchBox/_Reducer';

const rootReducer = combineReducers({
  charts: ChartsReducer,
  totals: TotalReducer,
  details: TableReducer,
  search: SearchReducer
});

export default rootReducer;
