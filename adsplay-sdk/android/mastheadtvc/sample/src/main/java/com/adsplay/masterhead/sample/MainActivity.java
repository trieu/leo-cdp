package com.adsplay.masterhead.sample;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.adsplay.masterhead.AdsPlayHolderVideo;


public class MainActivity extends AppCompatActivity {

    private AdsPlayHolderVideo mVideoView;




    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        AdsPlayHolderVideo.checkSystem(this);
        mVideoView = (AdsPlayHolderVideo) findViewById(R.id.video_view);
        mVideoView.start();


    }


}
