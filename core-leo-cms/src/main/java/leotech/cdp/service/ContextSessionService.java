package leotech.cdp.service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.joda.time.DateTime;

import com.google.gson.Gson;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import leotech.cdp.dao.ContextSessionDaoUtil;
import leotech.cdp.model.analytics.ContextSession;
import leotech.cdp.model.customer.Profile;
import leotech.cdp.model.journey.MediaChannelType;
import leotech.cdp.model.journey.Touchpoint;
import leotech.cdp.router.api.TrackingApiParam;
import leotech.system.model.DeviceInfo;
import leotech.system.model.GeoLocation;
import leotech.system.util.GeoLocationUtil;
import leotech.system.util.RequestInfoUtil;
import leotech.system.util.UrlUtil;
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

		String observerId = StringUtil.safeString(params.get(TrackingApiParam.OBSERVER_ID));
		String userDeviceId = DeviceDataService.getDeviceId(params, dv);
		String mediaHost = StringUtil.safeString(params.get(TrackingApiParam.MEDIA_HOST));
		String appId = StringUtil.safeString(params.get(TrackingApiParam.APP_ID));

		// touchpoint params
		String touchpointName = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_NAME));
		String touchpointUrl = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_URL));
		String touchpointRefUrl = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_REFERRER_URL));
		String touchpointRefDomain = StringUtil.decodeUrlUTF8(params.get(TrackingApiParam.TOUCHPOINT_REFERRER_DOMAIN));
		// owned media has data from itself , earned media is from facebook or google or youtube
		boolean isFromOwnedMedia = mediaHost.equals(touchpointRefDomain);
		
		// touch-point info process
		Touchpoint refTouchPoint = TouchpointDataService.getOrCreateWebTouchpoint(touchpointRefDomain, MediaChannelType.WEB_URL, touchpointRefUrl, isFromOwnedMedia);
		Touchpoint srcTouchpoint = TouchpointDataService.getOrCreateWebTouchpoint(touchpointName, MediaChannelType.WEB_URL, touchpointUrl);
		String refTouchpointId = refTouchPoint.getId();
		String srcTouchpointId = srcTouchpoint.getId();
		
		
		// profile params
		String visitorId = StringUtil.safeString(params.get(TrackingApiParam.VISITOR_ID));
		String fingerprintId = StringUtil.safeString(params.get(TrackingApiParam.FINGERPRINT_ID))+"_"+ip;
		
//		String email = StringUtil.safeString(params.get(ApiParamKey.EMAIL));
//		String phone = StringUtil.safeString(params.get(ApiParamKey.PHONE));
//		
//		String loginId = StringUtil.safeString(params.get(ApiParamKey.LOGIN_ID));
//		String loginIdProvider = StringUtil.safeString(params.get(ApiParamKey.LOGIN_PROVIDER));

		String env = StringUtil.safeString(params.get(TrackingApiParam.DATA_ENVIRONMENT), TrackingApiParam.DEV_ENV);
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
	
	public static ContextSession synchData(HttpServerRequest req, MultiMap params, DeviceInfo device) {
		return synchData(null, req, params, device);
	}

	public static ContextSession synchData(final String clientSessionKey, HttpServerRequest req, MultiMap params, DeviceInfo device) {
		RedisCommand<ContextSession> cmd = new RedisCommand<ContextSession>(jedisPool) {
			@Override
			protected ContextSession build() throws JedisException {
				String json = null;
				if (StringUtil.isNotEmpty(clientSessionKey)) {
					json = jedis.get(clientSessionKey);
				}
				ContextSession ctxSession = null;
				DateTime dateTime = new DateTime();

				if (json == null) {

					// the session is expired, so create a new one and commit to database
					String dateTimeKey = ContextSession.getSessionDateTimeKey(dateTime);
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

	public static int updateProfileData(HttpServerRequest req, MultiMap params, ContextSession ctxSession, DeviceInfo device) {
		String deviceId = DeviceDataService.getDeviceId(params, device);
		String environment = StringUtil.safeString(params.get(TrackingApiParam.DATA_ENVIRONMENT),TrackingApiParam.PRO_ENV);
		
		String usedDeviceId = ctxSession.getUserDeviceId();
		String sourceIP = RequestInfoUtil.getRemoteIP(req);
		
		String sessionTouchpointId = ctxSession.getSrcTouchpointId();
		String observerId = ctxSession.getObserverId();
		String curProfileId = ctxSession.getProfileId();
		
		
		Map<String, Set<String> > extDataStr = RequestInfoUtil.getMapSetFromRequestParams(req.formAttributes(), "extData");
		Map<String, String> formData = RequestInfoUtil.getHashMapFromRequestParams(req.formAttributes(),TrackingApiParam.PROFILE_DATA);
		
		String webformProvider = formData.getOrDefault("webformProvider", "");
		String loginProvider = formData.getOrDefault("loginProvider", "");
		String notificationProvider = formData.getOrDefault("notificationProvider", "");
		
		Set<String> contentKeywords = extDataStr.getOrDefault("contentKeywords", new HashSet<String>(0));
		
		String firstName = formData.getOrDefault("firstname", "");
		String lastName = formData.getOrDefault("lastname", "");
		String email = formData.getOrDefault("email", "");
		String phone = formData.getOrDefault("phone", "");
		int age = StringUtil.safeParseInt(formData.get("age"));
		String genderStr = formData.getOrDefault("genderStr", "");
		String loginId = formData.getOrDefault("loginId", "");
		
		String srcObserverId = formData.getOrDefault(TrackingApiParam.OBSERVER_ID, "");
		String srcTouchpointName = formData.getOrDefault(TrackingApiParam.TOUCHPOINT_NAME, "");
		String srcTouchpointUrl = formData.getOrDefault(TrackingApiParam.TOUCHPOINT_URL, "");
		String refTouchpointUrl = StringUtil.safeString(req.getHeader("Referer"));
		String touchpointRefDomain = UrlUtil.getHostName(refTouchpointUrl);
		
//		System.out.println(formData);
//		System.out.println(extDataStr);
		
		// social login likes facebook
		if( StringUtil.isNotEmpty(loginProvider) ) {
			
			Profile updatedProfile = ProfileDataService.updateBasicProfileInfo(curProfileId, loginId, loginProvider,firstName, lastName, email, phone, 
					genderStr, age,  observerId, sessionTouchpointId, sourceIP, usedDeviceId, contentKeywords);
			String newProfileId = updatedProfile.getId();
			
			if(! newProfileId.equals(curProfileId)) {
				ctxSession.setProfileId(newProfileId);
				ContextSessionDaoUtil.update(ctxSession);
			}
			
			String eventName = "social-login";
			EventDataService.recordEvent(new Date(), ctxSession, srcObserverId, environment, deviceId, sourceIP, device,
					srcTouchpointName,srcTouchpointUrl, refTouchpointUrl,  touchpointRefDomain, eventName);
			
		}
		//  confirmed notification
		else if( StringUtil.isNotEmpty(notificationProvider) ) {
			String notificationUserId = formData.getOrDefault("notificationUserId", "");
			ProfileDataService.setNotificationUserIds(curProfileId, notificationProvider, notificationUserId);
		}
		// WEB FORM submit 
		else if( StringUtil.isNotEmpty(webformProvider) ) {
			
			ProfileDataService.updateBasicProfileInfo(curProfileId, loginId, loginProvider,firstName, lastName, email, phone, 
					genderStr, age,  observerId, sessionTouchpointId, sourceIP, usedDeviceId, contentKeywords);
			String eventName = "submit-contact";
			
			EventDataService.recordEvent(new Date(), ctxSession, srcObserverId, environment, deviceId, sourceIP, device,
					srcTouchpointName,srcTouchpointUrl, refTouchpointUrl,  touchpointRefDomain, eventName);
			
			if(StringUtil.isNotEmpty(email) && StringUtil.isNotEmpty(firstName)) {
				MarketingAutomationService.sendThanksEmail(curProfileId, email, firstName);
			}
		}
		
		return 102;
	}
	
	public static ContextSession getByProfileId(String profileId) {
		List<ContextSession> sessions = ContextSessionDaoUtil.getSessionsByProfileId(profileId);
		if(sessions.size() > 0) {
			return sessions.get(0);
		}
		return null;
	}
}
