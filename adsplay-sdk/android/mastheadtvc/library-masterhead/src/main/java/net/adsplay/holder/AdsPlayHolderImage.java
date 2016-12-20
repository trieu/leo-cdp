package net.adsplay.holder;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import net.adsplay.common.AdData;

import net.adsplay.common.AdLogDataUtil;
import net.adsplay.common.AdPermissionChecker;
import net.adsplay.common.AdsPlayReady;
import net.adsplay.common.AsyncImageAdLoadTask;
import net.adsplay.common.DownloadImageTask;



/**
 * Created by trieu on 11/3/16.
 */

public class AdsPlayHolderImage extends RelativeLayout implements AdsPlayReady {

    Activity activity;
    private LinearLayout adHolder;
    private ImageView imageView;
    int width, height;

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

    void closeAdView(){
        AdsPlayHolderImage.this.adHolder.setVisibility(GONE);
        AdsPlayHolderImage.this.imageView.setVisibility(GONE);
    }

    void hideAdView(){
        ViewGroup.LayoutParams params = adHolder.getLayoutParams();
        this.width = params.width;
        this.height = params.height;
        params.height = 0;
        params.width = 0;
        adHolder.setLayoutParams(params);
    }

    void showAdView(AdData adData){
        ViewGroup.LayoutParams params = adHolder.getLayoutParams();
        params.height = this.height;
        params.width = this.width;
        adHolder.setLayoutParams(params);

        String metric = "impression";
        AdLogDataUtil.log(metric,adData);
    }

    @Override
    public void onMediaReady(final AdData adData) {
        if(adData != null){
            try {
                showAdView(adData);
                Log.i("AdsPlay","--------------------------------------------------------------------");
                String file =  adData.getMedia();
                Log.i("AdsPlay","-------> playAd file: "+file);

                new DownloadImageTask(this.imageView).execute(file);

                this.imageView.setOnClickListener(new OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        closeAdView();
                        if(adData.getClickthroughUrl() != null){
                            AdLogDataUtil.log("click",adData);
                            Intent i = new Intent(Intent.ACTION_VIEW);
                            i.setData(Uri.parse(adData.getClickthroughUrl()));
                            AdsPlayHolderImage.this.activity.startActivity(i);
                        }
                    }
                });
            } catch (Exception ioe) {
                Log.i("AdsPlay",ioe.getMessage());
                Log.i("AdsPlay",ioe.toString());
            }
        } else {
            closeAdView();
        }
    }

    @Override
    public void loadDataAdUnit(Activity activity, int placementId){
        this.activity = activity;
        AdPermissionChecker.checkSystemPermissions(activity);
        hideAdView();
        new AsyncImageAdLoadTask(this).execute(placementId);
    }

    @Override
    public String getCacheDir(){
        return this.activity.getCacheDir().getPath();
    }
}
