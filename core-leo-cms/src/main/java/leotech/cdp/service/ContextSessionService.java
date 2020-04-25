package leotech.cdp.service;

import com.google.openlocationcode.OpenLocationCode;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import leotech.cdp.dao.ContextSessionDaoUtil;
import leotech.cdp.model.ContextSession;
import leotech.system.model.DeviceInfo;
import leotech.system.model.GeoLocation;
import leotech.system.util.GeoLocationUtil;
import leotech.system.util.RequestInfoUtil;
import rfx.core.util.StringUtil;

public class ContextSessionService {

    public static ContextSession synchData(String locationCode, String userDeviceId, String ip, String host,
	    String appId, String touchpointId, String visitorId, String profileId, String fingerprintId) {

	ContextSession s = new ContextSession(locationCode, userDeviceId, ip, host, appId, touchpointId, visitorId,
		profileId, fingerprintId);

	// FIXME run async
	//ContextSessionDaoUtil.create(s);

	return s;
    }

    public static ContextSession synchData(HttpServerRequest req, MultiMap params, DeviceInfo dv) {
	String ip = RequestInfoUtil.getRemoteIP(req);
	GeoLocation loc = GeoLocationUtil.getGeoLocation(ip);

	String userDeviceId = StringUtil.safeString(params.get("dvid"));
	String host = req.host();
	String appId = StringUtil.safeString(params.get("appid"));
	String touchpointId = StringUtil.safeString(params.get("tpid"));
	String visitorId = StringUtil.safeString(params.get("vsid"));
	String profileId = StringUtil.safeString(params.get("pfid"));
	String fingerprintId = StringUtil.safeString(params.get("fgp"));
	String locationCode = loc.getLocationCode();
	return synchData(locationCode, userDeviceId, ip, host, appId, touchpointId, visitorId, profileId,
		fingerprintId);
    }
}
