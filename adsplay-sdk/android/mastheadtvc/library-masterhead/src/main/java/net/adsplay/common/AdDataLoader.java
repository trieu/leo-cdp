package net.adsplay.common;

import android.util.Log;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by trieu on 11/3/16.
 */

public class AdDataLoader {

    static final String[] baseDeliveryUrls = {
            "http://d2.adsplay.net/vmap/ads",
            "http://d4.adsplay.net/vmap/ads",
            "http://d6.adsplay.net/vmap/ads",
    };

    /**
     *
     * uuid có value của device ID , ut là user type , placement là vị trí ID play Ad
     <br> ut=1 cho VIP User
     <br> ut=2 cho user đã login,
     <br> ut=3 cho free user, chưa login
     *
     * @param uuid
     * @param placementId
     * @param userType
     * @return
     */
    public static String getVastUrl(String contentId,String categoryId,String uuid, int placementId, int userType){
        int t = (int) (System.currentTimeMillis()/1000L);
        int s = baseDeliveryUrls.length;
        String baseUrl = baseDeliveryUrls[t % s];
        StringBuilder url = new StringBuilder(baseUrl);
        url.append("?placement=").append(placementId);
        url.append("&ctid=").append(contentId);
        url.append("&catid=").append(categoryId);
        url.append("&uuid=").append(uuid);
        url.append("&ut=").append(userType);
        url.append("&t=").append(t);
        return url.toString();
    }

    public static AdData get(int placementId){
        String media;
        AdData adData;
        if(placementId == 331){
            media = "https://ads-cdn.fptplay.net/static/ads/demo/toshiba-truehome-360p.mp4";
            adData = new AdData(123
                    , media
                    ,"TOSHIBA True Home - Tổ ấm trọn niềm vui"
                    ,"https://www.toshiba.com.vn"
            );
        } else {
            media = "https://st88.adsplay.net/ads/overlay/1480497011613/a240d50de544d7a9e55ba2965232a89a.png";
            adData = new AdData(1309
                    , media
                    ,"iTVad-MobileBanner-FptPhone-X559"
                    ,"https://tiki.vn/fpt-x559-p272232.html"
            );
        }


        return adData;
    }

    public static AdData get(int placementId, String contentId, String deviceId ){
        OkHttpClient client = new OkHttpClient();
        try {
            String url = getVastUrl();
            Request request = new Request.Builder()
                    .url(url)
                    .addHeader("User-Agent","AdsPlayAndroidSDK1x6")
                    .build();
            Response response = client.newCall(request).execute();
            String rs = response.body().string();
            Log.i("AdsPlay",rs);
        } catch (Exception e){
            Log.i("AdsPlay",e.toString());
        }
    }
}
