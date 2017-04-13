//import insertParameter from '../../helpers/parameter';
import axios from 'axios';

export const TOTAL_PLAYVIEW = 'TOTAL_PLAYVIEW';
export const TOTAL_IMPRESSION = 'TOTAL_IMPRESSION';
export const TOTAL_COMPLETE_VIEW = 'TOTAL_COMPLETE_VIEW';

/**
 * Lấy thống kê số feed các pages hiện có
 * Top 10 feed sắp xếp Like ở 1 page
 * Search 20 feed ở page theo 1 từ khóa
 */
const TOTAL_PLATFORM_URL = '//360.adsplay.net/api/platformview';

export function fetchTotalPlayview(sourceMedia, beginDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    var nameMedia = "";
    var bySource = ""
    if(sourceMedia != "all"){
        nameMedia = "bysource";
        bySource = "&source=" + sourceMedia;
    }

    var url = '//360.adsplay.net/api/platformview/report?startDate=2017-04-03&endDate=2017-04-11&limit=10';
    return function (dispatch) {

        dispatch({
            type: TOTAL_PLAYVIEW,
            payload: {sum: 0}
        })

        return axios.get(url)
                .then(function (response) {
                    var result = response.data;
                    var sum = 0;
                    for(var i in result){
                        sum += parseInt(result[i].contentView);
                    }

                    dispatch({
                        type: TOTAL_PLAYVIEW,
                        payload: {sum: sum.toLocaleString()}
                    })
                });
    }
}
export function fetchTotalImpression(sourceMedia, beginDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    var nameMedia = "";
    var bySource = ""
    if(sourceMedia != "all"){
        nameMedia = "bysource";
        bySource = "&source=" + sourceMedia;
    }

    var url = '//360.adsplay.net/api/platformview/report?startDate=2017-04-03&endDate=2017-04-11&limit=10';
    return function (dispatch) {

        dispatch({
            type: TOTAL_IMPRESSION,
            payload: {sum: 0}
        })

        return axios.get(url)
                .then(function (response) {
                    var result = response.data;
                    var sum = 0;
                    for(var i in result){
                        sum += parseInt(result[i].contentView);
                    }

                    dispatch({
                        type: TOTAL_IMPRESSION,
                        payload: {sum: sum.toLocaleString()}
                    })
                });
    }
}
export function fetchTotalCompleteView(sourceMedia, beginDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    var nameMedia = "";
    var bySource = ""
    if(sourceMedia != "all"){
        nameMedia = "bysource";
        bySource = "&source=" + sourceMedia;
    }

    var url = '//360.adsplay.net/api/platformview/report?startDate=2017-04-03&endDate=2017-04-11&limit=10';
    return function (dispatch) {

        dispatch({
            type: TOTAL_COMPLETE_VIEW,
            payload: {sum: 0}
        })

        return axios.get(url)
                .then(function (response) {
                    var result = response.data;
                    var sum = 0;
                    for(var i in result){
                        sum += parseInt(result[i].contentView);
                    }

                    dispatch({
                        type: TOTAL_COMPLETE_VIEW,
                        payload: {sum: sum.toLocaleString()}
                    })
                });
    }
}
