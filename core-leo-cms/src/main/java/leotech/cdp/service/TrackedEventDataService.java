package leotech.cdp.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import leotech.cdp.dao.DeviceDaoUtil;
import leotech.cdp.dao.TrackingEventDao;
import leotech.cdp.dao.singleview.EventSingleDataView;
import leotech.cdp.model.analytics.ContextSession;
import leotech.cdp.model.analytics.TrackingEvent;
import leotech.cdp.model.customer.Device;
import leotech.cdp.model.journey.MediaChannelType;
import leotech.cdp.model.journey.Touchpoint;
import leotech.system.model.DataFilter;
import leotech.system.model.DeviceInfo;
import leotech.system.util.DeviceInfoUtil;

/**
 * @author Trieu Nguyen (Thomas)
 *
 */
public class TrackedEventDataService {

	private static final String PRODUCT_VIEW = "product-view";

	//
	public static int trackViewEvent(Date createdAt, ContextSession ctxSession, String srcObserverId, String environment,
			String deviceId, String sourceIP, DeviceInfo deviceInfo, String srcTouchpointName, String srcTouchpointUrl,
			String refTouchpointUrl, String touchpointRefDomain, String eventName, Map<String, String> eventData) {
		String deviceName = deviceInfo.deviceName;
		String deviceOS = deviceInfo.deviceOs;

		String browserName = deviceInfo.browserName;
		String deviceType = deviceInfo.deviceType;

		
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
				deviceType, sourceIP, createdAt);
		e.setEnvironment(environment);
		e.setEventData(eventData);

		TrackingEventDao.record(e);

		// TODO add to a thread
		Device userDevice = DeviceInfoUtil.getUserDevice(deviceInfo);
		DeviceDaoUtil.save(userDevice);
		String userDeviceId = userDevice.getId();
		
		ProfileDataService.updateProfileFromEvent(refProfileId, srcObserverId, srcTouchpointId, touchpointRefDomain, sourceIP, userDeviceId, eventName);
		return 201;
	}

	public static int trackActionEvent(Date createdAt, ContextSession ctxSession, String srcObserverId, String environment,
			String deviceId, String sourceIP, DeviceInfo dv, String srcTouchpointName, String srcTouchpointUrl,
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
				deviceType, sourceIP, createdAt);
		e.setEnvironment(environment);
		e.setFeedbackText(feedbackText);
		e.setEventData(eventData);

		TrackingEventDao.record(e);

		// TODO add to a thread
		Device userDevice = DeviceInfoUtil.getUserDevice(dv);
		DeviceDaoUtil.save(userDevice);
		String userDeviceId = userDevice.getId();
		
		ProfileDataService.updateProfileFromEvent(refProfileId, srcObserverId, srcTouchpointId, touchpointRefDomain,sourceIP, userDeviceId, eventName);
		return 221;
	}

	public static int trackConversionEvent(Date createdAt, ContextSession ctxSession, String srcObserverId, String environment,
			String srcEventKey, String deviceId, String sourceIP, DeviceInfo device, String srcTouchpointName,
			String srcTouchpointUrl, String refTouchpointUrl, String touchpointRefDomain, String eventName,
			long eventCount, String transactionCode, String feedbackText, Map<String, String> eventData) {
		String deviceName = device.deviceName;
		String deviceOS = device.deviceOs;

		String browserName = device.browserName;
		String deviceType = device.deviceType;

		String refProfileId = ctxSession.getProfileId();
		int refProfileType = ctxSession.getProfileType();
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
				deviceType, sourceIP, createdAt);
		e.setSrcEventKey(srcEventKey);
		e.setEnvironment(environment);
		e.setFeedbackText(feedbackText);
		e.setEventData(eventData);
		e.setTransactionCode(transactionCode);
		e.setConversion(true);

		TrackingEventDao.record(e);

		// TODO add to a thread
		Device userDevice = DeviceInfoUtil.getUserDevice(device);
		DeviceDaoUtil.save(userDevice);
		String userDeviceId = userDevice.getId();
		
		ProfileDataService.updateProfileFromEvent(refProfileId, srcObserverId, srcTouchpointId, touchpointRefDomain, sourceIP, userDeviceId, eventName);
		return 241;
	}

	public static List<EventSingleDataView> getEventActivityFlowOfProfile(String profileId, int startIndex,int numberResults) {
		// Engagement Event Activities
		List<EventSingleDataView> eventActivities = TrackingEventDao.getEventsByProfileId(profileId,new DataFilter(startIndex, numberResults));
		return eventActivities;
	}
	
	public static List<EventSingleDataView> getProductViewActivityFlowOfProfile(String profileId, int startIndex,int numberResults) {
		// Product Event Activities
		List<EventSingleDataView> eventActivities = TrackingEventDao.getTrackedEventsByProfileIdAndMetricName(profileId,PRODUCT_VIEW,new DataFilter(startIndex, numberResults));
		return eventActivities;
	}
	
}
