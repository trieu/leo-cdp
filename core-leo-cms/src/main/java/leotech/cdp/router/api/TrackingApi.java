package leotech.cdp.router.api;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import leotech.cdp.dao.ConversionEventDaoUtil;
import leotech.cdp.dao.TrackingEventDaoUtil;
import leotech.cdp.model.ContextSession;
import leotech.cdp.model.ConversionEvent;
import leotech.cdp.model.Profile;
import leotech.cdp.model.TrackingEvent;
import leotech.system.model.DeviceInfo;
import rfx.core.util.StringUtil;

public class TrackingApi {
    
//    public static boolean record(HttpServerRequest req, MultiMap params, DeviceInfo dv,ContextSession ctxSession) {
//	 String eventName = StringUtil.safeString(params.get(EVENT_NAME)).toLowerCase();
//	return record(webCookies, deviceId, sourceIP, dv, ctxSession, srcTouchpointId, eventName, eventValue)
//    }

   

    public static boolean record(String webCookies,String deviceId, String sourceIP, DeviceInfo dv,ContextSession ctxSession, String srcTouchpointId, String eventName, int eventValue) {
	
	String deviceName = dv.deviceName;
	String deviceOS = dv.deviceOs;

	
	String browserName = dv.browserName;
	String deviceType = dv.deviceType;
	String refTouchpointId = ctxSession.getRefTouchpointId();
	
	int refProfileType = Profile.ProfileType.ANONYMOUS;
	String refProfileId = ctxSession.getProfileId();
	String sessionKey = ctxSession.getSessionKey();
	String observerId = ctxSession.getObserverId();
	TrackingEvent e = new TrackingEvent(observerId, sessionKey, eventName, eventValue, refProfileId, refProfileType, srcTouchpointId, refTouchpointId, browserName, webCookies, deviceId, deviceOS, deviceName, deviceType, sourceIP);;
	TrackingEventDaoUtil.record(e );
	return true;
    }

    public static boolean record(String srcEventKey,String webCookies,String deviceId, String sourceIP, DeviceInfo dv,ContextSession ctxSession, String srcTouchpointId, String eventName, int eventValue,
	    String transactionCode) {
	String deviceName = dv.deviceName;
	String deviceOS = dv.deviceOs;

	
	String browserName = dv.browserName;
	String deviceType = dv.deviceType;
	String refTouchpointId = ctxSession.getRefTouchpointId();
	
	int refProfileType = Profile.ProfileType.ANONYMOUS;
	String refProfileId = ctxSession.getProfileId();
	String sessionKey = ctxSession.getSessionKey();
	String observerId = ctxSession.getObserverId();
	
	
	int timeSpent = 1;//TODO
	ConversionEvent ce = new ConversionEvent(observerId, sessionKey, eventName, eventValue, refProfileId, refProfileType, srcTouchpointId, refTouchpointId, browserName, webCookies, deviceId, deviceOS, deviceName, deviceType, sourceIP, timeSpent, srcEventKey);
	ConversionEventDaoUtil.record(ce);
	return true;
    }
}
