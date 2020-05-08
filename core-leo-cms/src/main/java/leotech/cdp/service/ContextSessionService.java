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
import leotech.cdp.router.api.ApiParamKey;
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

		String observerId = StringUtil.safeString(params.get(ApiParamKey.OBSERVER_ID));
		String userDeviceId = DeviceDataService.getDeviceId(params, dv);
		String mediaHost = StringUtil.safeString(params.get(ApiParamKey.MEDIA_HOST));
		String appId = StringUtil.safeString(params.get(ApiParamKey.APP_ID));

		// touchpoint params
		String touchpointName = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_NAME));
		String touchpointUrl = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_URL));
		String touchpointRefUrl = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_REFERRER_URL));
		String touchpointRefDomain = StringUtil.decodeUrlUTF8(params.get(ApiParamKey.TOUCHPOINT_REFERRER_DOMAIN));
		// owned media has data from itself , earned media is from facebook or google or youtube
		boolean isFromOwnedMedia = mediaHost.equals(touchpointRefDomain);
		
		// touch-point info process
		Touchpoint refTouchPoint = TouchpointDataService.getOrCreateWebTouchpoint(touchpointRefDomain, Touchpoint.TouchpointType.WEBSITE, touchpointRefUrl, isFromOwnedMedia);
		Touchpoint srcTouchpoint = TouchpointDataService.getOrCreateWebTouchpoint(touchpointName, Touchpoint.TouchpointType.WEBSITE, touchpointUrl);
		String refTouchpointId = refTouchPoint.getId();
		String srcTouchpointId = srcTouchpoint.getId();
		
		
		// profile params
		String visitorId = StringUtil.safeString(params.get(ApiParamKey.VISITOR_ID));
		String fingerprintId = StringUtil.safeString(params.get(ApiParamKey.FINGERPRINT_ID))+"_"+ip;
		
//		String email = StringUtil.safeString(params.get(ApiParamKey.EMAIL));
//		String phone = StringUtil.safeString(params.get(ApiParamKey.PHONE));
//		
//		String loginId = StringUtil.safeString(params.get(ApiParamKey.LOGIN_ID));
//		String loginIdProvider = StringUtil.safeString(params.get(ApiParamKey.LOGIN_PROVIDER));

		String env = StringUtil.safeString(params.get(ApiParamKey.DATA_ENVIRONMENT), ApiParamKey.DEV_ENV);
		String locationCode = loc.getLocationCode();

		
		
		// load profile ID from DB
		Profile profile = ProfileDataService.updateOrCreateFromWebTouchpoint(observerId, srcTouchpointId, refTouchpointId, touchpointRefDomain, ip, visitorId, userDeviceId, fingerprintId);
		String profileId = profile.getId();
		visitorId = profile.getVisitorId();
		int profileType = profile.getType();
		

		// create new
		ContextSession ctxSession = new ContextSession(observerId, dateTime, dateTimeKey, locationCode,
				userDeviceId, ip, mediaHost, appId, refTouchpointId, srcTouchpointId, profileId, profileType, visitorId, env);
		

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
		
		String lastTouchpointId = ctxSession.getSrcTouchpointId();
		String observerId = ctxSession.getObserverId();
		String curProfileId = ctxSession.getProfileId();
		
		MultiMap formAttributes = req.formAttributes();
		
		Map<String, String> profileData = RequestInfoUtil.getHashMapFromRequestParams(formAttributes,ApiParamKey.PROFILE_DATA);
		System.out.println(profileData);
		
		String email = profileData.getOrDefault("email", "");
		String phone = profileData.getOrDefault("phone", "");
		String loginId = profileData.getOrDefault("loginId", "");
		String loginProvider = profileData.getOrDefault("loginProvider", "");
		
		Profile profile = ProfileDataService.updateLoginInfo(loginProvider, loginId, email, phone, curProfileId, observerId, lastTouchpointId, sourceIP, usedDeviceId);
		
		String newProfileId = profile.getId();
		
		if(! newProfileId.equals(curProfileId)) {
			ctxSession.setProfileId(newProfileId);
			ContextSessionDaoUtil.update(ctxSession);
		}
		
		return 102;
	}

}
