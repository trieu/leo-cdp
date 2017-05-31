import axios from 'axios';

export const DETAIL_CATEGORY = 'DETAIL_CATEGORY';

const DETAIL_CATEGORY_URL = '//api4report.adsplay.net/api/rvnmedia';

/* Detail Category - Mith */
export function fetchDetailCategory(sourceMedia,beginDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    //var nameMedia = "";
    var bySource = ""
    if(sourceMedia != ""){
        sourceMedia = (sourceMedia == "admin" || sourceMedia == "superadmin") ? "all" : "danet-mienphi";
       // nameMedia = "bysource";
        bySource = "&source=" + sourceMedia;
    }
    var url = DETAIL_CATEGORY_URL +'/detailreport?startDate='+ beginDate + '&endDate='+ endDate + limit + bySource;    

    return function (dispatch) {

        dispatch({
            type: DETAIL_CATEGORY,
            payload: {data: {}, loading: true}
        })

        return axios.get(url)   
                .then(function (response) {

                    var result = response.data;
                    var data = {};
                    data.label = ['name', 'category', 'playview', 'impression', 'trueview', 'click', 'revenue'];
                    data.data = [];

                    for(var i in result){
                        
                        data.data.push([
                            result[i].video_title,
                            result[i].category,
                            result[i].sumPlayView.toLocaleString(),
                            result[i].sumImpression.toLocaleString(),
                            result[i].sumTrueView.toLocaleString(),
                            result[i].sumClick.toLocaleString(),
                            result[i].revenueValue.toLocaleString()
                        ]);
                    }

                    console.log(data)
                    dispatch({
                        type: DETAIL_CATEGORY,
                        payload: {data: data, loading: false}
                    })
                });
    }
}