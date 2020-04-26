package leotech.cdp.router.api;

import leotech.cdp.model.ContextSession;

public class TrackingApi {

    public static boolean record(ContextSession contextSession, String eventName) {
	return record(contextSession, eventName, 1);
    }

    public static boolean record(ContextSession contextSession, String eventName, int eventValue) {
	return true;
    }
    
    public static boolean record(ContextSession contextSession, String eventName, int eventValue, String transactionCode) {
	return true;
    }
}
