package leotech.cdp.service;

import java.util.Map;

import org.joda.time.DateTime;

import com.google.gson.Gson;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import leotech.cdp.dao.ContextSessionDaoUtil;
import leotech.cdp.model.ContextSession;
import leotech.cdp.model.Profile;
import leotech.cdp.model.Touchpoint;
import leotech.cdp.router.api.ObserverApiParam;
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

	static ContextSession createContextSession(HttpServerRequest req, MultiMap params, DeviceInfo dv,
			DateTime dateTime, String dateTimeKey) {
		String ip = RequestInfoUtil.getRemoteIP(req);
		GeoLocation loc = GeoLocationUtil.getGeoLocation(ip);

		String observerId = StringUtil.safeString(params.get(ObserverApiParam.OBSERVER_ID));
		String userDeviceId = DeviceDataService.getDeviceId(params, dv);
		String mediaHost = StringUtil.safeString(params.get(ObserverApiParam.MEDIA_HOST));
		String appId = StringUtil.safeString(params.get(ObserverApiParam.APP_ID));

		// touchpoint params
		String touchpointName = StringUtil.decodeUrlUTF8(params.get(ObserverApiParam.TOUCHPOINT_NAME));
		String touchpointUrl = StringUtil.decodeUrlUTF8(params.get(ObserverApiParam.TOUCHPOINT_URL));
		String touchpointRefUrl = StringUtil.decodeUrlUTF8(params.get(ObserverApiParam.TOUCHPOINT_REFERRER_URL));

		// profile params
		String visitorId = StringUtil.safeString(params.get(ObserverApiParam.VISITOR_ID));
		String email = StringUtil.safeString(params.get(ObserverApiParam.EMAIL));
		String phone = StringUtil.safeString(params.get(ObserverApiParam.PHONE));
		String fingerprintId = StringUtil.safeString(params.get(ObserverApiParam.FINGERPRINT_ID));

		String loginId = StringUtil.safeString(params.get(ObserverApiParam.LOGIN_ID));
		String loginIdProvider = StringUtil.safeString(params.get(ObserverApiParam.LOGIN_PROVIDER));

		String env = StringUtil.safeString(params.get(ObserverApiParam.DATA_ENVIRONMENT), ObserverApiParam.DEV_ENV);
		String locationCode = loc.getLocationCode();

		// touch-point info process
		Touchpoint refTouchPoint = TouchpointDataService.getOrCreateWebTouchpoint(Touchpoint.TouchpointType.WEBSITE, touchpointRefUrl);
		Touchpoint srcTouchpoint = TouchpointDataService.getOrCreateWebTouchpoint(touchpointName, Touchpoint.TouchpointType.WEBSITE, touchpointUrl);
		String refTouchpointId = refTouchPoint.getId();
		String srcTouchpointId = srcTouchpoint.getId();

		// create new
		ContextSession ctxSession = new ContextSession(observerId, dateTime, dateTimeKey, locationCode,
				userDeviceId, ip, mediaHost, appId, refTouchpointId, srcTouchpointId, visitorId, email, phone,
				fingerprintId, env);

		String ctxSessionKey = ctxSession.getSessionKey();

		// load profile ID from DB
		Profile profile = ProfileDataService.getOrCreateFromPublicDataStream(ctxSessionKey, observerId, srcTouchpointId, ip, visitorId, userDeviceId);
		String profileId = profile.getId();
		int profileType = profile.getType();

		ctxSession.setProfileId(profileId);
		ctxSession.setProfileType(profileType);
		ctxSession.setLoginId(loginId);
		ctxSession.setLoginProvider(loginIdProvider);

		// TODO run in a thread
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

					// the session is expired, so create a new one and commit to
					// database
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
		
		
		MultiMap formAttributes = req.formAttributes();
		
		Map<String, String> profileData = RequestInfoUtil.getHashMapFromRequestParams(formAttributes,ObserverApiParam.PROFILE_DATA);
		System.out.println(profileData);
		
		String email = profileData.getOrDefault("email", "");
		String loginId = profileData.getOrDefault("loginId", "");
		String loginProvider = profileData.getOrDefault("loginProvider", "");
		
		
		ProfileDataService.updateLoginInfo(loginProvider, loginId, email, profileId, observerId, lastTouchpointId, sourceIP, usedDeviceId);
		
		ctxSession.setEmail(email);
		ctxSession.setLoginId(loginId);
		ctxSession.setLoginProvider(loginProvider);
		ContextSessionDaoUtil.update(ctxSession);
		
		return 102;
	}

}
