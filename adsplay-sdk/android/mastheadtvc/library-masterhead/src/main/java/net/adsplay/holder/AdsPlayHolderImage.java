package net.adsplay.holder;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import net.adsplay.common.AdData;
import net.adsplay.common.AdDataLoader;
import net.adsplay.common.AdLogDataUtil;
import net.adsplay.common.AdsPlayReady;
import net.adsplay.common.DownloadImageTask;
import net.adsplay.common.UserProfileUtil;


/**
 * Created by trieu on 11/3/16.
 */

public class AdsPlayHolderImage extends RelativeLayout implements AdsPlayReady {

    Activity activity;
    private LinearLayout adHolder;
    private ImageView imageView;

    public AdsPlayHolderImage(Context context) {
        super(context);
        init();
    }

    public AdsPlayHolderImage(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public AdsPlayHolderImage(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init();
    }

    private void init() {
        inflate(getContext(), R.layout.holderimage, this);

        //find
        this.imageView = (ImageView) findViewById(R.id.imageBannerView);
        this.adHolder = (LinearLayout)findViewById(R.id.imageBannerHolder);
    }

    public ImageView getImageView() {
        return imageView;
    }

    @Override
    public void onMediaReady(AdData adData) {
        if(adData != null){
            showAd(adData);
        }
    }

    @Override
    public void loadDataAdUnit(Activity activity, int placementId){
        this.activity = activity;
        //String deviceId = "abc";

        int adType = AdData.ADTYPE_IMAGE_DISPLAY_AD;
        String uuid = UserProfileUtil.getUUID();
        AdData adData = AdDataLoader.getAdData(uuid, placementId, adType);
        if(adData != null){
            showAd(adData);
        }
    }

    void showAd(final AdData adData){
        try {
            Log.i("AdsPlay","--------------------------------------------------------------------");
            String file =  adData.getMedia();
            //String adTitle = adData.getTitle();
            Log.i("AdsPlay","-------> playAd file: "+file);

            new DownloadImageTask(this.imageView).execute(file);

            this.imageView.setOnClickListener(new OnClickListener() {
                @Override
                public void onClick(View v) {
                AdsPlayHolderImage.this.adHolder.setVisibility(GONE);
                AdsPlayHolderImage.this.imageView.setVisibility(GONE);
                if(adData.getClickthroughUrl() != null){
                    Intent i = new Intent(Intent.ACTION_VIEW);
                    i.setData(Uri.parse(adData.getClickthroughUrl()));
                    AdsPlayHolderImage.this.activity.startActivity(i);
                    AdLogDataUtil.log("https://log1.adsplay.net/ping");
                }
                }
            });
        } catch (Exception ioe) {
            Log.i("AdsPlay",ioe.getMessage());
            Log.i("AdsPlay",ioe.toString());
        }
    }
}
