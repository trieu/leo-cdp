package net.adsplay.common;

import android.app.Activity;

/**
 * Created by trieu on 10/31/16.
 */

public interface AdsPlayReady {
    void loadDataAdUnit(Activity activity, int placementId);
    void onMediaReady(AdData adData);
}
