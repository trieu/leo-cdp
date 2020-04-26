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
import leotech.system.util.RequestInfoUtil;
import rfx.core.util.StringUtil;

public class TrackingApi {
    public static final String EVENT_NAME = "en";
    public static final String EVENT_VALUE = "ev";
    public static final String TRANSACTION_CODE = "tsc";

    public static int recordViewEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv,
	    ContextSession ctxSession, String eventName) {
	String srcTouchpointId = StringUtil.safeString(params.get("srcTouchpointId"));
	String deviceId = StringUtil.safeString(params.get("deviceId"));
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	int eventValue = 1;
	return recordTrackingEvent(deviceId, sourceIP, dv, ctxSession, srcTouchpointId, eventName, eventValue);
    }

    public static int recordActionEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv,
	    ContextSession ctxSession, String eventName) {
	String srcTouchpointId = StringUtil.safeString(params.get("srcTouchpointId"));
	String deviceId = StringUtil.safeString(params.get("deviceId"));
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	int eventValue = StringUtil.safeParseInt(params.get(EVENT_VALUE), 1);
	return recordTrackingEvent(deviceId, sourceIP, dv, ctxSession, srcTouchpointId, eventName, eventValue);
    }

    public static int recordTrackingEvent(String deviceId, String sourceIP, DeviceInfo dv,
	    ContextSession ctxSession, String srcTouchpointId, String eventName, int eventValue) {

	String deviceName = dv.deviceName;
	String deviceOS = dv.deviceOs;

	String browserName = dv.browserName;
	String deviceType = dv.deviceType;
	String refTouchpointId = ctxSession.getRefTouchpointId();

	int refProfileType = Profile.ProfileType.ANONYMOUS;
	String refProfileId = ctxSession.getProfileId();
	String sessionKey = ctxSession.getSessionKey();
	String observerId = ctxSession.getObserverId();
	TrackingEvent e = new TrackingEvent(observerId, sessionKey, eventName, eventValue, refProfileId, refProfileType,
		srcTouchpointId, refTouchpointId, browserName, deviceId, deviceOS, deviceName, deviceType, sourceIP);
	
	TrackingEventDaoUtil.record(e);
	return 200;
    }

    public static int recordConversionEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv,
	    ContextSession ctxSession, String eventName) {
	String srcEventKey = StringUtil.safeString(params.get("srcEventKey"));
	String srcTouchpointId = StringUtil.safeString(params.get("srcTouchpointId"));
	String deviceId = StringUtil.safeString(params.get("deviceId"));
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	int eventValue = 1;
	String transactionCode = StringUtil.safeString(params.get(TRANSACTION_CODE));
	return recordConversionEvent(srcEventKey, deviceId, sourceIP, dv, ctxSession, srcTouchpointId, eventName,
		eventValue, transactionCode);
    }

    public static int recordConversionEvent(String srcEventKey, String deviceId, String sourceIP, DeviceInfo dv,
	    ContextSession ctxSession, String srcTouchpointId, String eventName, int eventValue,
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

	int timeSpent = 1;// TODO
	ConversionEvent ce = new ConversionEvent(observerId, sessionKey, eventName, eventValue, refProfileId,
		refProfileType, srcTouchpointId, refTouchpointId, browserName, deviceId, deviceOS, deviceName,
		deviceType, sourceIP, timeSpent, srcEventKey);
	ConversionEventDaoUtil.record(ce);
	return 200;
    }
}
