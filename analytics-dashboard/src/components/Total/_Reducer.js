import { TOTAL } from './_Action';

const INITIAL_STATE = {sum: {
                            sumPlayView: 0,
                            sumImpression: 0,
                            sumTrueView: 0,
                            sumClick: 0,
                            revenueValue: 0
                        }};

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {
      case TOTAL:
            return { ...state, sum: action.payload.sum};
        default:
            return state;
    }
}
