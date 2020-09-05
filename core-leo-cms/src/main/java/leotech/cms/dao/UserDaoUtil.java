package leotech.cms.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.google.gson.Gson;

import leotech.system.config.AqlTemplate;
import leotech.system.model.SystemUser;
import leotech.system.util.Encryptor;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.HashUtil;
import rfx.core.util.StringUtil;

public class UserDaoUtil {

	static final String AQL_FIND_KEY_BY_USERLOGIN = AqlTemplate.get("AQL_FIND_KEY_BY_USERLOGIN");
	static final String AQL_GET_USER_BY_USERLOGIN = AqlTemplate.get("AQL_GET_USER_BY_USERLOGIN");
	static final String AQL_GET_USER_BY_KEY = AqlTemplate.get("AQL_GET_USER_BY_KEY");
	static final String AQL_GET_ALL_USERS_IN_NETWORK = AqlTemplate.get("AQL_GET_ALL_USERS_IN_NETWORK");

	public static String createNew(SystemUser user) {
		if (user.isReadyForSave()) {
			ArangoCollection col = user.getCollection();
			if (col != null) {
				String _key = ArangoDbUtil.findKey(AQL_FIND_KEY_BY_USERLOGIN, "userLogin", user.getUserLogin());
				if (_key == null) {
					long currentTime = System.currentTimeMillis();
					user.setActivationKey(HashUtil.sha1(currentTime + user.getUserEmail()));
					user.setCreationTime(currentTime);
					user.setModificationTime(currentTime);
					_key = col.insertDocument(user).getKey();
					return _key;
				} else {
					throw new IllegalArgumentException(user.getUserLogin() + " is existed in database");
				}
			}
		}
		return "";
	}

	public static String deleteByKey(String key) {
		ArangoCollection col = new SystemUser().getCollection();
		if (col != null) {
			col.deleteDocument(key);
			return key;
		}
		return "";
	}

	public static String deleteByUserLogin(String userLogin) {
		SystemUser u = getByUserLogin(userLogin);
		if (u != null) {
			return deleteByKey(u.getKey());
		}
		return "";
	}

	public static String updateDisplayName(String userLogin, String displayName) {
		SystemUser u = getByUserLogin(userLogin);
		if (u != null) {
			u.setDisplayName(displayName);
			return update(u);
		}
		return "";
	}

	public static String updateUserRole(String userLogin, int role) {
		SystemUser u = getByUserLogin(userLogin);
		if (u != null) {
			u.setRole(role);
			return update(u);
		}
		return "";
	}

	public static String updateOnlineStatus(String userLogin, boolean isOnline) {
		SystemUser u = getByUserLogin(userLogin);
		if (u != null) {
			u.setOnline(isOnline);
			return update(u);
		}
		return "";
	}

	public static String updatePassword(String userLogin, String userPass) {
		SystemUser u = getByUserLogin(userLogin);
		if (u != null) {
			u.setUserPass(userPass);
			return update(u);
		}
		return "";
	}

	public static String updateAvatar(String userLogin, String avatarUrl) {
		SystemUser u = getByUserLogin(userLogin);
		if (u != null) {
			u.setAvatarUrl(avatarUrl);
			return update(u);
		}
		return "";
	}

	public static String updateCustomData(String userLogin, Map<String, String> customData) {
		SystemUser u = getByUserLogin(userLogin);
		if (u != null) {
			u.setCustomData(customData);
			return update(u);
		}
		return "";
	}

	public static SystemUser getByUserLogin(String userLogin) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("userLogin", userLogin);

		SystemUser user = new ArangoDbQuery<SystemUser>(db, AQL_GET_USER_BY_USERLOGIN, bindVars, SystemUser.class)
				.getResultsAsObject();
		return user;
	}

	public static SystemUser getByUserId(String key) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("key", key);
		SystemUser user = new ArangoDbQuery<SystemUser>(db, AQL_GET_USER_BY_KEY, bindVars, SystemUser.class).getResultsAsObject();
		return user;
	}

	public static List<SystemUser> listAllUsersInNetwork(long networkId) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("networkId", networkId);
		List<SystemUser> users = new ArangoDbQuery<SystemUser>(db, AQL_GET_ALL_USERS_IN_NETWORK, bindVars, SystemUser.class)
				.getResultsAsList();
		return users;
	}

	public static boolean activateAsGuest(String userLogin) {
		return activate(userLogin, SystemUser.ROLE_GUEST);
	}

	public static boolean activateAsStandarUser(String userLogin) {
		return activate(userLogin, SystemUser.ROLE_STANDARD_USER);
	}

	public static boolean activateAsEditor(String userLogin) {
		return activate(userLogin, SystemUser.ROLE_EDITOR);
	}

	public static boolean activateAsAdmin(String userLogin) {
		return activate(userLogin, SystemUser.ROLE_ADMIN);
	}

	public static boolean activateAsSuperAdmin(String userLogin) {
		return activate(userLogin, SystemUser.ROLE_SUPER_ADMIN);
	}

	private static boolean activate(String userLogin, int role) {
		SystemUser user = getByUserLogin(userLogin);
		if (user != null) {
			user.setActivationKey("");
			user.setRegisteredTime(System.currentTimeMillis());
			user.setStatus(SystemUser.STATUS_ACTIVE);
			user.setRole(role);
			update(user);
			return true;
		}
		return false;
	}

	public static boolean deactivate(String userLogin) {
		SystemUser user = getByUserLogin(userLogin);
		if (user != null) {
			user.setStatus(SystemUser.STATUS_DISABLED);
			user.setRole(SystemUser.ROLE_GUEST);
			update(user);
			return true;
		}
		return false;
	}

	public static boolean activate(String userLogin, String activationKey) {
		SystemUser user = getByUserLogin(userLogin);
		if (StringUtil.isNotEmpty(activationKey)) {
			if (activationKey.equals(user.getActivationKey())) {
				user.setActivationKey("");
				user.setRegisteredTime(System.currentTimeMillis());
				user.setStatus(SystemUser.STATUS_ACTIVE);
				update(user);
				return true;
			}
		}
		return false;
	}

	public static String update(SystemUser user) {
		if (user.isReadyForSave()) {
			ArangoCollection col = user.getCollection();
			if (col != null) {
				long currentTime = System.currentTimeMillis();
				user.setModificationTime(currentTime);
				String key = user.getKey();
				col.updateDocument(key, user);
				return key;
			}
		} else {
			System.out.println("check fail isReadyForSave " + new Gson().toJson(user));
		}
		return "";
	}

	public static boolean checkLogin(String userLogin, String password) {
		SystemUser user = getByUserLogin(userLogin);
		if (user != null && StringUtil.isNotEmpty(password)) {
			String hash = Encryptor.passwordHash(userLogin, password);
			if (user.getStatus() == SystemUser.STATUS_ACTIVE && hash.equals(user.getUserPass())) {
				return true;
			}
		}
		return false;
	}

}
