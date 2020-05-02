package leotech.cdp.service;

import java.util.Map;

import leotech.cdp.dao.ConversionEventDaoUtil;
import leotech.cdp.dao.TrackingEventDaoUtil;
import leotech.cdp.model.ContextSession;
import leotech.cdp.model.ConversionEvent;
import leotech.cdp.model.Touchpoint;
import leotech.cdp.model.TrackingEvent;
import leotech.system.model.DeviceInfo;

/**
 * @author Trieu Nguyen (Thomas)
 *
 */
public class EventTrackingService {
    
    //

    public static int recordViewEvent(ContextSession ctxSession, String environment, String deviceId, String sourceIP,
	    DeviceInfo dv, String touchpointUrl, String eventName, Map<String,String> extAttributes) {
	String deviceName = dv.deviceName;
	String deviceOS = dv.deviceOs;

	String browserName = dv.browserName;
	String deviceType = dv.deviceType;
	String refTouchpointId = ctxSession.getRefTouchpointId();

	int refProfileType = ctxSession.getProfileType();
	String refProfileId = ctxSession.getProfileId();
	String sessionKey = ctxSession.getSessionKey();
	String observerId = ctxSession.getObserverId();
	String mediaHost = ctxSession.getMediaHost();
	long eventCount = 1;

	String srcTouchpointId = TouchpointDataService.getTouchpointId(mediaHost, Touchpoint.TouchpointType.WEBSITE, touchpointUrl);
	TrackingEvent e = new TrackingEvent(observerId, sessionKey, eventName, eventCount, refProfileId, refProfileType,
		srcTouchpointId , refTouchpointId, browserName, deviceId, deviceOS, deviceName, deviceType, sourceIP);
	e.setEnvironment(environment);

	TrackingEventDaoUtil.record(e);
	return 201;
    }

    public static int recordActionEvent(ContextSession ctxSession, String environment, String deviceId, String sourceIP,
	    DeviceInfo dv, String touchpointUrl, String eventName, long eventCount, String feedbackText, Map<String,String> extAttributes) {

	String deviceName = dv.deviceName;
	String deviceOS = dv.deviceOs;

	String browserName = dv.browserName;
	String deviceType = dv.deviceType;
	String refTouchpointId = ctxSession.getRefTouchpointId();

	int refProfileType = ctxSession.getProfileType();
	String refProfileId = ctxSession.getProfileId();
	String sessionKey = ctxSession.getSessionKey();
	String observerId = ctxSession.getObserverId();
	String mediaHost = ctxSession.getMediaHost();
	
	String srcTouchpointId = TouchpointDataService.getTouchpointId(mediaHost, Touchpoint.TouchpointType.WEBSITE, touchpointUrl);
	
	TrackingEvent e = new TrackingEvent(observerId, sessionKey, eventName, eventCount, refProfileId, refProfileType,
		srcTouchpointId, refTouchpointId, browserName, deviceId, deviceOS, deviceName, deviceType, sourceIP);
	e.setEnvironment(environment);
	e.setFeedbackText(feedbackText);
	e.setExtAttributes(extAttributes);

	TrackingEventDaoUtil.record(e);
	return 221;
    }

    public static int recordConversionEvent(ContextSession ctxSession, String environment, String srcEventKey,
	    String deviceId, String sourceIP, DeviceInfo dv, String touchpointUrl, String eventName, long eventCount,
	    String transactionCode, String feedbackText, Map<String,String> extAttributes) {
	String deviceName = dv.deviceName;
	String deviceOS = dv.deviceOs;

	String browserName = dv.browserName;
	String deviceType = dv.deviceType;
	String refTouchpointId = ctxSession.getRefTouchpointId();

	String refProfileId = ctxSession.getProfileId();
	int refProfileType = ctxSession.getProfileType();
	String sessionKey = ctxSession.getSessionKey();
	String observerId = ctxSession.getObserverId();
	String mediaHost = ctxSession.getMediaHost();

	// TODO
	int timeSpent = 1;
	String srcTouchpointId = TouchpointDataService.getTouchpointId(mediaHost, Touchpoint.TouchpointType.WEBSITE, touchpointUrl);

	ConversionEvent e = new ConversionEvent(observerId, sessionKey, eventName, eventCount, refProfileId,
		refProfileType, srcTouchpointId, refTouchpointId, browserName, deviceId, deviceOS, deviceName,
		deviceType, sourceIP, timeSpent, srcEventKey);
	e.setEnvironment(environment);
	e.setFeedbackText(feedbackText);
	e.setExtAttributes(extAttributes);
	
	ConversionEventDaoUtil.record(e);
	return 241;
    }
}
