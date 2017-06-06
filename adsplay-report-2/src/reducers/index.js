import {combineReducers} from 'redux';

import ChartsReducer from './Charts/reducer';
import DetailsReducer from './Details/reducer';
import adsReducer from './Ads/reducer';

const rootReducer = combineReducers({
    charts: ChartsReducer,
    details: DetailsReducer,
    ads: adsReducer
});

export default rootReducer;