import { SEARCH_FILM } from './_Action';

const INITIAL_STATE = { film: [] };

export default function (state = INITIAL_STATE, action) {
    
    switch (action.type) {        
        case SEARCH_FILM:
            return { ...state, film: action.payload.data};
        default:
            return state;
    }
}
