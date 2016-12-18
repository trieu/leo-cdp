package net.adsplay.common;

import android.Manifest;

/**
 * Created by trieu on 11/3/16.
 */

public class Constants {
    // Storage Permissions
    public static final int REQUEST_EXTERNAL_STORAGE = 1;
    public static String[] PERMISSIONS_STORAGE = {
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };


    public final static int CACHE_TIME = 12*60;//12 hours
    //public final static int CACHE_TIME = 0;// no cache
}
