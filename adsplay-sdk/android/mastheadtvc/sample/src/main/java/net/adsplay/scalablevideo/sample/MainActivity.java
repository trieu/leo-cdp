package net.adsplay.scalablevideo.sample;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import net.adsplay.holder.AdsPlayHolderImage;
import net.adsplay.common.AdPermissionChecker;
import net.adsplay.holder.AdsPlayHolderVideo;


public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Init AdsPlay code
        AdPermissionChecker.checkSystemPermissions(this);
        ((AdsPlayHolderImage) findViewById(R.id.banner_view)).start(this);


        //AdsPlayHolderVideo mVideoView = (AdsPlayHolderVideo) findViewById(R.id.masterhead_view);
        //mVideoView.start(this);


    }
}