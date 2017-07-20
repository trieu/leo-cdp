/**
 * Created by trieu on 5/27/15.
 */

module.exports = {
    base_domain : 'https://monitor.adsplay.net'
    , api_domain :  'http://api.adsplay.net'
    , ssl_api_domain :  'https://api.adsplay.net'
    , static_domain: 'https://monitor.adsplay.net'
    , ads_cdn_domain: 'https://ads-cdn.fptplay.net/static/ads/instream'

    , api_paytv: 'https://fbox-partners.fpt.vn',

    sso: {
        sso_url: "http://id.adsplay.net",
        sso_url_ssl: "https://id.adsplay.net", 
        callback_url: "/callback"
    }

    , ftp_video: {
    	host: "118.69.184.35",
        port: 21, 
        user: "adsplay", 
        pass: "adsplay@321#"
    }
};