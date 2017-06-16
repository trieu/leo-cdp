//import insertParameter from '../../helpers/parameter';
import axios from 'axios';

export const CHART_CATEGORY = 'CHART_CATEGORY';
export const CHART_PLATFORM = 'CHART_PLATFORM';
export const CHART_TOP_VIEW = 'CHART_TOP_VIEW';
export const CHART_TOP_CATEGORY = 'CHART_TOP_CATEGORY';
export const CHART_DETAIL_FILM = 'CHART_DETAIL_FILM';

/**
 * Lấy thống kê số feed các pages hiện có
 * Top 10 feed sắp xếp Like ở 1 page
 * Search 20 feed ở page theo 1 từ khóa
 */
const CHART_CATEGORY_URL = '//api4report.adsplay.net/api/categoryview';
const CHART_PLATFORM_URL = '//api4report.adsplay.net/api/platformview';
const CHART_TOP_VIEW_URL = '//api4report.adsplay.net/api/contentview';
const CHART_TOP_CATEGORY_URL = '//api4report.adsplay.net/api/contentviewbycategory';


export function fetchCategory(dataSources, startDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    var nameMedia = "";
    var bySource = ""
    if(dataSources != "all"){
        nameMedia = "bysource";
        bySource = "&source=" + dataSources;
    }

    var url = CHART_CATEGORY_URL + nameMedia+'/report?startDate='+ startDate + '&endDate='+ endDate + limit + bySource;
    return function (dispatch) {

        dispatch({
            type: CHART_CATEGORY,
            payload: {data: {}, loading: true}
        })

        return axios.get(url)
                .then(function (response) {

                    var result = response.data;
                    var data = {};
                        data.series = [];
                        data.legendNames = [];

                    for(var i in result){
                        
                        if(result[i].category != 'VOD_FROM_MOBILE'){
                            
                            data.series.push({
                                meta:result[i].category,
                                data:result[i].contentView
                            });
                            data.legendNames.push(result[i].category);
                        }
                    }

                    dispatch({
                        type: CHART_CATEGORY,
                        payload: {data: data, loading: false}
                    })
                });
    }
}


export function fetchPlatform(dataSources, startDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    var nameMedia = "";
    var bySource = ""
    if(dataSources != "all"){
        nameMedia = "bysource";
        bySource = "&source=" + dataSources;
    }

    var url = CHART_PLATFORM_URL + nameMedia+'/report?startDate='+ startDate + '&endDate='+ endDate + limit + bySource;

    return function (dispatch) {

        dispatch({
            type: CHART_PLATFORM,
            payload: {data: {}, loading: true}
        })

        return axios.get(url)
                .then(function (response) {

                    var result = response.data;
                    var data = {};
                        data.series = [];
                        data.legendNames = [];
                    for(var i in result){
                        data.series.push({
                            meta:result[i].platformName,
                            data:result[i].contentView,
                        });
                        data.legendNames.push(result[i].platformName);
                    }

                    dispatch({
                        type: CHART_PLATFORM,
                        payload: {data: data, loading: false}
                    })
                });
    }
}


export function fetchTopView(dataSources, startDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=20';
    var nameMedia = "";
    var bySource = ""
    if(dataSources != "all"){
        nameMedia = "bysource";
        bySource = "&source=" + dataSources;
    }

    var url = CHART_TOP_VIEW_URL + nameMedia+'/report?startDate='+ startDate + '&endDate='+ endDate + limit + bySource;

    return function (dispatch) {

        dispatch({
            type: CHART_TOP_VIEW,
            payload: {data: {}, loading: true}
        })

        return axios.get(url)
                .then(function (response) {
                    var result = response.data;
                    var data = {};
                        data.series = [];
                        data.labels = [];
                    for(var i = result.length; i--;){
                        data.series.push({
                            meta:result[i].videoTitle,
                            data:result[i].contentView,
                        });
                        data.labels.push(result[i].videoTitle);
                    }

                    dispatch({
                        type: CHART_TOP_VIEW,
                        payload: {data: data, loading: false}
                    })
                });
    }
}

export function fetchTopCategory(dataSources, startDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    var nameMedia = "";
    var bySource = ""
    if(dataSources != "all"){
        nameMedia = "source";
        bySource = "&source=" + dataSources;
    }

    var url = CHART_TOP_CATEGORY_URL + nameMedia+'/report?startDate='+ startDate + '&endDate='+ endDate + limit + bySource;

    return function (dispatch) {

        dispatch({
            type: CHART_TOP_CATEGORY,
            payload: {data: {}, loading: true}
        })

        return axios.get(url)
                .then(function (response) {
                    var result = response.data;
                    var data = {};
                        data.series = {};
                        data.select = [];
                    for(var i in result){
                        var key, seriesGroup = [];
                        for(var j = result[i].length; j--;){
                            key = result[i][j].rank;
                            seriesGroup.push({
                                meta:result[i][j].videoTitle,
                                data:result[i][j].contentView,
                            });
                        }
                        
                        data.series[key] = seriesGroup;
                        data.select.push({
                            key: key,
                            value: i
                        });
                    }
                    //console.log(data)

                    dispatch({
                        type: CHART_TOP_CATEGORY,
                        payload: {data: data, loading: false}
                    })
                });
    }
}
export function fetchDetailFilm(dataSources, startDate, endDate, limit) {

    var limit = (limit) ? '&limit='+limit : '&limit=10';
    var nameMedia = "";
    var bySource = ""
    if(dataSources != "all"){
        nameMedia = "bysource";
        bySource = "&source=" + dataSources;
    }

    var url = CHART_PLATFORM_URL + nameMedia+'/report?startDate='+ startDate + '&endDate='+ endDate + limit + bySource;

    return function (dispatch) {

        dispatch({
            type: CHART_DETAIL_FILM,
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
                        })
                    }

                    dispatch({
                        type: CHART_DETAIL_FILM,
                        payload: {data: data, loading: false}
                    })
                });
    }
}
