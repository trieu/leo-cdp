package leotech.cdp.service;

import java.util.Date;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import leotech.cdp.dao.TargetMediaUnitDaoUtil;
import leotech.cdp.model.activation.TargetMediaUnit;
import leotech.cdp.model.analytics.ContextSession;
import leotech.cdp.model.journey.BehavioralEventMetric;
import leotech.cdp.router.api.TrackingApiParam;
import leotech.system.model.DeviceInfo;
import leotech.system.util.RequestInfoUtil;
import leotech.system.util.UrlUtil;
import rfx.core.util.StringUtil;

public class TargetMediaUnitService {
	static final String OBSERVER_ID = "leocd-click-redirect";

	public static String recordEventAndGetLandingPageUrl(String id, HttpServerRequest req, MultiMap params, DeviceInfo device) {
		
		TargetMediaUnit media = TargetMediaUnitDaoUtil.getById(id);
		
		if(media != null) {
			String eventName = "short-link-click";
			
			BehavioralEventMetric metric = FunnelDataService.getBehavioralEventMetric(media.getEventMetaDataId());
			if(metric != null) {
				eventName = metric.getEventName();
			}
			
			String profileId = media.getRefProfileId();
			String deviceId = DeviceDataService.getDeviceId(params, device);
			String sourceIP = RequestInfoUtil.getRemoteIP(req);
			
			String environment = StringUtil.safeString(params.get(TrackingApiParam.DATA_ENVIRONMENT),TrackingApiParam.PRO_ENV);
			
			String srcTouchpointName = media.getLandingPageName();
			String srcTouchpointUrl = media.getLandingPageUrl();
			String refTouchpointUrl = StringUtil.safeString(req.getHeader("Referer"));
			String touchpointRefDomain = UrlUtil.getHostName(refTouchpointUrl);
			
			
			// synch ContextSession with profile
			ContextSession ctxSession = ContextSessionService.getByProfileId(profileId);
			
			EventDataService.recordEvent(new Date(), ctxSession, OBSERVER_ID, environment, deviceId, sourceIP, device,
					srcTouchpointName,srcTouchpointUrl, refTouchpointUrl,  touchpointRefDomain, eventName );
			
			return srcTouchpointUrl;
		} else {
			System.err.println("TargetMediaUnit is null " + id);
		}
		
		return "";
	}
}
