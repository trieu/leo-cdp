package leotech.cdp.service;

import leotech.cdp.dao.ConversionEventDaoUtil;
import leotech.cdp.dao.TrackingEventDaoUtil;
import leotech.cdp.model.ContextSession;
import leotech.cdp.model.ConversionEvent;
import leotech.cdp.model.TrackingEvent;
import leotech.system.model.DeviceInfo;

public class EventDataService {

    public static int recordViewEvent(ContextSession ctxSession, String environment, String deviceId, String sourceIP,
	    DeviceInfo dv, String srcTouchpointId, String eventName) {
	String deviceName = dv.deviceName;
	String deviceOS = dv.deviceOs;

	String browserName = dv.browserName;
	String deviceType = dv.deviceType;
	String refTouchpointId = ctxSession.getRefTouchpointId();

	int refProfileType = ctxSession.getProfileType();
	String refProfileId = ctxSession.getProfileId();
	String sessionKey = ctxSession.getSessionKey();
	String observerId = ctxSession.getObserverId();
	int eventValue = 1;

	TrackingEvent e = new TrackingEvent(observerId, sessionKey, eventName, eventValue, refProfileId, refProfileType,
		srcTouchpointId, refTouchpointId, browserName, deviceId, deviceOS, deviceName, deviceType, sourceIP);
	e.setEnvironment(environment);

	TrackingEventDaoUtil.record(e);
	return 201;
    }

    public static int recordActionEvent(ContextSession ctxSession, String environment, String deviceId, String sourceIP,
	    DeviceInfo dv, String srcTouchpointId, String eventName, int eventValue) {

	String deviceName = dv.deviceName;
	String deviceOS = dv.deviceOs;

	String browserName = dv.browserName;
	String deviceType = dv.deviceType;
	String refTouchpointId = ctxSession.getRefTouchpointId();

	int refProfileType = ctxSession.getProfileType();
	String refProfileId = ctxSession.getProfileId();
	String sessionKey = ctxSession.getSessionKey();
	String observerId = ctxSession.getObserverId();
	TrackingEvent e = new TrackingEvent(observerId, sessionKey, eventName, eventValue, refProfileId, refProfileType,
		srcTouchpointId, refTouchpointId, browserName, deviceId, deviceOS, deviceName, deviceType, sourceIP);
	e.setEnvironment(environment);

	TrackingEventDaoUtil.record(e);
	return 221;
    }

    public static int recordConversionEvent(ContextSession ctxSession, String environment, String srcEventKey,
	    String deviceId, String sourceIP, DeviceInfo dv, String srcTouchpointId, String eventName, int eventValue,
	    String transactionCode) {
	String deviceName = dv.deviceName;
	String deviceOS = dv.deviceOs;

	String browserName = dv.browserName;
	String deviceType = dv.deviceType;
	String refTouchpointId = ctxSession.getRefTouchpointId();

	String refProfileId = ctxSession.getProfileId();
	int refProfileType = ctxSession.getProfileType();
	String sessionKey = ctxSession.getSessionKey();
	String observerId = ctxSession.getObserverId();

	// TODO
	int timeSpent = 1;

	ConversionEvent e = new ConversionEvent(observerId, sessionKey, eventName, eventValue, refProfileId,
		refProfileType, srcTouchpointId, refTouchpointId, browserName, deviceId, deviceOS, deviceName,
		deviceType, sourceIP, timeSpent, srcEventKey);
	e.setEnvironment(environment);
	ConversionEventDaoUtil.record(e);
	return 241;
    }
}
