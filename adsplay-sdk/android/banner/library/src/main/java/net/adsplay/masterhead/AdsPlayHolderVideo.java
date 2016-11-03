package net.adsplay.masterhead;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.media.MediaPlayer;
import android.os.StrictMode;
import android.support.v4.app.ActivityCompat;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

/**
 * Created by anhvt on 26/10/2016.
 */

public class AdsPlayHolderVideo extends RelativeLayout implements AdsPlayReady {

    private LinearLayout adHolder;
    private ScalableVideoView videoView;
    private TextView txttitle;
    //private TextView txtdescription
    //private Button btnClose;;


    // Storage Permissions
    private static final int REQUEST_EXTERNAL_STORAGE = 1;
    private static String[] PERMISSIONS_STORAGE = {
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };

    public AdsPlayHolderVideo(Context context) {
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

    public AdsPlayHolderVideo(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public AdsPlayHolderVideo(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init();
    }

    public ScalableVideoView getVideoView() {
        return this.videoView;
    }

    boolean valumeEnabled = false;

    private void init() {
        inflate(getContext(), R.layout.holdervideo, this);

        this.videoView = (ScalableVideoView) findViewById(R.id.masterheadVideoView);
        this.txttitle = (TextView) findViewById(R.id.masterheadTitle);
        this.adHolder = (LinearLayout)findViewById(R.id.masterheadHolder);

        this.videoView.setVisibility(AdsPlayHolderVideo.GONE);
        this.txttitle.setVisibility(AdsPlayHolderVideo.GONE);
    }

    public void playAd(MasterheadAdData adData){
        try {
            Log.i("AdsPlay","--------------------------------------------------------------------");
            String file = "file://"+adData.getMedia();
            String adTitle = adData.getTitle();

            Log.i("AdsPlay","-------> playAd file: "+file);
            this.videoView.setVisibility(AdsPlayHolderVideo.VISIBLE);
            this.txttitle.setVisibility(AdsPlayHolderVideo.VISIBLE);

            this.videoView.setDataSource(file);
            this.videoView.setVolume(0, 2);
            this.txttitle.setText(adTitle);

            this.videoView.prepareAsync(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    Log.i("AdsPlay","Ad Duration: "+mp.getDuration());
                    AdsPlayHolderVideo.this.videoView.start();


                    getVideoView().setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                        @Override
                        public void onCompletion(MediaPlayer mp) {
                            mp.stop();
                            mp.release();

                            AdsPlayHolderVideo.this.videoView.setVisibility(AdsPlayHolderVideo.GONE);
                            AdsPlayHolderVideo.this.txttitle.setVisibility(AdsPlayHolderVideo.GONE);
                            AdsPlayHolderVideo.this.adHolder.setVisibility(AdsPlayHolderVideo.GONE);
                        }
                    });

                }
            });

            this.videoView.setOnClickListener(new OnClickListener() {
                @Override
                public void onClick(View v) {
                    synchronized(this) {
                        if( ! valumeEnabled ){
                            valumeEnabled = true;
                            AdsPlayHolderVideo.this.videoView.setVolume(0, 2);
                        } else {
                            valumeEnabled = false;
                            AdsPlayHolderVideo.this.videoView.setVolume(0, 0);
                        }
                    }
                }
            });

        } catch (Exception ioe) {
            Log.i("AdsPlay",ioe.getMessage());
        }
    }

    public static void checkSystemPermissions(Activity activity){
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        AdsPlayHolderVideo.verifyStoragePermissions(activity);
    }

    public void start(){
        new DownloadFileFromUrl(this).execute(331);
    }

    @Override
    public void onMediaReady(MasterheadAdData adData) {
        playAd(adData);
    }
}
