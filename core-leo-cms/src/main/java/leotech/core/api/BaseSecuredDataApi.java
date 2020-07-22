package leotech.core.api;

import java.util.Random;

import com.devskiller.friendly_id.FriendlyId;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.dao.UserDaoUtil;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.User;
import leotech.system.util.Encryptor;
import redis.clients.jedis.Pipeline;
import redis.clients.jedis.Response;
import redis.clients.jedis.ShardedJedisPool;
import redis.clients.jedis.exceptions.JedisException;
import rfx.core.configs.RedisConfigs;
import rfx.core.nosql.jedis.RedisCommand;
import rfx.core.util.StringUtil;

public abstract class BaseSecuredDataApi extends BaseApiHandler {

	public static final boolean DEV_MODE = false;
	private static final User DEFAULT_ROOT_USER = User.createTestUser();

	public static final String REDIS_KEY_ENCKEY = "enckey";
	public static final String REDIS_KEY_USERLOGIN = "userlogin";
	public static final String API_LOGIN_SESSION = "/user/login-session";
	public static final String API_CHECK_LOGIN = "/user/check-login";

	public static final int AFTER_3_DAYS = 60 * 60 * 24 * 3;
	public static final int AFTER_7_DAYS = 60 * 60 * 24 * 7;

	public static final String SESSION_SPLITER = "_";

	public static final String LEO_USS = "leouss";

	protected static ShardedJedisPool redisLocalCache = RedisConfigs.load().get("localCache").getShardedJedisPool();

	public final static class JsonErrorPayload {
		public static final JsonDataPayload NO_HANDLER_FOUND = JsonDataPayload.fail("No handler found", 404);
		public static final JsonDataPayload NO_AUTHORIZATION = JsonDataPayload.fail("No Authorization", 504);
		public static final JsonDataPayload NO_AUTHENTICATION = JsonDataPayload.fail("No Authentication", 501);
		public static final JsonDataPayload WRONG_USER_LOGIN = JsonDataPayload.fail("Wrong userLogin or password",
				502);
		public static final JsonDataPayload USER_SESSION_BAD_FORMAT = JsonDataPayload
				.fail("usersession is bad format", 503);
		public static final JsonDataPayload UNKNOWN_EXCEPTION = JsonDataPayload.fail("Unknown Exception", 506);
	}

	final static int MAX_NUMBER = 1000000;

	protected static int randomNumber() {
		Random rand = new Random();
		int n = rand.nextInt(MAX_NUMBER) + 1;
		return n;
	}

	/**
	 * @param usersession
	 * @return
	 */
	public static boolean isValidUserSession(String usersession) {
		System.out.println("isValidUserSession " + usersession);
		if (StringUtil.isNotEmpty(usersession)) {

			String[] toks = Encryptor.decrypt(usersession).split(SESSION_SPLITER);
			if (toks.length == 3) {
				int ran = StringUtil.safeParseInt(toks[2]);
				if (toks[0].equals(LEO_USS) && ran > 0 && ran <= MAX_NUMBER) {
					return true;
				}
			} else {
				System.err.println("usersession is not 3 tokens");
			}
		}
		return false;
	}

	/**
	 * @param userSession
	 * @return
	 */
	public static User getUserFromSession(String userSession) {
		if (DEV_MODE) {
			return DEFAULT_ROOT_USER;
		}
		if (isValidUserSession(userSession)) {
			try {
				return new RedisCommand<User>(redisLocalCache) {
					@Override
					protected User build() throws JedisException {
						Pipeline p = jedis.pipelined();
						Response<String> resp1 = p.hget(userSession, REDIS_KEY_USERLOGIN);
						Response<String> resp2 = p.hget(userSession, REDIS_KEY_ENCKEY);
						p.sync();

						String userlogin = resp1.get();
						String enckey = resp2.get();
						User user = UserDaoUtil.getByUserLogin(userlogin);
						if (user != null) {
							if (user.getStatus() == User.STATUS_ACTIVE) {
								user.setEncryptionKey(enckey);
								return user;
							} else {
								System.err.println("userlogin: " + userlogin + " not active");
							}
						}
						return null;
					}
				}.execute();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		// no authentication
		return null;
	}
	

	public static boolean isAdminRole(User loginUser) {
		int role = loginUser.getRole();
		return role == User.ROLE_ADMIN || role == User.ROLE_SUPER_ADMIN;
	}

	public static boolean isSuperAdminRole(User loginUser) {
		int role = loginUser.getRole();
		return role == User.ROLE_SUPER_ADMIN;
	}

	/**
	 * @param usersession
	 * @return
	 */
	public static boolean isAuthorization(String usersession) {
		if (isValidUserSession(usersession)) {
			try {
				return new RedisCommand<Boolean>(redisLocalCache) {
					@Override
					protected Boolean build() throws JedisException {
						return jedis.exists(usersession);
					}
				}.execute();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return false;
	}

	///////////////////////////// 3 API for login
	///////////////////////////// ///////////////////////////////////////////////////////////////////

	// (0)
	protected static JsonDataPayload userLoginHandler(String userSession, String uri, JsonObject paramJson) {
		if (uri.equalsIgnoreCase(API_LOGIN_SESSION)) {
			if (StringUtil.isEmpty(userSession)) {
				return loginSessionInit(uri);
			} else {
				return JsonDataPayload.ok(uri, userSession);
			}
		} else if (uri.equalsIgnoreCase(API_CHECK_LOGIN)) {
			String userlogin = paramJson.getString("userlogin");
			String userpass = paramJson.getString("userpass");
			String usersession = paramJson.getString("usersession");
			System.out.println("userLoginHandler " + paramJson.toString());
			return checkLoginHandler(uri, userSession, userlogin, userpass, usersession);
		}
		return JsonErrorPayload.NO_AUTHENTICATION;
	}

	// (1)
	private static JsonDataPayload loginSessionInit(String uri) {
		String userSession = Encryptor
				.encrypt(LEO_USS + SESSION_SPLITER + System.currentTimeMillis() + SESSION_SPLITER + randomNumber());
		return JsonDataPayload.ok(uri, userSession);
	}

	// (2)
	private static JsonDataPayload checkLoginHandler(String uri, String userSession, String userlogin,
			String userpass, String usersession) {
		if (isValidUserSession(usersession)) {
			boolean ok = UserDaoUtil.checkLogin(userlogin, userpass);
			if (ok) {
				String encryptionKey = FriendlyId.createFriendlyId();
				// valid token in 7 days
				saveUserSession(userlogin, usersession, encryptionKey);
				return JsonDataPayload.ok(uri, encryptionKey);
			} else {
				return JsonErrorPayload.WRONG_USER_LOGIN;
			}
		}
		return JsonErrorPayload.USER_SESSION_BAD_FORMAT;
	}

	// (3)
	private static boolean saveUserSession(String userLogin, String usersession, String encryptionKey) {
		try {
			new RedisCommand<Boolean>(redisLocalCache) {
				@Override
				protected Boolean build() throws JedisException {
					Pipeline p = jedis.pipelined();
					p.hset(usersession, "enckey", encryptionKey);
					p.hset(usersession, "userlogin", userLogin);
					p.expire(usersession, AFTER_7_DAYS);
					p.sync();
					return true;
				}
			}.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * HTTP post data handler for JSON
	 * 
	 * @param uri
	 * @param paramJson
	 * @param userSession
	 * @return
	 * @throws Exception
	 */
	abstract public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson)
			throws Exception;

	/**
	 * HTTP get data handler for JSON
	 * 
	 * @param uri
	 * @param paramJson
	 * @param userSession
	 * @return
	 * @throws Exception
	 */
	abstract public JsonDataPayload httpGetApiHandler(String userSession, String uri, MultiMap params)
			throws Exception;

}
