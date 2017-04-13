import { TOTAL_PLAYVIEW, TOTAL_IMPRESSION, TOTAL_COMPLETE_VIEW  } from './_Action';

const INITIAL_STATE = { total_playview: 0, total_impression: 0, total_complete_view:0};

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {
      case TOTAL_PLAYVIEW:
            return { ...state, total_playview: action.payload.sum};
      case TOTAL_IMPRESSION:
            return { ...state, total_impression: action.payload.sum};
      case TOTAL_COMPLETE_VIEW:
            return { ...state, total_complete_view: action.payload.sum};

        default:
            return state;
    }
}
