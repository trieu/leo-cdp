import { DETAIL_CATEGORY } from './_Action';

const INITIAL_STATE = { detailcategory: [] };

export default function (state = INITIAL_STATE, action) {
    
    switch (action.type) {        
        case DETAIL_CATEGORY:
            return { ...state, detailcategory: action.payload.data};
        default:
            return state;
    }
}
