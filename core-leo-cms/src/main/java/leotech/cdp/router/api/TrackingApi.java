package leotech.cdp.router.api;

import java.util.Map;

import com.google.gson.Gson;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import leotech.cdp.model.audience.ContextSession;
import leotech.cdp.service.DeviceDataService;
import leotech.cdp.service.EventTrackingService;
import leotech.system.model.DeviceInfo;
import leotech.system.util.RequestInfoUtil;
import rfx.core.util.StringUtil;

public class TrackingApi {

	public static int recordViewEvent(HttpServerRequest req, MultiMap params, DeviceInfo device,
			ContextSession ctxSession, String eventName) {
		String sourceIP = RequestInfoUtil.getRemoteIP(req);

		String srcTouchpointName = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_NAME));
		String srcTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_URL));
		String refTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_REFERRER_URL));
		String touchpointRefDomain = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_REFERRER_DOMAIN));
		
		String deviceId = DeviceDataService.getDeviceId(params, device);
		String environment = StringUtil.safeString(params.get(ApiParamKey.DATA_ENVIRONMENT),
				ApiParamKey.DEV_ENV);
		Map<String, String> eventJsonData = RequestInfoUtil.getHashMapFromRequestParams(params,
				ApiParamKey.EVENT_JSON_DATA);

		System.out.println(new Gson().toJson(eventJsonData));

		return EventTrackingService.recordViewEvent(ctxSession, environment, deviceId, sourceIP, device,
				srcTouchpointName, srcTouchpointUrl, refTouchpointUrl, touchpointRefDomain, eventName, eventJsonData);
	}

	public static int recordActionEvent(HttpServerRequest req, MultiMap params, DeviceInfo device,
			ContextSession ctxSession, String eventName) {
		String sourceIP = RequestInfoUtil.getRemoteIP(req);

		String srcTouchpointName = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_NAME));
		String srcTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_URL));
		String refTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_REFERRER_URL));
		String touchpointRefDomain = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_REFERRER_DOMAIN));
		
		String deviceId = DeviceDataService.getDeviceId(params, device);
		String environment = StringUtil.safeString(params.get(ApiParamKey.DATA_ENVIRONMENT),
				ApiParamKey.DEV_ENV);

		Map<String, String> eventJsonData = RequestInfoUtil.getHashMapFromRequestParams(params,
				ApiParamKey.EVENT_JSON_DATA);
		int eventCount = 1;

		return EventTrackingService.recordActionEvent(ctxSession, environment, deviceId, sourceIP, device,
				srcTouchpointName,srcTouchpointUrl, refTouchpointUrl,  touchpointRefDomain, eventName, eventCount, "", eventJsonData);
	}

	public static int recordConversionEvent(HttpServerRequest req, MultiMap params, DeviceInfo device,
			ContextSession ctxSession, String eventName) {
		String sourceIP = RequestInfoUtil.getRemoteIP(req);

		String srcEventKey = StringUtil.safeString(params.get(ApiParamKey.SRC_EVENT_KEY));
		
		String srcTouchpointName = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_NAME));
		String srcTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_URL));
		String refTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_REFERRER_URL));
		String touchpointRefDomain = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_REFERRER_DOMAIN));
		
		String deviceId = DeviceDataService.getDeviceId(params, device);
		
		Map<String, String> eventJsonData = RequestInfoUtil.getHashMapFromRequestParams(params,
				ApiParamKey.EVENT_JSON_DATA);

		int eventCount = 1;
		String transactionCode = StringUtil.safeString(params.get(ApiParamKey.TRANSACTION_CODE));
		String environment = StringUtil.safeString(params.get(ApiParamKey.DATA_ENVIRONMENT),
				ApiParamKey.DEV_ENV);

		return EventTrackingService.recordConversionEvent(ctxSession, environment, srcEventKey, deviceId, sourceIP,
				device, srcTouchpointName, srcTouchpointUrl, refTouchpointUrl, touchpointRefDomain, eventName, eventCount, transactionCode, "", eventJsonData);
	}

}
