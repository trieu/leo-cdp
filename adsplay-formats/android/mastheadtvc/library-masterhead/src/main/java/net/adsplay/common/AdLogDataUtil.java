package net.adsplay.common;

import android.os.SystemClock;
import android.util.Log;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by trieu on 11/3/16.
 */

public class AdLogDataUtil {

    static final String[] baseAdLogUrls = {
            "http://log1.adsplay.net/track/videoads",
            "http://log2.adsplay.net/track/videoads",
            "http://log3.adsplay.net/track/videoads",
            "http://log4.adsplay.net/track/videoads",
    };

    static final OkHttpClient client = new OkHttpClient();

    static String buildLogUrl(String metric, AdData adData){
        StringBuilder u = new StringBuilder();

        int adId = adData.getAdId();
        String adBeacon = adData.getAdBeacon();
        int t = (int) (System.currentTimeMillis()/1000L);

        int s = baseAdLogUrls.length;
        String baseUrl = baseAdLogUrls[t % s];

        u.append(baseUrl).append("?metric=").append(metric);
        u.append("&adid=").append(adId);
        u.append("&beacon=").append(adBeacon);
        u.append("&t=").append(t);
        return u.toString();
    }

    public static void log(String metric, AdData adData){
        try {
            String url = buildLogUrl(metric, adData);
            Log.e("AdsPlay",metric + " => "+url);
            Request request = new Request.Builder()
                    .url(url)
                    .addHeader("User-Agent","AdsPlayAndroidSDK1x6")
                    .build();
            client.newCall(request).execute();
        } catch (Exception e){
            Log.e("AdsPlay",e.toString());
        }
    }
}
