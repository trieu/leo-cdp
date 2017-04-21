//import insertParameter from '../../helpers/parameter';
import axios from 'axios';

export const TOTAL = 'TOTAL';

/**
 * Lấy thống kê số feed các pages hiện có
 * Top 10 feed sắp xếp Like ở 1 page
 * Search 20 feed ở page theo 1 từ khóa
 */
const TOTAL_URL = '//360.adsplay.net/api/rvnmedia/summingreport';
  // var url = '//360.adsplay.net/api/platformview/report?startDate=2017-04-03&endDate=2017-04-11&limit=10';

export function fetchTotal(sourceMedia, beginDate, endDate) {

    var bySource = "&source=";
    if(sourceMedia == "all"){
        bySource = "&source=all";
    }
    else{
        bySource = "&source=" + sourceMedia;
    }
    var url = TOTAL_URL +'?startDate='+ beginDate + '&endDate='+ endDate + bySource;
    return function (dispatch) {

        dispatch({
            type: TOTAL,
            payload: {
                        sum: {
                            sumPlayView: 0,
                            sumImpression: 0,
                            sumTrueView: 0,
                            sumClick: 0,
                            revenueValue: 0
                        }
                    }
        })

        console.log(url)
        return axios.get(url)
                .then(function (response) {
                    var result = response.data;
                    console.log(result)
                    dispatch({
                        type: TOTAL,
                        payload: {sum: result}
                    })
                });
    }
}