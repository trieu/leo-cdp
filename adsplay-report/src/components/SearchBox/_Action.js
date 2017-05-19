//import insertParameter from '../../helpers/parameter';
import axios from 'axios';

export const SEARCH_FILM = 'SEARCH_FILM';
/**
 * get detail category
 * @Mith
 */
const SEARCH_FILM_URL = '/api/search?video_title=';

/* Detail Category - Mith */
export function fetchSearch(videoNameTitle) {

    var search = (videoNameTitle) ? videoNameTitle : '';
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
                    var imageDefault = 'http://1.fwcdn.pl/po/52/73/615273/7382116.3.jpg';
                   
                    for(var i in result){
                        
                        data.push({
                            image: imageDefault,
                            contentId: result[i]._source.contentId,
                            name: result[i]._source.video_title,
                            category : result[i]._source.category,
                            playview : result[i]._source.sumPlayView.toLocaleString(),
                            // impression: result[i]._source.sumImpression.toLocaleString(),
                            // trueview: result[i]._source.sumTrueView.toLocaleString(),
                            // click: result[i]._source.sumClick.toLocaleString(),
                            // revenue: result[i]._source.revenueValue.toLocaleString(),
                        });
                    }

                    dispatch({
                        type: SEARCH_FILM,
                        payload: {data: data, loading: false}
                    })
                });
    }
}
