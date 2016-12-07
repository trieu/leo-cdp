package net.adsplay.common;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by trieu on 11/3/16.
 */

public class AdDataLoader {

    static final String[] baseVideoDeliveryUrls = {
            "http://d2.adsplay.net/vmap/ads",
            "http://d4.adsplay.net/vmap/ads",
            "http://d6.adsplay.net/vmap/ads",
    };

    static final String[] baseAdDeliveryUrls = {
            "http://d2.adsplay.net/delivery",
            "http://d4.adsplay.net/delivery",
            "http://d6.adsplay.net/delivery",
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
        int s = baseVideoDeliveryUrls.length;
        String baseUrl = baseVideoDeliveryUrls[t % s];
        StringBuilder url = new StringBuilder(baseUrl);
        url.append("?placement=").append(placementId);
        url.append("&ctid=").append(contentId);
        url.append("&catid=").append(categoryId);
        url.append("&uuid=").append(uuid);
        url.append("&ut=").append(userType);
        url.append("&t=").append(t);
        return url.toString();
    }

    public static String getDisplayAdUrl(String uuid, int placementId, int userType){
        int t = (int) (System.currentTimeMillis()/1000L);
        int s = baseAdDeliveryUrls.length;
        String baseUrl = baseAdDeliveryUrls[t % s];
        StringBuilder url = new StringBuilder(baseUrl);
        url.append("?at=display&placement=").append(placementId);
        url.append("&uuid=").append(uuid);
        url.append("&ut=").append(userType);
        url.append("&t=").append(t);
        return url.toString();
    }


    public static AdData getAdData(String uuid, int placementId){
        OkHttpClient client = new OkHttpClient();
        AdData adData = null;
        try {
            String url = getDisplayAdUrl(uuid, placementId, 0);
            Log.i("AdsPlay", url);
            Request request = new Request.Builder()
                    .url(url)
                    .addHeader("User-Agent","AdsPlayAndroidSDK1x6")
                    .build();
            Response response = client.newCall(request).execute();
            String rs = response.body().string();
            JSONArray ads = new JSONArray(rs);
            JSONObject ad = ads.getJSONObject(0);
            int adId = ad.getInt("adId");
            String media = "http:" + ad.getString("adMedia");
            String clickthroughUrl = ad.getString("clickthroughUrl");
            adData = new AdData(adId
                    , media
                    , ""
                    ,clickthroughUrl
            );

            Log.i("AdsPlay",rs);
        } catch (Exception e){
            Log.i("AdsPlay",e.toString());
        }
        return adData;
    }
}
