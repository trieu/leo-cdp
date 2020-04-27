package leotech.cdp.service;

import org.joda.time.DateTime;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import leotech.cdp.dao.ContextSessionDaoUtil;
import leotech.cdp.model.ContextSession;
import leotech.cdp.model.Profile;
import leotech.cdp.router.api.TrackingApiParam;
import leotech.system.model.DeviceInfo;
import leotech.system.model.GeoLocation;
import leotech.system.util.GeoLocationUtil;
import leotech.system.util.RequestInfoUtil;
import redis.clients.jedis.Pipeline;
import redis.clients.jedis.ShardedJedisPool;
import redis.clients.jedis.exceptions.JedisException;
import rfx.core.configs.RedisConfigs;
import rfx.core.nosql.jedis.RedisCommand;
import rfx.core.util.StringUtil;

public class ContextSessionService {

    public static final int AFTER_30_MINUTES = 1800;
    static ShardedJedisPool jedisPool = RedisConfigs.load().get("realtimeDataStats").getShardedJedisPool();

    public static ContextSession createContextSession(String observerId, DateTime dateTime, String dateTimeKey,
	    String locationCode, String userDeviceId, String ip, String mediaHost, String appId, String touchpointId,
	    String visitorId, String fingerprintId, String environment) {

	ContextSession s = new ContextSession(observerId, dateTime, dateTimeKey, locationCode, userDeviceId, ip,
		mediaHost, appId, touchpointId, visitorId, fingerprintId, environment);

	return s;
    }

    public static ContextSession createContextSession(HttpServerRequest req, MultiMap params, DeviceInfo dv,DateTime dateTime, String dateTimeKey) {
	String ip = RequestInfoUtil.getRemoteIP(req);
	GeoLocation loc = GeoLocationUtil.getGeoLocation(ip);

	String observerId = StringUtil.safeString(params.get(TrackingApiParam.OBSERVER_ID));
	String userDeviceId = StringUtil.safeString(params.get(TrackingApiParam.USER_DEVICE_ID));
	String mediaHost = StringUtil.safeString(params.get(TrackingApiParam.MEDIA_HOST));
	String appId = StringUtil.safeString(params.get(TrackingApiParam.APP_ID));
	String initTouchpointId = StringUtil.safeString(params.get(TrackingApiParam.INIT_TOUCHPOINT_ID));
	
	String visitorId = StringUtil.safeString(params.get(TrackingApiParam.VISITOR_ID));
	String email = StringUtil.safeString(params.get(TrackingApiParam.EMAIL));
	String phone = StringUtil.safeString(params.get(TrackingApiParam.PHONE));

	String fingerprintId = StringUtil.safeString(params.get(TrackingApiParam.FINGERPRINT_ID));
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),TrackingApiParam.DEV_ENV);
	String locationCode = loc.getLocationCode();

	ContextSession ctxSession = createContextSession(observerId, dateTime, locationCode, dateTimeKey, userDeviceId,
		ip, mediaHost, appId, initTouchpointId, visitorId, fingerprintId, environment);

	
	String ctxSessionKey = ctxSession.getSessionKey();
	
	// load profile ID from DB
	Profile profile = ProfileDataService.getProfile(ctxSessionKey, visitorId, observerId, initTouchpointId, ip, userDeviceId, email, phone);
	String profileId = profile.getId();
	int profileType = profile.getType();

	// FIXME run async to save session to DB
	ctxSession.setProfileId(profileId);
	ctxSession.setProfileType(profileType);
	ContextSessionDaoUtil.create(ctxSession);
	
	return ctxSession;
    }

    public static ContextSession synchData(final String clientSessionKey, HttpServerRequest req, MultiMap params,
	    DeviceInfo dv) {
	RedisCommand<ContextSession> cmd = new RedisCommand<ContextSession>(jedisPool) {
	    @Override
	    protected ContextSession build() throws JedisException {
		String dateTimeKey = null;
		if (StringUtil.isNotEmpty(clientSessionKey)) {
		    dateTimeKey = jedis.get(clientSessionKey);
		}
		ContextSession ctxSession = null;
		if (dateTimeKey == null) {

		    // the session is expired, so create a new one and commit to database
		    DateTime dateTime = new DateTime();
		    ctxSession = createContextSession(req, params, dv, dateTime, dateTimeKey);
		    dateTimeKey = ContextSession.getSessionDateTimeKey(dateTime);
		    String newSessionKey = ctxSession.getSessionKey();

		    Pipeline p = jedis.pipelined();
		    p.set(newSessionKey, dateTimeKey);
		    p.expire(newSessionKey, AFTER_30_MINUTES);
		    p.sync();

		} else {

		    // get from database for event recording
		    ctxSession = ContextSessionDaoUtil.getByKey(clientSessionKey);
		}
		return ctxSession;
	    }
	};

	return cmd.execute();
    }

}
