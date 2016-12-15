package net.adsplay.common;

import android.os.AsyncTask;
import android.os.Environment;
import android.util.Log;

import net.adsplay.holder.AdsPlayHolderImage;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.Date;
import java.util.concurrent.TimeUnit;

/**
 * Created by trieu on 12/15/16.
 */

public class AsyncImageAdLoadTask extends AsyncTask<Integer, String, AdData> {

    static boolean rendered = false;
    AdsPlayReady adsPlayReady;

    public AsyncImageAdLoadTask(AdsPlayReady adsPlayReady) {
        this.adsPlayReady = adsPlayReady;
    }

    /**
     * Before starting background thread
     */
    @Override
    protected void onPreExecute() {
        super.onPreExecute();
        Log.i("AdsPlay","Starting AsyncImageAdLoadTask");
    }

    /**
     * Downloading file in background thread
     */
    @Override
    protected AdData doInBackground(Integer... placementIds) {
        if(placementIds.length==0 || rendered){
            return null;
        }
        int placementId = placementIds[0];
        int adType = AdData.ADTYPE_IMAGE_DISPLAY_AD;
        String uuid = UserProfileUtil.getUUID();
        AdData adData = AdDataLoader.getAdData(uuid, placementId, adType);
        return adData;
    }

    /**
     * After completing background task
     **/
    @Override
    protected void onPostExecute(AdData adData) {
        rendered = true;
        Log.i("AdsPlay","--> onPostExecute : "+adData);
        this.adsPlayReady.onMediaReady(adData);
    }

}
