package leotech.cdp.utils;

import java.util.UUID;

public class UserSessionDataUtil {
    
    public static String getSessionKeyForRealtimeTracking(String geoLocationId, String ip, String touchpointId, String profileId, String deviceId) {
	String keyHint = geoLocationId + ip + touchpointId + profileId + deviceId;
	String sessionKey =  UUID.nameUUIDFromBytes(keyHint.getBytes()).toString();
	//TODO set expired key to Redis and insert into database
	
	return sessionKey;
    }

}
