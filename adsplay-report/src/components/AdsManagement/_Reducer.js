import { ADS_LIST } from './_Action';
import { ADS_DETAIL } from './_Action';

const INITIAL_STATE = { adsList: [], adsDetail: {} };

export default function (state = INITIAL_STATE, action) {
    
    switch (action.type) {        
        case ADS_LIST:
            return { ...state, adsList: action.payload.data};
        case ADS_DETAIL:
            return { ...state, adsDetail: action.payload.data};
        default:
            return state;
    }
}
