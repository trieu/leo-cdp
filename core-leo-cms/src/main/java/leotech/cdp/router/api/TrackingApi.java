package leotech.cdp.router.api;

import java.util.Date;
import java.util.Map;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import leotech.cdp.model.analytics.ContextSession;
import leotech.cdp.service.DeviceDataService;
import leotech.cdp.service.TrackedEventDataService;
import leotech.system.model.DeviceInfo;
import leotech.system.util.RequestInfoUtil;
import rfx.core.util.StringUtil;

public class TrackingApi {

	public static int recordViewEvent(HttpServerRequest req, MultiMap params, DeviceInfo device,
			ContextSession ctxSession, String eventName) {
		String sourceIP = RequestInfoUtil.getRemoteIP(req);

		String srcObserverId = params.get(TrackingApiParam.OBSERVER_ID);
		String srcTouchpointName = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_NAME));
		String srcTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_URL));
		String refTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_REFERRER_URL));
		String touchpointRefDomain = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_REFERRER_DOMAIN));
		
		String deviceId = DeviceDataService.getDeviceId(params, device);
		String environment = StringUtil.safeString(params.get(TrackingApiParam.DATA_ENVIRONMENT),
				TrackingApiParam.DEV_ENV);
		Map<String, String> eventJsonData = RequestInfoUtil.getHashMapFromRequestParams(params,
				TrackingApiParam.EVENT_JSON_DATA);

		//System.out.println(new Gson().toJson(eventJsonData));
		
		Date createdAt = new Date();

		return TrackedEventDataService.trackViewEvent(createdAt, ctxSession, srcObserverId, environment, deviceId, sourceIP, device,
				srcTouchpointName, srcTouchpointUrl, refTouchpointUrl, touchpointRefDomain, eventName, eventJsonData);
	}

	public static int recordActionEvent(HttpServerRequest req, MultiMap params, DeviceInfo device,
			ContextSession ctxSession, String eventName) {
		String sourceIP = RequestInfoUtil.getRemoteIP(req);

		String srcObserverId = params.get(TrackingApiParam.OBSERVER_ID);
		String srcTouchpointName = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_NAME));
		String srcTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_URL));
		String refTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_REFERRER_URL));
		String touchpointRefDomain = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_REFERRER_DOMAIN));
		
		String deviceId = DeviceDataService.getDeviceId(params, device);
		String environment = StringUtil.safeString(params.get(TrackingApiParam.DATA_ENVIRONMENT),
				TrackingApiParam.DEV_ENV);

		Map<String, String> eventJsonData = RequestInfoUtil.getHashMapFromRequestParams(params,
				TrackingApiParam.EVENT_JSON_DATA);
		int eventCount = 1;
		
		Date createdAt = new Date();

		return TrackedEventDataService.trackActionEvent(createdAt, ctxSession, srcObserverId, environment, deviceId, sourceIP, device,
				srcTouchpointName,srcTouchpointUrl, refTouchpointUrl,  touchpointRefDomain, eventName, eventCount, "", eventJsonData);
	}

	public static int recordConversionEvent(HttpServerRequest req, MultiMap params, DeviceInfo device,
			ContextSession ctxSession, String eventName) {
		String sourceIP = RequestInfoUtil.getRemoteIP(req);

		String srcEventKey = StringUtil.safeString(params.get(TrackingApiParam.SRC_EVENT_KEY));
		
		String srcObserverId = params.get(TrackingApiParam.OBSERVER_ID);
		String srcTouchpointName = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_NAME));
		String srcTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_URL));
		String refTouchpointUrl = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_REFERRER_URL));
		String touchpointRefDomain = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_REFERRER_DOMAIN));
		
		String deviceId = DeviceDataService.getDeviceId(params, device);
		
		Map<String, String> eventJsonData = RequestInfoUtil.getHashMapFromRequestParams(params,
				TrackingApiParam.EVENT_JSON_DATA);

		int eventCount = 1;
		String transactionCode = StringUtil.safeString(params.get(TrackingApiParam.TRANSACTION_CODE));
		String environment = StringUtil.safeString(params.get(TrackingApiParam.DATA_ENVIRONMENT),
				TrackingApiParam.DEV_ENV);
		
		Date createdAt = new Date();

		return TrackedEventDataService.trackConversionEvent(createdAt,  ctxSession, srcObserverId, environment, srcEventKey, deviceId, sourceIP,
				device, srcTouchpointName, srcTouchpointUrl, refTouchpointUrl, touchpointRefDomain, eventName, eventCount, transactionCode, "", eventJsonData);
	}

}
