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

   

    public static int recordViewEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv, ContextSession ctxSession,
	    String eventName) {
	String srcTouchpointId = StringUtil.safeString(params.get(TrackingApiParam.SOURCE_TOUCHPOINT_ID));
	String deviceId = StringUtil.safeString(params.get(TrackingApiParam.USER_DEVICE_ID));
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT), TrackingApiParam.DEV_ENV);
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	int eventValue = 1;
	return recordTrackingEvent(environment, deviceId, sourceIP, dv, ctxSession, srcTouchpointId, eventName,
		eventValue);
    }

    public static int recordActionEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv,
	    ContextSession ctxSession, String eventName) {
	String srcTouchpointId = StringUtil.safeString(params.get(TrackingApiParam.SOURCE_TOUCHPOINT_ID));
	String deviceId = StringUtil.safeString(params.get(TrackingApiParam.USER_DEVICE_ID));
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT), TrackingApiParam.DEV_ENV);
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	int eventValue = StringUtil.safeParseInt(params.get(TrackingApiParam.EVENT_VALUE), 1);
	return recordTrackingEvent(environment, deviceId, sourceIP, dv, ctxSession, srcTouchpointId, eventName,
		eventValue);
    }

    public static int recordTrackingEvent(String environment, String deviceId, String sourceIP, DeviceInfo dv,
	    ContextSession ctxSession, String srcTouchpointId, String eventName, int eventValue) {

	String deviceName = dv.deviceName;
	String deviceOS = dv.deviceOs;

	String browserName = dv.browserName;
	String deviceType = dv.deviceType;
	String refTouchpointId = ctxSession.getRefTouchpointId();

	int refProfileType = ctxSession.getProfileType();
	String refProfileId = ctxSession.getProfileId();
	String sessionKey = ctxSession.getSessionKey();
	String observerId = ctxSession.getObserverId();
	TrackingEvent e = new TrackingEvent(observerId, sessionKey, eventName, eventValue, refProfileId, refProfileType,
		srcTouchpointId, refTouchpointId, browserName, deviceId, deviceOS, deviceName, deviceType, sourceIP);
	e.setEnvironment(environment);

	TrackingEventDaoUtil.record(e);
	return 200;
    }

    public static int recordConversionEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv,
	    ContextSession ctxSession, String eventName) {
	String srcEventKey = StringUtil.safeString(params.get(TrackingApiParam.SRC_EVENT_KEY));
	String srcTouchpointId = StringUtil.safeString(params.get(TrackingApiParam.SOURCE_TOUCHPOINT_ID));
	String deviceId = StringUtil.safeString(params.get(TrackingApiParam.USER_DEVICE_ID));
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	int eventValue = 1;
	String transactionCode = StringUtil.safeString(params.get(TrackingApiParam.TRANSACTION_CODE));
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT), TrackingApiParam.DEV_ENV);
	return recordConversionEvent(environment, srcEventKey, deviceId, sourceIP, dv, ctxSession, srcTouchpointId,
		eventName, eventValue, transactionCode);
    }

    public static int recordConversionEvent(String environment, String srcEventKey, String deviceId, String sourceIP,
	    DeviceInfo dv, ContextSession ctxSession, String srcTouchpointId, String eventName, int eventValue,
	    String transactionCode) {
	String deviceName = dv.deviceName;
	String deviceOS = dv.deviceOs;

	String browserName = dv.browserName;
	String deviceType = dv.deviceType;
	String refTouchpointId = ctxSession.getRefTouchpointId();

	String refProfileId = ctxSession.getProfileId();
	int refProfileType = ctxSession.getProfileType();
	String sessionKey = ctxSession.getSessionKey();
	String observerId = ctxSession.getObserverId();

	// TODO
	int timeSpent = 1;
	
	ConversionEvent e = new ConversionEvent(observerId, sessionKey, eventName, eventValue, refProfileId,
		refProfileType, srcTouchpointId, refTouchpointId, browserName, deviceId, deviceOS, deviceName,
		deviceType, sourceIP, timeSpent, srcEventKey);
	e.setEnvironment(environment);
	ConversionEventDaoUtil.record(e);
	return 200;
    }
}
