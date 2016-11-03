# AdsPlay-ScalableVideoView
[![Android Arsenal](https://img.shields.io/badge/Android%20Arsenal-ScalableVideoView-green.svg?style=flat)](https://android-arsenal.com/details/1/2045)
[![License](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Download](https://api.bintray.com/packages/yqritc/maven/android-scalablevideoview/images/download.svg)](https://bintray.com/yqritc/maven/android-scalablevideoview/_latestVersion)

*__Looking for the extra scale types of ImageView? [Check out ScalableImageView.](https://github.com/yqritc/Android-ScalableImageView)__*  

Android Texture VideoView having a variety of scale types like the scale types of ImageView.

![Sample](/sample/sample.gif)

# Sample
<a href="https://play.google.com/store/apps/details?id=com.yqritc.scalablevideoview.sample"><img src="http://developer.android.com/images/brand/en_app_rgb_wo_60.png"/></a>

# Release Note

[Release Note] (https://github.com/yqritc/Android-ScalableVideoView/releases)

# Gradle
```
repositories {
    jcenter()
}

dependencies {
    compile 'com.yqritc:android-scalablevideoview:1.0.4'
}
```



# Usage

### Set scale type in layout file
```
 <com.adsplay.masterhead.AdsPlayHolderVideo
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