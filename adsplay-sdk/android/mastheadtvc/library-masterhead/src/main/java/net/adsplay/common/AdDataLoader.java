package net.adsplay.common;

/**
 * Created by trieu on 11/3/16.
 */

public class AdDataLoader {

    public static AdData get(int placementId){
        String media;
        if(placementId == 331){
            media = "https://ads-cdn.fptplay.net/static/ads/demo/toshiba-truehome-360p.mp4";
        } else {
            media = "https://adsplay.net/ads/banner/300x50-banner-size.jpg";
        }

        AdData adData = new AdData(123
                , media
                ,"TOSHIBA True Home - Tổ ấm trọn niềm vui"
                ,"https://www.toshiba.com.vn"
        );
        return adData;
    }
}
