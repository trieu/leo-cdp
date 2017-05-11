//import insertParameter from '../../helpers/parameter';
import axios from 'axios';

export const SEARCH_FILM = 'SEARCH_FILM';
/**
 * get detail category
 * @Mith
 */
const SEARCH_FILM_URL = '/apidemo';

/* Detail Category - Mith */
export function fetchSearch(s) {

    var search = (limit) ? '&s='+s : '';
    var url = SEARCH_FILM_URL + search;    

    return function (dispatch) {

        //preload
        dispatch({
            type: SEARCH_FILM,
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
                        type: SEARCH_FILM,
                        payload: {data: data, loading: false}
                    })
                });
    }
}
