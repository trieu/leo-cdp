import axios from 'axios';

export const FETCH_PAGES = 'FETCH_PAGES';
export const FETCH_PAGE = 'FETCH_PAGE';
export const SEARCH_KEYWORD = 'SEARCH_KEYWORD';

/**
 * Lấy thống kê số feed các pages hiện có
 * Top 10 feed sắp xếp Like ở 1 page
 * Search 20 feed ở page theo 1 từ khóa
 */
const ALL_PAGES_URL = 'https://fastdataapi.adsplay.net/analytics/fb_pages';
const TOP_FEED_URL = 'https://fastdataapi.adsplay.net/analytics/top10_feed_by_page';
const SEARCH_FEED_URL = 'https://fastdataapi.adsplay.net/analytics/search20_feed_by_page';

export function fetchPages() {
    const request = axios.get(`${ALL_PAGES_URL}`);

    return {
        type: FETCH_PAGES,
        payload: request
    };
}

export function fetchPage(id) {
    
    const request = axios.get(`${TOP_FEED_URL}/${id}`);

    return {
        type: FETCH_PAGE,
        payload: request
    };
}

export function searchKeyword(id, keyword) {
    var key = keyword[0].tag;
    const request = axios.get(`${SEARCH_FEED_URL}/${id}?keyword=${key}`);

    return {
        type: SEARCH_KEYWORD,
        payload: request
    };
}