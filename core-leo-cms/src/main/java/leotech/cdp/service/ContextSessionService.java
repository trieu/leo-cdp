package leotech.cdp.service;

import org.joda.time.DateTime;

import com.google.gson.Gson;

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

   

    static ContextSession createContextSession(HttpServerRequest req, MultiMap params, DeviceInfo dv, DateTime dateTime,
	    String dateTimeKey) {
	String ip = RequestInfoUtil.getRemoteIP(req);
	GeoLocation loc = GeoLocationUtil.getGeoLocation(ip);

	String observerId = StringUtil.safeString(params.get(TrackingApiParam.OBSERVER_ID));
	String userDeviceId = DeviceDataService.getDeviceId(params, dv);
	String mediaHost = StringUtil.safeString(params.get(TrackingApiParam.MEDIA_HOST));
	String appId = StringUtil.safeString(params.get(TrackingApiParam.APP_ID));
	String touchpointId = StringUtil.safeString(params.get(TrackingApiParam.INIT_TOUCHPOINT_ID));

	String visitorId = StringUtil.safeString(params.get(TrackingApiParam.VISITOR_ID));
	String email = StringUtil.safeString(params.get(TrackingApiParam.EMAIL));
	String phone = StringUtil.safeString(params.get(TrackingApiParam.PHONE));

	String loginId = StringUtil.safeString(params.get(TrackingApiParam.LOGIN_ID));
	String loginIdProviderName = StringUtil.safeString(params.get(TrackingApiParam.LOGIN_PROVIDER_NAME));

	String fingerprintId = StringUtil.safeString(params.get(TrackingApiParam.FINGERPRINT_ID));
	String environment = StringUtil.safeString(params.get(TrackingApiParam.TRACKING_ENVIRONMENT),
		TrackingApiParam.DEV_ENV);
	String locationCode = loc.getLocationCode();

	ContextSession ctxSession = new ContextSession(observerId, dateTime, dateTimeKey, locationCode, userDeviceId, ip,
		mediaHost, appId, touchpointId, visitorId, email, fingerprintId, environment);

	String ctxSessionKey = ctxSession.getSessionKey();

	// load profile ID from DB
	Profile profile = ProfileDataService.getOrCreateProfile(ctxSessionKey, visitorId, observerId, touchpointId,
		ip, userDeviceId, email, phone);
	String profileId = profile.getId();
	int profileType = profile.getType();

	// FIXME run async to save session to DB
	ctxSession.setProfileId(profileId);
	ctxSession.setProfileType(profileType);
	ctxSession.setLoginId(loginId);
	ctxSession.setLoginProviderName(loginIdProviderName);

	ContextSessionDaoUtil.create(ctxSession);

	return ctxSession;
    }

    public static ContextSession synchData(final String clientSessionKey, HttpServerRequest req, MultiMap params,
	    DeviceInfo device) {
	RedisCommand<ContextSession> cmd = new RedisCommand<ContextSession>(jedisPool) {
	    @Override
	    protected ContextSession build() throws JedisException {
		String json = null;
		if (StringUtil.isNotEmpty(clientSessionKey)) {
		    json = jedis.get(clientSessionKey);
		}

		ContextSession ctxSession = null;
		DateTime dateTime = new DateTime();
		String dateTimeKey = ContextSession.getSessionDateTimeKey(dateTime);
		
		if (json == null) {
		    
		    // the session is expired, so create a new one and commit to database
		    ctxSession = createContextSession(req, params, device, dateTime, dateTimeKey);
		    String newSessionKey = ctxSession.getSessionKey();
		    String sessionJson = new Gson().toJson(ctxSession);

		    Pipeline p = jedis.pipelined();
		    p.set(newSessionKey, sessionJson);
		    p.expire(newSessionKey, AFTER_30_MINUTES);
		    p.sync();

		} else {

		    // get from database for event recording
		    ctxSession = new Gson().fromJson(json, ContextSession.class);
		   
		}
		return ctxSession;
	    }
	};

	return cmd.execute();
    }

    public static ContextSession init(HttpServerRequest req, MultiMap params, DeviceInfo device) {
	RedisCommand<ContextSession> cmd = new RedisCommand<ContextSession>(jedisPool) {
	    @Override
	    protected ContextSession build() throws JedisException {

		ContextSession ctxSession = null;
		DateTime dateTime = new DateTime();
		String dateTimeKey = ContextSession.getSessionDateTimeKey(dateTime);

		// create a new one and commit to database
		ctxSession = createContextSession(req, params, device, dateTime, dateTimeKey);

		String newSessionKey = ctxSession.getSessionKey();
		String sessionJson = new Gson().toJson(ctxSession);

		Pipeline p = jedis.pipelined();
		p.set(newSessionKey, sessionJson);
		p.expire(newSessionKey, AFTER_30_MINUTES);
		p.sync();

		return ctxSession;
	    }
	};

	return cmd.execute();
    }

    public static int updateSessionWithProfile(HttpServerRequest req, MultiMap params, ContextSession ctxSession) {
	String usedDeviceId = ctxSession.getUserDeviceId();
	String sourceIP = RequestInfoUtil.getRemoteIP(req);
	String lastTouchpointId = ctxSession.getRefTouchpointId();
	String observerId = ctxSession.getObserverId();
	String profileId = ctxSession.getProfileId();
	String email = ctxSession.getEmail();
	String loginId = ctxSession.getLoginId();
	String loginProviderName = ctxSession.getLoginProviderName();
	ProfileDataService.updateLoginInfo(loginProviderName, loginId, email, profileId, observerId, lastTouchpointId,
		sourceIP, usedDeviceId);
	return 101;
    }

}
