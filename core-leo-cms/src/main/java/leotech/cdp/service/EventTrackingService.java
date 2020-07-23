package leotech.cdp.service;

import java.util.Map;

import leotech.cdp.dao.ConversionEventDaoUtil;
import leotech.cdp.dao.TrackingEventDaoUtil;
import leotech.cdp.model.customer.ContextSession;
import leotech.cdp.model.customer.ConversionEvent;
import leotech.cdp.model.customer.TrackingEvent;
import leotech.cdp.model.marketing.MediaChannelType;
import leotech.cdp.model.marketing.Touchpoint;
import leotech.system.model.DeviceInfo;

/**
 * @author Trieu Nguyen (Thomas)
 *
 */
public class EventTrackingService {

	//

	public static int recordViewEvent(ContextSession ctxSession, String srcObserverId, String environment, String deviceId,
			String sourceIP, DeviceInfo dv, String srcTouchpointName, String srcTouchpointUrl,
			String refTouchpointUrl, String touchpointRefDomain, String eventName, Map<String, String> eventData) {
		String deviceName = dv.deviceName;
		String deviceOS = dv.deviceOs;

		String browserName = dv.browserName;
		String deviceType = dv.deviceType;

		int refProfileType = ctxSession.getProfileType();
		String refProfileId = ctxSession.getProfileId();
		String sessionKey = ctxSession.getSessionKey();

		// owned media has data from itself
		boolean isFromOwnedMedia = ctxSession.getMediaHost().equals(touchpointRefDomain);

		long eventCount = 1;

		// touch-point info process
		Touchpoint refTouchPoint = TouchpointDataService.getOrCreateWebTouchpoint(touchpointRefDomain,
				MediaChannelType.WEB_URL, refTouchpointUrl, isFromOwnedMedia);
		Touchpoint srcTouchpoint = TouchpointDataService.getOrCreateWebTouchpoint(srcTouchpointName,
				MediaChannelType.WEB_URL, srcTouchpointUrl);
		String refTouchpointId = refTouchPoint.getId();
		String srcTouchpointId = srcTouchpoint.getId();

		TrackingEvent e = new TrackingEvent(srcObserverId, sessionKey, eventName, eventCount, refProfileId,
				refProfileType, srcTouchpointId, refTouchpointId, browserName, deviceId, deviceOS, deviceName,
				deviceType, sourceIP);
		e.setEnvironment(environment);
		e.setEventData(eventData);

		TrackingEventDaoUtil.record(e);
		
		//FIXME
		String userDeviceId = "";
		ProfileDataService.updateProfileFromEvent(refProfileId, srcObserverId, srcTouchpointId, touchpointRefDomain, sourceIP, userDeviceId);
		return 201;
	}

	public static int recordActionEvent(ContextSession ctxSession, String srcObserverId, String environment, String deviceId,
			String sourceIP, DeviceInfo dv, String srcTouchpointName, String srcTouchpointUrl,
			String refTouchpointUrl, String touchpointRefDomain, String eventName, long eventCount,
			String feedbackText, Map<String, String> eventData) {

		String deviceName = dv.deviceName;
		String deviceOS = dv.deviceOs;

		String browserName = dv.browserName;
		String deviceType = dv.deviceType;

		int refProfileType = ctxSession.getProfileType();
		String refProfileId = ctxSession.getProfileId();
		String sessionKey = ctxSession.getSessionKey();
		
		// owned media has data from itself
		boolean isFromOwnedMedia = ctxSession.getMediaHost().equals(touchpointRefDomain);

		// touch-point info process
		Touchpoint refTouchPoint = TouchpointDataService.getOrCreateWebTouchpoint(touchpointRefDomain,
				MediaChannelType.WEB_URL, refTouchpointUrl, isFromOwnedMedia);
		Touchpoint srcTouchpoint = TouchpointDataService.getOrCreateWebTouchpoint(srcTouchpointName,
				MediaChannelType.WEB_URL, srcTouchpointUrl);
		String refTouchpointId = refTouchPoint.getId();
		String srcTouchpointId = srcTouchpoint.getId();

		TrackingEvent e = new TrackingEvent(srcObserverId, sessionKey, eventName, eventCount, refProfileId,
				refProfileType, srcTouchpointId, refTouchpointId, browserName, deviceId, deviceOS, deviceName,
				deviceType, sourceIP);
		e.setEnvironment(environment);
		e.setFeedbackText(feedbackText);
		e.setEventData(eventData);

		TrackingEventDaoUtil.record(e);
		
		String userDeviceId = "";
		ProfileDataService.updateProfileFromEvent(refProfileId, srcObserverId, srcTouchpointId, touchpointRefDomain, sourceIP, userDeviceId);
		return 221;
	}

	public static int recordConversionEvent(ContextSession ctxSession, String srcObserverId, String environment, String srcEventKey,
			String deviceId, String sourceIP, DeviceInfo dv, String srcTouchpointName, String srcTouchpointUrl,
			String refTouchpointUrl, String touchpointRefDomain, String eventName, long eventCount,
			String transactionCode, String feedbackText, Map<String, String> eventData) {
		String deviceName = dv.deviceName;
		String deviceOS = dv.deviceOs;

		String browserName = dv.browserName;
		String deviceType = dv.deviceType;

		String refProfileId = ctxSession.getProfileId();
		int refProfileType = ctxSession.getProfileType();
		String sessionKey = ctxSession.getSessionKey();

		// owned media has data from itself
		boolean isFromOwnedMedia = ctxSession.getMediaHost().equals(touchpointRefDomain);

		// TODO
		int timeSpent = 1;

		// touch-point info process
		Touchpoint refTouchPoint = TouchpointDataService.getOrCreateWebTouchpoint(touchpointRefDomain,
				MediaChannelType.WEB_URL, refTouchpointUrl, isFromOwnedMedia);
		Touchpoint srcTouchpoint = TouchpointDataService.getOrCreateWebTouchpoint(srcTouchpointName,
				MediaChannelType.WEB_URL, srcTouchpointUrl);
		String refTouchpointId = refTouchPoint.getId();
		String srcTouchpointId = srcTouchpoint.getId();

		ConversionEvent e = new ConversionEvent(srcObserverId, sessionKey, eventName, eventCount, refProfileId,
				refProfileType, srcTouchpointId, refTouchpointId, browserName, deviceId, deviceOS, deviceName,
				deviceType, sourceIP, timeSpent, srcEventKey);
		e.setEnvironment(environment);
		e.setFeedbackText(feedbackText);
		e.setEventData(eventData);

		ConversionEventDaoUtil.record(e);
		
		String userDeviceId = "";
		ProfileDataService.updateProfileFromEvent(refProfileId, srcObserverId, srcTouchpointId, touchpointRefDomain, sourceIP, userDeviceId);
		return 241;
	}
}
