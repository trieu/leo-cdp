package leotech.system.common;

import leotech.cdp.utils.EventTrackingUtil;
import leotech.cdp.utils.UserTrackingUtil;
import rfx.core.util.DateTimeUtil;

public abstract class BaseApiHandler {

    public static final String ORIGIN = "Origin";
    public static final String CONTENT_TYPE = "Content-Type";
    public static final String USER_AGENT = "User-Agent";
    public static final String REFERER = "Referer";
    

    public static final String NO_DATA = "0";
    public static final String ACCESS_CONTROL_ALLOW_ORIGIN = "Access-Control-Allow-Origin";
    public static final String CONTENT_TYPE_JSON = "application/json";
    public static final String CONTENT_TYPE_XML = "application/xml";
    public static final String CONTENT_TYPE_JAVASCRIPT = "text/javascript;charset=UTF-8";
    public static final String CONTENT_TYPE_MULTIPART = "multipart/form-data";
    public static final String CONTENT_TYPE_TEXT = "text/plain";
    public static final String CONTENT_TYPE_HTML = "text/html;charset=UTF-8";
    

    protected static void updateRealtimeEvent(String userId, String contentId, String categoryId, String pageId,
	    String networkId) {

	String eventKey = "req-" + contentId + "-" + categoryId + "-" + pageId + "-" + networkId;

	String[] events = new String[] { eventKey };
	int unixTime = DateTimeUtil.currentUnixTimestamp();
	EventTrackingUtil.updateEvent(unixTime, events, true);

	UserTrackingUtil.trackContentViewFromUser(unixTime, contentId, userId);

    }

}
