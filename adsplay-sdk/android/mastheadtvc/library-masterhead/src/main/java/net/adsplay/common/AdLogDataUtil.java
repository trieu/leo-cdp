package net.adsplay.common;

import android.util.Log;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by trieu on 11/3/16.
 */

public class AdLogDataUtil {

    static OkHttpClient client = new OkHttpClient();

    public static void log(String url){


        try {
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
