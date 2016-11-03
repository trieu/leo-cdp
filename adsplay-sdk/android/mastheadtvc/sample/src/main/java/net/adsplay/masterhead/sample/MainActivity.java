package net.adsplay.masterhead.sample;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import net.adsplay.masterhead.AdsPlayHolderVideo;


public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //start ad video view
        AdsPlayHolderVideo.checkSystemPermissions(this);
        AdsPlayHolderVideo mVideoView = (AdsPlayHolderVideo) findViewById(R.id.masterhead_view);
        mVideoView.start();
    }
}