//import insertParameter from '../../helpers/parameter';
import axios from 'axios';
import moment from 'moment';
import {getCookie} from '../../components/Helpers/Cookie';

export const ADS_LIST = 'ADS_LIST';

export const ADS_DETAIL = 'ADS_DETAIL';

/**
 * get detail category
 * @Mith
 */
const access_token = getCookie('user_token');
const ADS_LIST_URL = '//id.adsplay.net/ads/api-roles-ads/list?access_token='+access_token;
const ADS_DETAIL_URL = '//id.adsplay.net/ads/api-roles-ads/detail?access_token='+access_token;


const statuses = {0: 'Không hợp lệ', 1: 'Chờ duyệt', 2: 'Đã duyệt', 3: 'Kết thúc', 4: 'Hết hạn'};
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

        return axios.get(ADS_DETAIL_URL+'&id='+id)   
                .then(function (response) {
                    var result = response.data;
                    var data = {};
                    data.id = result.id;
                    data.name = result.name;
                    data.media = result.media;
                    data.totalBooking = result.tBk;
                    data.dailyBooking = result.dBk;
                    data.createdDate = moment(new Date(result.crtDateL)).format("YYYY-MM-DD");
                    data.runDate = moment(new Date(result.runDateL)).format("YYYY-MM-DD");
                    data.expiredDate = moment(new Date(result.expDateL)).format("YYYY-MM-DD");
                    data.status = statuses[result.status]

                    dispatch({
                        type: ADS_DETAIL,
                        payload: {data: data, loading: false}
                    })
                });
    }
}
