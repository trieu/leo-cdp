package leotech.cdp.service;

import java.util.Arrays;
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
public class EventDataService {

	// 3 important metric events for retail or e-commerce 
	public static final String PRODUCT_VIEW = "product-view";
	public static final String ADD_TO_CART = "add-to-cart";
	public static final String BUY = "buy";
	
	// re-targeting 
	public static final String ADS_RETARGETING = "ads-retargeting";
	public static final String EMAIL_RETARGETING = "email-retargeting";
	public static final String WEB_PUSH_RETARGETING = "web-push-retargeting";
	public static final String APP_PUSH_RETARGETING = "app-push-retargeting";
	public static final String SMS_RETARGETING = "sms-retargeting";
	
	// marketing cross-sales or value-added services to optimize CLV scoring model 
	public static final String EMAIL_MARKETING = "email-marketing";
	public static final String WEB_PUSH_MARKETING = "web-push-marketing";
	public static final String APP_PUSH_MARKETING = "app-push-marketing";

	public static int recordEvent(Date createdAt, ContextSession ctxSession, String srcObserverId, String environment,
			String deviceId, String sourceIP, DeviceInfo deviceInfo, String srcTouchpointName, String srcTouchpointUrl,
			String refTouchpointUrl, String touchpointRefDomain, String eventName, Map<String, String> eventData, String feedbackText) {
		return recordEvent(createdAt, ctxSession, srcObserverId, environment, deviceId, sourceIP, deviceInfo, srcTouchpointName, 
				srcTouchpointUrl, refTouchpointUrl, touchpointRefDomain, eventName, eventData, feedbackText, "");
	}
	
	public static int recordEvent(Date createdAt, ContextSession ctxSession, String srcObserverId, String environment,
			String deviceId, String sourceIP, DeviceInfo deviceInfo, String srcTouchpointName, String srcTouchpointUrl,
			String refTouchpointUrl, String touchpointRefDomain, String eventName, Map<String, String> eventData) {
		return recordEvent(createdAt, ctxSession, srcObserverId, environment, deviceId, sourceIP, deviceInfo, srcTouchpointName, 
				srcTouchpointUrl, refTouchpointUrl, touchpointRefDomain, eventName, eventData, "", "");
	}
	
	public static int recordEvent(Date createdAt, ContextSession ctxSession, String srcObserverId, String environment,
			String deviceId, String sourceIP, DeviceInfo deviceInfo, String srcTouchpointName, String srcTouchpointUrl,
			String refTouchpointUrl, String touchpointRefDomain, String eventName) {
		return recordEvent(createdAt, ctxSession, srcObserverId, environment, deviceId, sourceIP, deviceInfo, srcTouchpointName, 
				srcTouchpointUrl, refTouchpointUrl, touchpointRefDomain, eventName, null, "", "");
	}
	
	//
	public static int recordEvent(Date createdAt, ContextSession ctxSession, String srcObserverId, String environment,
			String deviceId, String sourceIP, DeviceInfo deviceInfo, String srcTouchpointName, String srcTouchpointUrl,
			String refTouchpointUrl, String touchpointRefDomain, String eventName, Map<String, String> eventData, String feedbackText, String transactionCode ) {
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
		e.setFeedbackText(feedbackText);
		e.setEventData(eventData);
		
		// event trigger for job scheduler
		if(eventName.equals(PRODUCT_VIEW)) {
			e.setProcessors(Arrays.asList(ADS_RETARGETING));
		} 
		else if(eventName.equals(ADD_TO_CART)) {
			 e.setProcessors(Arrays.asList(WEB_PUSH_MARKETING, ADS_RETARGETING, EMAIL_RETARGETING, APP_PUSH_MARKETING, SMS_RETARGETING));
		} 
		else if(eventName.equals(BUY)) {
			e.setConversion(true);
			e.setTransactionCode(transactionCode);
			e.setProcessors(Arrays.asList(EMAIL_MARKETING, WEB_PUSH_MARKETING, APP_PUSH_MARKETING));
		}

		TrackingEventDao.record(e);

		// TODO add to a thread
		Device userDevice = DeviceInfoUtil.getUserDevice(deviceInfo);
		DeviceDaoUtil.save(userDevice);
		String userDeviceId = userDevice.getId();
		
		ProfileDataService.updateProfileFromEvent(refProfileId, srcObserverId, srcTouchpointId, touchpointRefDomain, sourceIP, userDeviceId, eventName);
		return 201;
	}
	
	public static List<EventSingleDataView> getUnprocessedEventsOfProfile(String profileId, int startIndex,int numberResults) {
		// Unprocessed Event Data for single-view profile analytics
		List<EventSingleDataView> eventActivities = TrackingEventDao.getUnprocessedEventsByProfileId(profileId,new DataFilter(startIndex, numberResults));
		return eventActivities;
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
