package net.adsplay.common;

/**
 * Created by trieu on 11/3/16.
 */

public class AdDataLoader {

    public static AdData get(int placementId){
        //String media = "https://ads-cdn.fptplay.net/static/ads/demo/toshiba-truehome-360p.mp4";
        String media = "https://img.bluehost.com/300x50/bh_300x50_03.gif";

        AdData adData = new AdData(123
                , media
                ,"TOSHIBA True Home - Tổ ấm trọn niềm vui"
                ,"https://www.toshiba.com.vn"
        );
        return adData;
    }
}
