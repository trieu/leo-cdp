package net.adsplay.masterhead;

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
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.concurrent.TimeUnit;

/**
 * Created by trieu on 10/30/16.
 */

public class DownloadFileFromUrl extends AsyncTask<Integer, String, MasterheadAdData> {

    final static int CACHE_MINUTE = 12*60;//12 hours
    //final static int CACHE_MINUTE = 0;// no cache
    //AdsPlayHolderVideo adsPlayHolderVideo;
    String downloadedFilePath = null;
    AdsPlayReady adsPlayReady;


    public DownloadFileFromUrl(AdsPlayReady adsPlayReady) {
        //this.adsPlayHolderVideo = adsPlayHolderVideo;
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

    public String md5(String s) {
        try {
            // Create MD5 Hash
            MessageDigest digest = java.security.MessageDigest.getInstance("MD5");
            digest.update(s.getBytes());
            byte messageDigest[] = digest.digest();

            // Create Hex String
            StringBuffer hexString = new StringBuffer();
            for (int i=0; i<messageDigest.length; i++)
                hexString.append(Integer.toHexString(0xFF & messageDigest[i]));
            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return "";
    }


    /**
     * Downloading file in background thread
     */
    @Override
    protected MasterheadAdData doInBackground(Integer... placementIds) {
        if(placementIds.length==0){
            return null;
        }

        String mediaPath = "https://ads-cdn.fptplay.net/static/ads/demo/toshiba-truehome-360p.mp4";

        String root = Environment.getExternalStorageDirectory().toString()+"/";
        downloadedFilePath = root + md5(mediaPath) + ".mp4";
        File file = new File (downloadedFilePath);
        if(file.isFile()){
            Date lastModified = new Date(file.lastModified());
            long diff = new Date().getTime() - lastModified.getTime();//as given
            long minutes = TimeUnit.MILLISECONDS.toMinutes(diff);
            if(minutes<CACHE_MINUTE){
                //downloadedFilePath = filepath;
                MasterheadAdData adData = new MasterheadAdData(123, downloadedFilePath, "TOSHIBA True Home - Tổ ấm trọn niềm vui");
                return adData;
            }
        }

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

            long total = 0;
            int count;
            while ((count = input.read(data)) != -1) {
                total += count;

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
        MasterheadAdData adData = new MasterheadAdData(123, downloadedFilePath, "TOSHIBA True Home - Tổ ấm trọn niềm vui");
        return adData;
    }


    /**
     * After completing background task
     **/
    @Override
    protected void onPostExecute(MasterheadAdData adData) {
        //Log.i("AdsPlay","onPostExecute downloadedFilePath: "+downloadedFilePath);

        Log.i("AdsPlay","--> onPostExecute : "+adData);
        if(adData != null){
            //this.adsPlayHolderVideo.playAd(filepath);
            this.adsPlayReady.onMediaReady(adData);
        }

    }

}
