//import insertParameter from '../../helpers/parameter';
import axios from 'axios';

export const DETAIL_CATEGORY = 'DETAIL_CATEGORY';
/**
 * get detail category
 * @Mith
 */
const DETAIL_CATEGORY_URL = '//360.adsplay.net/api/rvnmedia';

/* Detail Category - Mith */
export function fetchDetailCategory(sourceMedia,beginDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    //var nameMedia = "";
    var bySource = ""
    if(sourceMedia != ""){
       // nameMedia = "bysource";
        bySource = "&source=" + sourceMedia;
    }
    var url = DETAIL_CATEGORY_URL +'/detailreport?startDate='+ beginDate + '&endDate='+ endDate + limit + bySource;    

    return function (dispatch) {

        dispatch({
            type: DETAIL_CATEGORY,
            payload: {data: [], loading: true}
        })

        return axios.get(url)   
                .then(function (response) {

                    var result = response.data;
                    var data = [];
                   
                    for(var i in result){
                        
                            data.push({
                                name : result[i].video_title,
                                category : result[i].category,
                                playview : result[i].sumPlayView.toLocaleString(),
                                impression: result[i].sumImpression.toLocaleString(),
                                trueview: result[i].sumTrueView.toLocaleString(),
                                click: result[i].sumClick.toLocaleString(),
                                revenue: result[i].revenueValue.toLocaleString()
                            });
                    }

                    dispatch({
                        type: DETAIL_CATEGORY,
                        payload: {data: data, loading: false}
                    })
                });
    }
}
