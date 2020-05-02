package leotech.cdp.router.api;

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
	String touchpointUrl = StringUtil.safeString(params.get(TrackingApiParam.TOUCHPOINT_URL));
	String deviceId = DeviceDataService.getDeviceId(params, dv);
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),TrackingApiParam.DEV_ENV);
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	
	return EventTrackingService.recordViewEvent(ctxSession, environment, deviceId, sourceIP, dv, touchpointUrl,
		eventName);
    }

    public static int recordActionEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv,
	    ContextSession ctxSession, String eventName) {
	String touchpointUrl = StringUtil.safeString(params.get(TrackingApiParam.TOUCHPOINT_URL));
	String deviceId = DeviceDataService.getDeviceId(params, dv);
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),
		TrackingApiParam.DEV_ENV);
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	int eventValue = StringUtil.safeParseInt(params.get(TrackingApiParam.EVENT_VALUE), 1);

	return EventTrackingService.recordActionEvent(ctxSession, environment, deviceId, sourceIP, dv, touchpointUrl,
		eventName, eventValue);
    }

    public static int recordConversionEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv,
	    ContextSession ctxSession, String eventName) {
	String srcEventKey = StringUtil.safeString(params.get(TrackingApiParam.SRC_EVENT_KEY));
	String srcTouchpointUrl = StringUtil.safeString(params.get(TrackingApiParam.TOUCHPOINT_URL));
	String deviceId = DeviceDataService.getDeviceId(params, dv);
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	int eventValue = 1;
	String transactionCode = StringUtil.safeString(params.get(TrackingApiParam.TRANSACTION_CODE));
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),
		TrackingApiParam.DEV_ENV);

	return EventTrackingService.recordConversionEvent(ctxSession, environment, srcEventKey, deviceId, sourceIP, dv,
		srcTouchpointUrl, eventName, eventValue, transactionCode);
    }

}
