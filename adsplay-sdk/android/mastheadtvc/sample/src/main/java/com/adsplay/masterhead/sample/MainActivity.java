package com.adsplay.masterhead.sample;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.adsplay.masterhead.HolderVideo;
import com.adsplay.masterhead.MasterheadAdData;


public class MainActivity extends AppCompatActivity  {

    private HolderVideo mVideoView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        HolderVideo.verifyStoragePermissions(this);

        mVideoView = (HolderVideo) findViewById(R.id.video_view);
        mVideoView.start(new MasterheadAdData("https://ads-cdn.fptplay.net/static/ads/demo/toshiba-truehome-360p.mp4",""));


    }


}
