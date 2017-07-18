import axios from 'axios';

export const DETAIL_CATEGORY = 'DETAIL_CATEGORY';

const DETAIL_CATEGORY_URL = '//api4report.adsplay.net/api/rvnmedia';

/* Detail Category - Mith */
export function fetchDetailCategory(dataSources, startDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    //var nameMedia = "";
    var bySource = "&source=" + dataSources || "";
    var url = DETAIL_CATEGORY_URL +'/detailreport?startDate='+ startDate + '&endDate='+ endDate + limit + bySource;    

    return function (dispatch) {

        dispatch({
            type: DETAIL_CATEGORY,
            payload: {data: [], loading: true}
        })

        return axios.get(url)   
                .then(function (response) {

                    var result = response.data;
                    var data = [];
                    var csv = [];
                    //csv.push(["name", "category", "playview", "impression", "trueview", "click", "revenue"]);
                    for(var i in result){
                        
                        data.push({
                            name: result[i].video_title,
                            category: result[i].category,
                            playview: result[i].sumPlayView,
                            impression: result[i].sumImpression,
                            trueview: result[i].sumTrueView,
                            click: result[i].sumClick,
                            revenue: result[i].revenueValue
                        });

                        //csv.push([result[i].video_title, result[i].category, result[i].sumPlayView, result[i].sumImpression, result[i].sumTrueView, result[i].sumClick, result[i].revenueValue]);
                    }

                    dispatch({
                        type: DETAIL_CATEGORY,
                        payload: {data: data, loading: false}
                    })
                });
    }
}