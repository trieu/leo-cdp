package net.adsplay.common;

import android.app.Activity;

/**
 * Created by trieu on 10/31/16.
 */

public interface AdsPlayReady {
    public void start(Activity activity);
    public void onMediaReady(AdData adData);
}
