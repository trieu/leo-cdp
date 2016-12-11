package net.adsplay.common;

import android.app.Activity;
import android.provider.Settings;

/**
 * Created by trieu on 12/11/16.
 */

public class UserProfileUtil {
    static String uuid = "";

    public static void init(Activity activity){
        String deviceId = Settings.Secure.getString(activity.getContentResolver(), Settings.Secure.ANDROID_ID);
        if(uuid.isEmpty()){
            uuid = deviceId;
        }
    }

    public static String getUUID(){
        return uuid;
    }
}
