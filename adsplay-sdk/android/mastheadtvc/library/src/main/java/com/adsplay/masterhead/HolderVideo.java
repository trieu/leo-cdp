package com.adsplay.masterhead;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.media.MediaPlayer;
import android.os.StrictMode;
import android.support.v4.app.ActivityCompat;
import android.util.AttributeSet;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.io.IOException;

/**
 * Created by anhvt on 26/10/2016.
 */

public class HolderVideo extends RelativeLayout {

    private ScalableVideoView holder;
    private Button btnClose;
    private TextView txttitle, txtdescription;
    private MasterheadAdData adData;

    // Storage Permissions
    private static final int REQUEST_EXTERNAL_STORAGE = 1;
    private static String[] PERMISSIONS_STORAGE = {
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };

    public HolderVideo(Context context) {
        super(context);
        init();

    }

    /**
     * Checks if the app has permission to write to device storage
     *
     * If the app does not has permission then the user will be prompted to grant permissions
     *
     * @param activity
     */
    public static void verifyStoragePermissions(Activity activity) {
        // Check if we have write permission
        int permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.WRITE_EXTERNAL_STORAGE);

        if (permission != PackageManager.PERMISSION_GRANTED) {
            // We don't have permission so prompt the user
            ActivityCompat.requestPermissions(
                    activity,
                    PERMISSIONS_STORAGE,
                    REQUEST_EXTERNAL_STORAGE
            );
        }
    }

    public HolderVideo(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public HolderVideo(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init();
    }

    public ScalableVideoView getHolder() {
        return this.holder;
    }
    private void init() {
        inflate(getContext(), R.layout.holdervideo, this);

        this.holder = (ScalableVideoView) findViewById(R.id.holder);
        this.txttitle = (TextView) findViewById(R.id.txttitle);


        //this.btnClose = (Button) findViewById(R.id.btnClose);
        //this.txtdescription = (TextView) findViewById(R.id.txtdescription);

//        this.btnClose.setOnClickListener(new OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                holder.mMediaPlayer.stop();
//                holder.mMediaPlayer.release();
//                HolderVideo.this.setVisibility(view.GONE);
//            }
//        });
        
    }

    public void playAd(String filepath){
        try {
            final ScalableVideoView holder = this.getHolder();
            holder.setDataSource(filepath);
            holder.prepare(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    holder.start();
                    holder.setVolume(0, 2);
                    holder.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                        @Override
                        public void onCompletion(MediaPlayer mp) {
                            mp.stop();
                            mp.release();
                            HolderVideo.this.setVisibility(HolderVideo.GONE);
                        }
                    });
                }
            });
        } catch (IOException ioe) {
            //ignore
        }
    }

    public void start(MasterheadAdData data){
        this.adData = data;
        String media = data.getMedia();
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        new DownloadFileFromUrl(this).execute(media);


    }

    public MasterheadAdData getAdData() {
        return adData;
    }
}
