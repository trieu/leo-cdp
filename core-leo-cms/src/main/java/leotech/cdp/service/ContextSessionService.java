package leotech.cdp.service;

import org.joda.time.DateTime;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import leotech.cdp.dao.ContextSessionDaoUtil;
import leotech.cdp.model.ContextSession;
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

    public static ContextSession synchDataForNewSession(String observerId,DateTime dateTime, String dateTimeKey, String locationCode,
	    String userDeviceId, String ip, String mediaHost, String appId, String touchpointId, String visitorId,
	    String profileId, String fingerprintId) {

	ContextSession s = new ContextSession(observerId,dateTime, dateTimeKey, locationCode, userDeviceId, ip, mediaHost, appId,
		touchpointId, visitorId, profileId, fingerprintId);

	// FIXME run async
	ContextSessionDaoUtil.create(s);

	return s;
    }

    public static ContextSession synchData(final String clientSessionKey, HttpServerRequest req, MultiMap params, DeviceInfo dv) {
	RedisCommand<ContextSession> cmd = new RedisCommand<ContextSession>(jedisPool) {
	    @Override
	    protected ContextSession build() throws JedisException {
		String dateTimeKey = null;
		if(StringUtil.isNotEmpty(clientSessionKey)) {
		    dateTimeKey = jedis.get(clientSessionKey);
		}
		ContextSession currentSession = null;
		if (dateTimeKey == null) {
		    
		    // the session is expired, so create a new one and commit to database
		    DateTime dateTime = new DateTime();
		    currentSession = synchDataForNewSession(req, params, dv, dateTime, dateTimeKey);
		    dateTimeKey = ContextSession.getSessionDateTimeKey(dateTime);
		    String newSessionKey = currentSession.getSessionKey();

		    Pipeline p = jedis.pipelined();
		    p.set(newSessionKey, dateTimeKey);
		    p.expire(newSessionKey, AFTER_30_MINUTES);
		    p.sync();

		} else {
		    
		    // get from database for event recording
		    currentSession = ContextSessionDaoUtil.getByKey(clientSessionKey);
		}
		return currentSession;
	    }
	};

	return cmd.execute();
    }

    public static ContextSession synchDataForNewSession(HttpServerRequest req, MultiMap params, DeviceInfo dv,
	    DateTime dateTime, String dateTimeKey) {
	String ip = RequestInfoUtil.getRemoteIP(req);
	GeoLocation loc = GeoLocationUtil.getGeoLocation(ip);

	String observerId = StringUtil.safeString(params.get("observerId"));
	String userDeviceId = StringUtil.safeString(params.get("userDeviceId"));
	String mediaHost = StringUtil.safeString(params.get("mediaHost"));
	String appId = StringUtil.safeString(params.get("appId"));
	String touchpointId = StringUtil.safeString(params.get("touchpointId"));
	String visitorId = StringUtil.safeString(params.get("visitorId"));
	String profileId = StringUtil.safeString(params.get("profileId"));
	String fingerprintId = StringUtil.safeString(params.get("fingerprintId"));
	String locationCode = loc.getLocationCode();
	
	//TODO verify data
	
	return synchDataForNewSession(observerId,dateTime, locationCode, dateTimeKey, userDeviceId, ip, mediaHost, appId,
		touchpointId, visitorId, profileId, fingerprintId);
    }
}
