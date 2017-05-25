import { FETCH_PAGES, FETCH_PAGE, SEARCH_KEYWORD} from './action';

const INITIAL_STATE = { all: [], item: null, search: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_PAGE:
    return { ...state, item: action.payload.data };
  case FETCH_PAGES:
    return { ...state, all: action.payload.data };
  case SEARCH_KEYWORD:
    return { ...state, search: action.payload.data };
  default:
    return state;
  }
}
