package net.adsplay.scalablevideo.sample;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import net.adsplay.common.AdPermissionChecker;
import net.adsplay.holder.AdsPlayHolderImage;
import net.adsplay.holder.AdsPlayHolderVideo;


public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //for mobile banner
        ((AdsPlayHolderImage)findViewById(R.id.banner_view)).loadDataAdUnit(this, 1008);

        //for mobile infeed video
        ((AdsPlayHolderVideo)findViewById(R.id.masterhead_view)).loadDataAdUnit(this, 1009);

    }
}