package leotech.cdp.router.api;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import leotech.cdp.model.ContextSession;
import leotech.cdp.service.DeviceDataService;
import leotech.cdp.service.EventDataService;
import leotech.system.model.DeviceInfo;
import leotech.system.util.RequestInfoUtil;
import rfx.core.util.StringUtil;

public class TrackingApi {

    public static int recordViewEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv, ContextSession ctxSession,
	    String eventName) {
	String srcTouchpointId = StringUtil.safeString(params.get(TrackingApiParam.SOURCE_TOUCHPOINT_ID));
	String deviceId = DeviceDataService.getDeviceId(params, dv);
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),TrackingApiParam.DEV_ENV);
	String sourceIP = RequestInfoUtil.getRemoteIP(req);

	return EventDataService.recordViewEvent(ctxSession, environment, deviceId, sourceIP, dv, srcTouchpointId,
		eventName);
    }

    public static int recordActionEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv,
	    ContextSession ctxSession, String eventName) {
	String srcTouchpointId = StringUtil.safeString(params.get(TrackingApiParam.SOURCE_TOUCHPOINT_ID));
	String deviceId = DeviceDataService.getDeviceId(params, dv);
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),
		TrackingApiParam.DEV_ENV);
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	int eventValue = StringUtil.safeParseInt(params.get(TrackingApiParam.EVENT_VALUE), 1);

	return EventDataService.recordActionEvent(ctxSession, environment, deviceId, sourceIP, dv, srcTouchpointId,
		eventName, eventValue);
    }

    public static int recordConversionEvent(HttpServerRequest req, MultiMap params, DeviceInfo dv,
	    ContextSession ctxSession, String eventName) {
	String srcEventKey = StringUtil.safeString(params.get(TrackingApiParam.SRC_EVENT_KEY));
	String srcTouchpointId = StringUtil.safeString(params.get(TrackingApiParam.SOURCE_TOUCHPOINT_ID));
	String deviceId = DeviceDataService.getDeviceId(params, dv);
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	int eventValue = 1;
	String transactionCode = StringUtil.safeString(params.get(TrackingApiParam.TRANSACTION_CODE));
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),
		TrackingApiParam.DEV_ENV);

	return EventDataService.recordConversionEvent(ctxSession, environment, srcEventKey, deviceId, sourceIP, dv,
		srcTouchpointId, eventName, eventValue, transactionCode);
    }

}
