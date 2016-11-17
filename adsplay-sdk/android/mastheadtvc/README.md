# AdsPlay-ScalableVideoView

Android Texture VideoView having a variety of scale types like the scale types of ImageView.

# Gradle
```
repositories {
    jcenter()
}

dependencies {
    compile 'net.adsplay:android-scalablevideoview:1.0.4'
}
```


# Usage

### Set scale type in layout file
```
 <net.adsplay.holder.AdsPlayHolderVideo
                android:id="@+id/masterhead_view"
                android:layout_width="fill_parent"
                android:layout_height="wrap_content"
                />
```


### Sample usage in source code
```
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
```

# License
```
Copyright 2016 AdsPlay.net