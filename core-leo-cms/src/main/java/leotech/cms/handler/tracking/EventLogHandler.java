package leotech.cms.handler.tracking;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.http.HttpServerResponse;
import leotech.core.api.BaseApiHandler;
import leotech.system.model.DeviceInfo;
import leotech.system.model.GeoLocation;
import leotech.system.model.LogData;
import leotech.system.util.BeaconUtil;
import leotech.system.util.CookieUUIDUtil;
import leotech.system.util.DeviceInfoUtil;
import leotech.system.util.GeoLocationUtil;
import leotech.system.util.HttpTrackingUtil;
import leotech.system.util.RealtimeTrackingUtil;
import leotech.system.util.TrackingBeaconUtil;
import leotech.system.util.UserRedisUtil;
import rfx.core.util.HashUtil;
import rfx.core.util.StringUtil;

public class EventLogHandler extends BaseApiHandler {

    public static final String metricContent = "content";

    // for Ad log
    public static final String logAdConversionKey = "_ad_conversion";
    public static final String logAdClickKey = "_ad_click";

    public static void handle(HttpServerRequest req, HttpServerResponse resp, MultiMap outHeaders) {
	MultiMap params = req.params();
	String metric = params.get("metric");
	String cid = StringUtil.safeString(params.get("cid"));
	if (!cid.isEmpty()) {
	    String beacon = BeaconUtil.getParam(params, "beacon");
	    if (StringUtil.isEmpty(beacon)) {
		System.out.println("Beacon is Empty!");
		HttpTrackingUtil.trackingResponse(req);
		return;
	    }
	    long loggedTime = TrackingBeaconUtil.currentSystemTimeInSecond();

	    LogData adData = TrackingBeaconUtil.parseBeaconData(metric, beacon, loggedTime);
	    if (adData == null) {
		HttpTrackingUtil.trackingResponse(req);
		return;
	    }

	    String cId = adData.getContentId();
	    String useragent = StringUtil.safeString(req.getHeader(USER_AGENT));
	    DeviceInfo userDevice = DeviceInfoUtil.getDeviceInfo(useragent);
	    int platformId = userDevice.platformType;

	    String uuid = StringUtil.safeString(params.get("uuid"), NO_DATA);
	    int useg = StringUtil.safeParseInt(params.get("useg"), 0);
	    if (NO_DATA.equals((uuid))) {
		uuid = CookieUUIDUtil.generateCookieUUID(req, resp);
	    }

	    GeoLocation loc = GeoLocationUtil.processCookieGeoLocation(req, resp);
	    String locationId = String.valueOf(loc.getGeoNameId());

	    adData.setUuid(uuid);
	    adData.setDeviceId(userDevice.id);
	    adData.setDeviceType(userDevice.platformType);
	    adData.setUserSegmentId(useg);
	    adData.setLocationId(loc.getGeoNameId());

	    String refererHeaderUrl = StringUtil.safeString(req.headers().get(REFERER));
	    adData.setUrl(refererHeaderUrl);
	    adData.setHashUrl(HashUtil.hashUrl128Bit(refererHeaderUrl));

	    if (metric.equals(metricContent)) {
		realtimeLogging("ct", cId, loggedTime, platformId, uuid, locationId, true);
	    }
	}

	HttpTrackingUtil.trackingResponse(req);
	return;
    }

    public static void realtimeLogging(String metric, String cid, long loggedTime, int platformId, String uuid, String locationId, boolean countUserReach) {
	String kNew = metric + "-" + cid + "-" + platformId + "-" + "-" + locationId;
	String[] events = new String[] { metric, metric + "-" + cid, kNew };
	RealtimeTrackingUtil.updateEvent(loggedTime, events, true);
	if (countUserReach) {
	    UserRedisUtil.addPlayViewUser(loggedTime, cid, uuid);

	}
    }

}
