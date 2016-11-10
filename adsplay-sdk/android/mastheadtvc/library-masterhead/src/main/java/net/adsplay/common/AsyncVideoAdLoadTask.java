package net.adsplay.common;

import android.os.AsyncTask;
import android.os.Environment;
import android.util.Log;

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
 * Created by trieu on 10/30/16.
 */

public class AsyncVideoAdLoadTask extends AsyncTask<Integer, String, AdData> {


//    AdsPlayHolderVideo adsPlayHolderVideo;
    String downloadedFilePath = null;
    AdsPlayReady adsPlayReady;
//    Activity activity;

    public AsyncVideoAdLoadTask(AdsPlayReady adsPlayReady) {
//        this.adsPlayHolderVideo = adsPlayHolderVideo;
        this.adsPlayReady = adsPlayReady;
    }

    /**
     * Before starting background thread
     */
    @Override
    protected void onPreExecute() {
        super.onPreExecute();
        Log.i("AdsPlay","Starting Download");
    }



    /**
     * Downloading file in background thread
     */
    @Override
    protected AdData doInBackground(Integer... placementIds) {
        if(placementIds.length==0){
            return null;
        }

        int placementId = placementIds[0];

        AdData adData = AdDataLoader.get(placementId);

        String remoteMediaPath = adData.getMedia();


        String root = Environment.getExternalStorageDirectory().toString();
        downloadedFilePath = root +"/" + CommonUtil.md5(remoteMediaPath)+".gif";

        File localFile = new File (downloadedFilePath);
        if(localFile.isFile()){
            Date lastModified = new Date(localFile.lastModified());
            long diff = new Date().getTime() - lastModified.getTime();//as given
            long minutes = TimeUnit.MILLISECONDS.toMinutes(diff);
            if(minutes < Constants.CACHE_TIME){
                //downloadedFilePath = filepath;
                adData.setMedia(downloadedFilePath);
                return adData;
            }
        }
        writeRemotedMediaToLocalFile(remoteMediaPath);
        adData.setMedia(downloadedFilePath);
        return adData;
    }

    private void writeRemotedMediaToLocalFile(String mediaPath) {
        InputStream input = null;
        OutputStream output = null;
        try {

            Log.i("AdsPlay","Downloading");
            Log.i("AdsPlay","File: "+downloadedFilePath);


            URL url = new URL(mediaPath);
            Log.i("AdsPlay","url: "+url);

            URLConnection conection = url.openConnection();
            conection.connect();
            // getting file length
            int lenghtOfFile = conection.getContentLength();
            Log.i("AdsPlay","lenghtOfFile: "+lenghtOfFile);

            // input stream to read file - with 200k buffer
            input = new BufferedInputStream(url.openStream(), 200000);

            output = new FileOutputStream(downloadedFilePath);

            byte data[] = new byte[1024];

//            long total = 0;
            int count;
            while ((count = input.read(data)) != -1) {
                //total += count;

                // writing data to file
                output.write(data, 0, count);
               // Log.i("AdsPlay","OutputStream: "+count);
            }

            // flushing output
            output.flush();
        } catch (Exception e) {
            Log.i("AdsPlay", e.getMessage());
        } finally {
            // closing streams
            if(output != null){
                try {
                    output.close();
                } catch (IOException e) {}
            }
            if(input != null){
                try {
                    input.close();
                } catch (IOException e) {}
            }
        }
    }


    /**
     * After completing background task
     **/
    @Override
    protected void onPostExecute(AdData adData) {
        //Log.i("AdsPlay","onPostExecute downloadedFilePath: "+downloadedFilePath);

        Log.i("AdsPlay","--> onPostExecute : "+adData);
        if(adData != null){
            //this.adsPlayHolderVideo.playAd(filepath);
            this.adsPlayReady.onMediaReady(adData);
        }

    }

}
