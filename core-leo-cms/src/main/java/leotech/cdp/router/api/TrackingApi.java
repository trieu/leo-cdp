package leotech.cdp.router.api;

import java.util.Map;

import com.google.gson.Gson;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import leotech.cdp.model.ContextSession;
import leotech.cdp.service.DeviceDataService;
import leotech.cdp.service.EventTrackingService;
import leotech.system.model.DeviceInfo;
import leotech.system.util.RequestInfoUtil;
import rfx.core.util.StringUtil;

public class TrackingApi {

    public static int recordViewEvent(HttpServerRequest req, MultiMap params, DeviceInfo device, ContextSession ctxSession,String eventName) {
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	
	String touchpointUrl = StringUtil.safeString(params.get(TrackingApiParam.TOUCHPOINT_URL));
	String deviceId = DeviceDataService.getDeviceId(params, device);
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),TrackingApiParam.DEV_ENV);
	Map<String,String> eventJsonData = RequestInfoUtil.getHashMapFromRequest(params, TrackingApiParam.EVENT_JSON_DATA);
	
	System.out.println(new Gson().toJson(eventJsonData));
	
	return EventTrackingService.recordViewEvent(ctxSession, environment, deviceId, sourceIP, device, touchpointUrl, eventName, eventJsonData);
    }

    public static int recordActionEvent(HttpServerRequest req, MultiMap params, DeviceInfo device, ContextSession ctxSession, String eventName) {
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	
	String touchpointUrl = StringUtil.safeString(params.get(TrackingApiParam.TOUCHPOINT_URL));
	String deviceId = DeviceDataService.getDeviceId(params, device);
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),TrackingApiParam.DEV_ENV);
	
	String feedbackText = StringUtil.safeString(params.get(TrackingApiParam.FEEDBACK_TEXT));
	Map<String,String> eventJsonData = RequestInfoUtil.getHashMapFromRequest(params, TrackingApiParam.EVENT_JSON_DATA);
	int eventCount = StringUtil.safeParseInt(eventJsonData.getOrDefault(TrackingApiParam.EVENT_VALUE, "1"));

	return EventTrackingService.recordActionEvent(ctxSession, environment, deviceId, sourceIP, device, touchpointUrl,
		eventName, eventCount, feedbackText, eventJsonData);
    }

    public static int recordConversionEvent(HttpServerRequest req, MultiMap params, DeviceInfo device, ContextSession ctxSession, String eventName) {
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	
	String srcEventKey = StringUtil.safeString(params.get(TrackingApiParam.SRC_EVENT_KEY));
	String srcTouchpointUrl = StringUtil.safeString(params.get(TrackingApiParam.TOUCHPOINT_URL));
	String deviceId = DeviceDataService.getDeviceId(params, device);
	String feedbackText = StringUtil.safeString(params.get(TrackingApiParam.FEEDBACK_TEXT));
	Map<String,String> extAttributes = RequestInfoUtil.getHashMapFromRequest(params, TrackingApiParam.EVENT_JSON_DATA);
	
	int eventCount = StringUtil.safeParseInt(extAttributes.getOrDefault(TrackingApiParam.EVENT_VALUE, "1"));
	String transactionCode = StringUtil.safeString(params.get(TrackingApiParam.TRANSACTION_CODE));
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),
		TrackingApiParam.DEV_ENV);

	return EventTrackingService.recordConversionEvent(ctxSession, environment, srcEventKey, deviceId, sourceIP, device,
		srcTouchpointUrl, eventName, eventCount, transactionCode, feedbackText, extAttributes);
    }

}
