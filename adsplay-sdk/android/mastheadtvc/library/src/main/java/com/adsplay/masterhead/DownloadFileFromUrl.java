package com.adsplay.masterhead;

import android.os.AsyncTask;
import android.os.Environment;
import android.util.Log;

import java.io.BufferedInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;

/**
 * Created by trieu on 10/30/16.
 */

public class DownloadFileFromUrl extends AsyncTask<String, String, String> {

    HolderVideo holderVideo;
    String downloadedFilePath = null;

    public DownloadFileFromUrl(HolderVideo holderVideo) {
        this.holderVideo = holderVideo;
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
    protected String doInBackground(String... f_url) {
        int count;

        try {
            String root = Environment.getExternalStorageDirectory().toString();
            String filepath = root + "/temp.mp4";


            Log.i("AdsPlay","Downloading");
            Log.i("AdsPlay","File: "+filepath);


            URL url = new URL(f_url[0]);
            Log.i("AdsPlay","url: "+url);

            URLConnection conection = url.openConnection();
            conection.connect();
            // getting file length
            int lenghtOfFile = conection.getContentLength();
            Log.i("AdsPlay","lenghtOfFile: "+lenghtOfFile);

            // input stream to read file - with 8k buffer
            InputStream input = new BufferedInputStream(url.openStream(), 8192);

            // Output stream to write file


            OutputStream output = new FileOutputStream(filepath);

            byte data[] = new byte[1024];

            long total = 0;
            while ((count = input.read(data)) != -1) {
                total += count;

                // writing data to file
                output.write(data, 0, count);
                Log.i("AdsPlay","OutputStream: "+count);
            }

            // flushing output
            output.flush();

            // closing streams
            output.close();
            input.close();
            downloadedFilePath = filepath;
        } catch (Exception e) {
            Log.i("AdsPlay", e.getMessage());
        }

        return downloadedFilePath;
    }


    /**
     * After completing background task
     **/
    @Override
    protected void onPostExecute(String file_url) {


        Log.i("AdsPlay","Downloaded file: "+downloadedFilePath);

        if(downloadedFilePath != null){

            this.holderVideo.playAd("file://"+downloadedFilePath);
            //TODO
        }

    }

}