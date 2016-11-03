package net.adsplay.holder;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.AsyncTask;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import net.adsplay.common.AdData;
import net.adsplay.common.AdLogDataUtil;
import net.adsplay.common.AdsPlayReady;
import net.adsplay.common.DownloadFileFromUrl;

import java.io.InputStream;


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
        showAd(adData);
    }

    @Override
    public void start(Activity activity){
        this.activity = activity;
        new DownloadFileFromUrl(this).execute(332);
    }

    private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
        ImageView bmImage;

        public DownloadImageTask(ImageView bmImage) {
            this.bmImage = bmImage;
        }

        protected Bitmap doInBackground(String... urls) {
            String urldisplay = urls[0];
            Bitmap mIcon11 = null;
            try {
                InputStream in = new java.net.URL(urldisplay).openStream();
                mIcon11 = BitmapFactory.decodeStream(in);
            } catch (Exception e) {
                Log.e("Error", e.getMessage());
                e.printStackTrace();
            }
            return mIcon11;
        }

        protected void onPostExecute(Bitmap result) {
            bmImage.setImageBitmap(result);
        }
    }

    void showAd(final AdData adData){
        try {
            Log.i("AdsPlay","--------------------------------------------------------------------");
            String file =  adData.getMedia();
            String adTitle = adData.getTitle();
            Log.i("AdsPlay","-------> playAd file: "+file);

            new DownloadImageTask(this.imageView)
                    .execute(file);


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
