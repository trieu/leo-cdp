import { CHART_CATEGORY, CHART_PLATFORM, CHART_TOP_VIEW, CHART_TOP_CATEGORY } from './_Action';

const INITIAL_STATE = { category: [], platform: [], topview: [], topcategory: [] };

export default function (state = INITIAL_STATE, action) {
    
    switch (action.type) {
        case CHART_CATEGORY:
            return { ...state, category: action.payload.data, loading_category: action.payload.loading };
        case CHART_PLATFORM:
            return { ...state, platform: action.payload.data, loading_platform: action.payload.loading, sum: action.payload.sum};
        case CHART_TOP_VIEW:
            return { ...state, topview: action.payload.data, loading_topview: action.payload.loading };
        case CHART_TOP_CATEGORY:
            return { ...state, topcategory: action.payload.data, loading_topcategory: action.payload.loading };
        default:
            return state;
    }
}
