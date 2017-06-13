import {combineReducers} from 'redux';

import ChartsReducer from './Charts/reducer';
import DetailsReducer from './Details/reducer';
import AdsReducer from './Ads/reducer';
import TotalsReducer from './Totals/reducer';

const rootReducer = combineReducers({
    charts: ChartsReducer,
    details: DetailsReducer,
    ads: AdsReducer,
    totals: TotalsReducer
});

export default rootReducer;