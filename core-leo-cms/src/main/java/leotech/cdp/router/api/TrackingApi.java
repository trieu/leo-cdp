package leotech.cdp.router.api;

import java.util.Map;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import leotech.cdp.model.ContextSession;
import leotech.cdp.service.DeviceDataService;
import leotech.cdp.service.EventTrackingService;
import leotech.system.model.DeviceInfo;
import leotech.system.util.RequestInfoUtil;
import rfx.core.util.StringUtil;

public class TrackingApi {

    public static int recordViewEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv, ContextSession ctxSession,
	    String eventName) {
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	
	String touchpointUrl = StringUtil.safeString(params.get(TrackingApiParam.TOUCHPOINT_URL));
	String deviceId = DeviceDataService.getDeviceId(params, dv);
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),TrackingApiParam.DEV_ENV);
	Map<String,String> extAttributes = RequestInfoUtil.getHashMapFromRequest(params, TrackingApiParam.EVENT_EXT_ATTRS);
	
	return EventTrackingService.recordViewEvent(ctxSession, environment, deviceId, sourceIP, dv, touchpointUrl, eventName, extAttributes);
    }

    public static int recordActionEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv, ContextSession ctxSession, String eventName) {
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	
	String touchpointUrl = StringUtil.safeString(params.get(TrackingApiParam.TOUCHPOINT_URL));
	String deviceId = DeviceDataService.getDeviceId(params, dv);
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),TrackingApiParam.DEV_ENV);
	int eventValue = StringUtil.safeParseInt(params.get(TrackingApiParam.EVENT_VALUE), 1);
	String feedbackText = StringUtil.safeString(params.get(TrackingApiParam.FEEDBACK_TEXT));
	Map<String,String> extAttributes = RequestInfoUtil.getHashMapFromRequest(params, TrackingApiParam.EVENT_EXT_ATTRS);

	return EventTrackingService.recordActionEvent(ctxSession, environment, deviceId, sourceIP, dv, touchpointUrl,
		eventName, eventValue, feedbackText, extAttributes);
    }

    public static int recordConversionEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv, ContextSession ctxSession, String eventName) {
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	
	String srcEventKey = StringUtil.safeString(params.get(TrackingApiParam.SRC_EVENT_KEY));
	String srcTouchpointUrl = StringUtil.safeString(params.get(TrackingApiParam.TOUCHPOINT_URL));
	String deviceId = DeviceDataService.getDeviceId(params, dv);
	String feedbackText = StringUtil.safeString(params.get(TrackingApiParam.FEEDBACK_TEXT));
	Map<String,String> extAttributes = RequestInfoUtil.getHashMapFromRequest(params, TrackingApiParam.EVENT_EXT_ATTRS);
	
	long eventCount = 1;
	String transactionCode = StringUtil.safeString(params.get(TrackingApiParam.TRANSACTION_CODE));
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),
		TrackingApiParam.DEV_ENV);

	return EventTrackingService.recordConversionEvent(ctxSession, environment, srcEventKey, deviceId, sourceIP, dv,
		srcTouchpointUrl, eventName, eventCount, transactionCode, feedbackText, extAttributes);
    }

}
