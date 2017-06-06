//import insertParameter from '../../helpers/parameter';
import axios from 'axios';
import moment from 'moment';

export const ADS_LIST = 'ADS_LIST';

export const ADS_DETAIL = 'ADS_DETAIL';

/**
 * get detail category
 * @Mith
 */
const ADS_LIST_URL = '//id.adsplay.net/ads/api-roles-ads/list';
const ADS_DETAIL_URL = '//id.adsplay.net/ads/api-roles-ads/detail';


const statuses = {0: 'Invalid', 1: 'Pending', 2: 'Running', 3: 'Finished', 4: 'Expired'};
/* Detail Category - Mith */
export function fetchAdsList() {

    return function (dispatch) {

        dispatch({
            type: ADS_LIST,
            payload: {data: [], loading: true}
        })

        return axios.get(ADS_LIST_URL)   
                .then(function (response) {
                    var result = response.data;
                    var data = [];

                    for(var i in result){
                        data.push({
                            id: result[i].id,
                            name: result[i].name,
                            bookingTime: moment(new Date(result[i].runDate)).format('YYYY-MM-DD') + " ➡ " + moment(new Date(result[i].expiredDate)).format('YYYY-MM-DD'),
                            status: statuses[result[i].status]
                        })
                    }

                    dispatch({
                        type: ADS_LIST,
                        payload: {data: data, loading: false}
                    })
                });
    }
}

export function fetchAdsDetail(id) {

    return function (dispatch) {

        dispatch({
            type: ADS_DETAIL,
            payload: {data: {}, loading: true}
        })

        return axios.get(ADS_DETAIL_URL+'/'+id)   
                .then(function (response) {
                    var result = response.data;
                    var data = {};
                    data.id = result.id;
                    data.name = result.name;
                    data.media = result.media;
                    data.createdDate = moment(new Date(result.crtDateL)).format("YYYY-MM-DD");
                    data.runDate = moment(new Date(result.runDateL)).format("YYYY-MM-DD");
                    data.expiredDate = moment(new Date(result.expDateL)).format("YYYY-MM-DD");

                    dispatch({
                        type: ADS_DETAIL,
                        payload: {data: data, loading: false}
                    })
                });
    }
}
