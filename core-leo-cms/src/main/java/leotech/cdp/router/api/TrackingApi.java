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

	public static int recordViewEvent(HttpServerRequest req, MultiMap params, DeviceInfo device,
			ContextSession ctxSession, String eventName) {
		String sourceIP = RequestInfoUtil.getRemoteIP(req);

		String srcTouchpointName = StringUtil.decodeUrlUTF8(params.get(ObserverApiParam.TOUCHPOINT_NAME));
		String srcTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(ObserverApiParam.TOUCHPOINT_URL));
		String refTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(ObserverApiParam.TOUCHPOINT_REFERRER_URL));
		
		String deviceId = DeviceDataService.getDeviceId(params, device);
		String environment = StringUtil.safeString(params.get(ObserverApiParam.DATA_ENVIRONMENT),
				ObserverApiParam.DEV_ENV);
		Map<String, String> eventJsonData = RequestInfoUtil.getHashMapFromRequestParams(params,
				ObserverApiParam.EVENT_JSON_DATA);

		System.out.println(new Gson().toJson(eventJsonData));

		return EventTrackingService.recordViewEvent(ctxSession, environment, deviceId, sourceIP, device,
				srcTouchpointName, srcTouchpointUrl, refTouchpointUrl, eventName, eventJsonData);
	}

	public static int recordActionEvent(HttpServerRequest req, MultiMap params, DeviceInfo device,
			ContextSession ctxSession, String eventName) {
		String sourceIP = RequestInfoUtil.getRemoteIP(req);

		String srcTouchpointName = StringUtil.decodeUrlUTF8(params.get(ObserverApiParam.TOUCHPOINT_NAME));
		String srcTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(ObserverApiParam.TOUCHPOINT_URL));
		String refTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(ObserverApiParam.TOUCHPOINT_REFERRER_URL));
		
		String deviceId = DeviceDataService.getDeviceId(params, device);
		String environment = StringUtil.safeString(params.get(ObserverApiParam.DATA_ENVIRONMENT),
				ObserverApiParam.DEV_ENV);

		Map<String, String> eventJsonData = RequestInfoUtil.getHashMapFromRequestParams(params,
				ObserverApiParam.EVENT_JSON_DATA);
		int eventCount = 1;

		return EventTrackingService.recordActionEvent(ctxSession, environment, deviceId, sourceIP, device,
				srcTouchpointName,srcTouchpointUrl, refTouchpointUrl, eventName, eventCount, "", eventJsonData);
	}

	public static int recordConversionEvent(HttpServerRequest req, MultiMap params, DeviceInfo device,
			ContextSession ctxSession, String eventName) {
		String sourceIP = RequestInfoUtil.getRemoteIP(req);

		String srcEventKey = StringUtil.safeString(params.get(ObserverApiParam.SRC_EVENT_KEY));
		
		String srcTouchpointName = StringUtil.decodeUrlUTF8(params.get(ObserverApiParam.TOUCHPOINT_NAME));
		String srcTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(ObserverApiParam.TOUCHPOINT_URL));
		String refTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(ObserverApiParam.TOUCHPOINT_REFERRER_URL));
		
		String deviceId = DeviceDataService.getDeviceId(params, device);
		
		Map<String, String> eventJsonData = RequestInfoUtil.getHashMapFromRequestParams(params,
				ObserverApiParam.EVENT_JSON_DATA);

		int eventCount = 1;
		String transactionCode = StringUtil.safeString(params.get(ObserverApiParam.TRANSACTION_CODE));
		String environment = StringUtil.safeString(params.get(ObserverApiParam.DATA_ENVIRONMENT),
				ObserverApiParam.DEV_ENV);

		return EventTrackingService.recordConversionEvent(ctxSession, environment, srcEventKey, deviceId, sourceIP,
				device, srcTouchpointName, srcTouchpointUrl, refTouchpointUrl, eventName, eventCount, transactionCode, "", eventJsonData);
	}

}
