package net.adsplay.common;

import android.app.Activity;
import android.content.Context;

/**
 * Created by trieu on 10/31/16.
 */

public interface AdsPlayReady {
    void loadDataAdUnit(Activity activity, int placementId);
    void onMediaReady(AdData adData);

    String getCacheDir();
}
