import { CHART_CATEGORY, CHART_PLATFORM, CHART_TOP_VIEW, CHART_TOP_CATEGORY, CHART_DETAIL_FILM } from './action';

const INITIAL_STATE = { category: {}, platform: {}, topview: {}, topcategory: {}, detailfilm: {}};

export default function (state = INITIAL_STATE, action) {
    
    switch (action.type) {
        case CHART_CATEGORY:
            return { ...state, category: action.payload.data, loading_category: action.payload.loading };
        case CHART_PLATFORM:
            return { ...state, platform: action.payload.data, loading_platform: action.payload.loading};
        case CHART_TOP_VIEW:
            return { ...state, topview: action.payload.data, loading_topview: action.payload.loading };
        case CHART_TOP_CATEGORY:
            return { ...state, topcategory: action.payload.data, loading_topcategory: action.payload.loading };
        case CHART_DETAIL_FILM:
            return { ...state, detailfilm: action.payload.data, loading_detailfilm: action.payload.loading };
        default:
            return state;
    }
}
