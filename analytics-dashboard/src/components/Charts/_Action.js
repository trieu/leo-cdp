//import insertParameter from '../../helpers/parameter';
import axios from 'axios';

export const CHART_CATEGORY = 'CHART_CATEGORY';
export const CHART_PLATFORM = 'CHART_PLATFORM';
export const CHART_TOP_VIEW = 'CHART_TOP_VIEW';
export const CHART_TOP_CATEGORY = 'CHART_TOP_CATEGORY';

/**
 * Lấy thống kê số feed các pages hiện có
 * Top 10 feed sắp xếp Like ở 1 page
 * Search 20 feed ở page theo 1 từ khóa
 */
const CHART_CATEGORY_URL = '//360.adsplay.net/api/categoryview';
const CHART_PLATFORM_URL = '//360.adsplay.net/api/platformview';
const CHART_TOP_VIEW_URL = '//360.adsplay.net/api/contentview';
const CHART_TOP_CATEGORY_URL = '//360.adsplay.net/api/contentviewbycategory';


const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d','#a4de6c',
    '#d0ed57', '#FABFA1', '#B86A54', '#FE8A71', '#DC626F',
    '#FE6860', '#F3C9BF', '#C9C7AF', '#93BFB6', '#7CA39C',
    '#726680', '#779BF0', '#849FBB', '#C2B6D6', '#EBE1E2'];


export function fetchCategory(sourceMedia, beginDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    var nameMedia = "";
    var bySource = ""
    if(sourceMedia != "all"){
        nameMedia = "bysource";
        bySource = "&source=" + sourceMedia;
    }

    var url = CHART_CATEGORY_URL + nameMedia+'/report?startDate='+ beginDate + '&endDate='+ endDate + limit + bySource;
    return function (dispatch) {

        dispatch({
            type: CHART_CATEGORY,
            payload: {data: [], loading: true}
        })

        return axios.get(url)
                .then(function (response) {

                    var result = response.data;
                    var data = [];

                    for(var i in result){
                        if(result[i].category != 'VOD_FROM_MOBILE'){
                            data.push({
                                key:result[i].category,
                                value:result[i].contentView,
                                color:COLORS[i]
                            });
                        }
                    }

                    dispatch({
                        type: CHART_CATEGORY,
                        payload: {data: data, loading: false}
                    })
                });
    }
}


export function fetchPlatform(sourceMedia, beginDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    var nameMedia = "";
    var bySource = ""
    if(sourceMedia != "all"){
        nameMedia = "bysource";
        bySource = "&source=" + sourceMedia;
    }

    var url = CHART_PLATFORM_URL + nameMedia+'/report?startDate='+ beginDate + '&endDate='+ endDate + limit + bySource;

    return function (dispatch) {

        dispatch({
            type: CHART_PLATFORM,
            payload: {data: [], loading: true, sum: 0}
        })

        return axios.get(url)
                .then(function (response) {

                    var result = response.data;
                    var data = [];
                    var sum = 0;
                    for(var i in result){
                        sum += parseInt(result[i].contentView);
                        data.push({
                            key:result[i].platformName,
                            value:result[i].contentView,
                            color:COLORS[i]
                        })
                    }

                    dispatch({
                        type: CHART_PLATFORM,
                        payload: {data: data, loading: false, sum: sum}
                    })
                });
    }
}


export function fetchTopView(sourceMedia, beginDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    var nameMedia = "";
    var bySource = ""
    if(sourceMedia != "all"){
        nameMedia = "bysource";
        bySource = "&source=" + sourceMedia;
    }

    var url = CHART_TOP_VIEW_URL + nameMedia+'/report?startDate='+ beginDate + '&endDate='+ endDate + limit + bySource;

    return function (dispatch) {

        dispatch({
            type: CHART_TOP_VIEW,
            payload: {data: [], loading: true}
        })

        return axios.get(url)
                .then(function (response) {
                    var result = response.data;
                    var data = {};
                    var videoTitle = [];
                    var contentView = [];
                    for(var i in result){
                        if(result[i].videoCategory != 'VOD_FROM_MOBILE'){
                            videoTitle.push(result[i].videoTitle);
                            contentView.push(result[i].contentView);
                        }
                    }
                    data = {
                        labels: videoTitle,
                        datasets: [
                            {
                                label: 'View',
                                backgroundColor: "#83a6ed",
                                borderColor: "#83a6ed",
                                borderWidth: 1,
                                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                                hoverBorderColor: 'rgba(255,99,132,1)',
                                data: contentView,
                            }
                        ]
                    };

                    dispatch({
                        type: CHART_TOP_VIEW,
                        payload: {data: data, loading: false}
                    })
                });
    }
}

export function fetchTopCategory(sourceMedia, beginDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    var nameMedia = "";
    var bySource = ""
    if(sourceMedia != "all"){
        nameMedia = "source";
        bySource = "&source=" + sourceMedia;
    }

    var url = CHART_TOP_CATEGORY_URL + nameMedia+'/report?startDate='+ beginDate + '&endDate='+ endDate + limit + bySource;

    return function (dispatch) {

        dispatch({
            type: CHART_TOP_CATEGORY,
            payload: {data: [], loading: true}
        })

        return axios.get(url)
                .then(function (response) {

                    dispatch({
                        type: CHART_TOP_CATEGORY,
                        payload: {data: response.data, loading: false}
                    })
                });
    }
}
