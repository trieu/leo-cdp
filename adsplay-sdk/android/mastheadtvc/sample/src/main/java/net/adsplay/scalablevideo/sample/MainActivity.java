package net.adsplay.scalablevideo.sample;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import net.adsplay.holder.AdsPlayHolderImage;
import net.adsplay.common.AdPermissionChecker;


public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //start ad video view
        AdPermissionChecker.checkSystemPermissions(this);
//        AdsPlayHolderVideo mVideoView = (AdsPlayHolderVideo) findViewById(R.id.masterhead_view);
//        mVideoView.start(this);

        AdsPlayHolderImage holderImage = (AdsPlayHolderImage) findViewById(R.id.banner_view);
        holderImage.start(this);


    }
}