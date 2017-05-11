package net.adsplay.common;

import android.app.Activity;
import android.os.StrictMode;

import net.adsplay.holder.AdsPlayHolderVideo;

/**
 * Created by trieu on 11/3/16.
 */

public class AdPermissionChecker {

    static boolean checked = false;
    public static void checkSystemPermissions(Activity activity){
        if(!checked){
            checked = true;
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);
            //AdsPlayHolderVideo.verifyStoragePermissions(activity);
            UserProfileUtil.init(activity);
        }
    }
}
