package com.yqritc.scalablevideoview.sample;

import com.yqritc.scalablevideoview.HolderVideo;
import com.yqritc.scalablevideoview.ScalableType;
import com.yqritc.scalablevideoview.ScalableVideoView;

import android.media.MediaPlayer;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import java.io.IOException;


public class MainActivity extends AppCompatActivity  {

    private HolderVideo mVideoView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mVideoView = (HolderVideo) findViewById(R.id.video_view);


        try {
            mVideoView.getHolder().setRawData(R.raw.landscape_sample);
            mVideoView.getHolder().setVolume(0, 0);
            mVideoView.getHolder().setLooping(true);
            mVideoView.getHolder().prepare(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    mVideoView.getHolder().start();
                }
            });
        } catch (IOException ioe) {
            //ignore
        }
    }


}
