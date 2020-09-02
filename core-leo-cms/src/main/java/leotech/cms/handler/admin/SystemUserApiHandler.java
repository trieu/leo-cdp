package leotech.cms.handler.admin;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cdp.utils.ThirdPartyTrackingUtil;
import leotech.cms.dao.UserDaoUtil;
import leotech.core.api.SecuredWebDataHandler;
import leotech.system.model.AppMetadata;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.SystemUser;
import leotech.system.service.UserDataService;

public class SystemUserApiHandler extends SecuredWebDataHandler {
	// for Admin CMS, only for ROLE_ADMIN and ROLE_SUPER_ADMIN
	static final String API_LIST_ALL = "/user/list-all";
	static final String API_CREATE = "/user/create";
	static final String API_UPDATE = "/user/update";
	static final String API_GET_INFO = "/user/get-info";
	static final String API_ACTIVATE = "/user/activate";
	static final String API_DEACTIVATE = "/user/deactivate";
	static final String API_DELETE = "/user/delete";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson)
			throws Exception {
		System.out.println("ManageUserApiHandler");
		SystemUser loginUser = getUserFromSession(userSession);
		System.out.println("getUserFromSession " + loginUser);
		if (loginUser == null) {
			return userLoginHandler(userSession, uri, paramJson);
		} else {
			if (isAuthorized(loginUser, SystemUser.class)) {
				switch (uri) {

					case API_LIST_ALL :
						List<SystemUser> list = UserDaoUtil.listAllUsersInNetwork(AppMetadata.DEFAULT_ID);
						return JsonDataPayload.ok(uri, list, loginUser, SystemUser.class);
					case API_CREATE : {
						String userId = UserDataService.saveUserInfo(paramJson, true);
						System.out.println("API_CREATE.saveUserInfo " + userId);
						return JsonDataPayload.ok(uri, userId, loginUser, SystemUser.class);
					}
					case API_UPDATE : {
						String userId = UserDataService.saveUserInfo(paramJson, false);
						System.out.println("API_UPDATE.saveUserInfo " + userId);

						// tracking with Google Analytics
						String userIp = "";
						String userAgent = "";
						String trackingTitle = "user-information-update";
						ThirdPartyTrackingUtil.event("user-tracking", "username:" + loginUser.getUserLogin(),
								trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);

						return JsonDataPayload.ok(uri, userId, loginUser, SystemUser.class);
					}
					case API_GET_INFO : {
						String key = paramJson.getString("key", "");
						SystemUser userInfo = loginUser;
						if (!key.isEmpty()) {
							if (key.equals("newuser")) {
								userInfo = new SystemUser();
							} else {
								userInfo = UserDaoUtil.getByUserId(key);
							}
						}

						// tracking with Google Analytics
						String userIp = "";
						String userAgent = "";
						String trackingTitle = "user-information-get";
						ThirdPartyTrackingUtil.event("user-tracking", "username:" + loginUser.getUserLogin(),
								trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);

						return JsonDataPayload.ok(uri, userInfo, loginUser, SystemUser.class);
					}
					case API_ACTIVATE : {
						String userLogin = paramJson.getString("userLogin", "");
						String activationKey = paramJson.getString("activationKey", "");
						boolean ok = UserDaoUtil.activate(userLogin, activationKey);
						return JsonDataPayload.ok(uri, ok, loginUser, SystemUser.class);
					}
					case API_DEACTIVATE : {
						String userLogin = paramJson.getString("userLogin", "");
						boolean ok = UserDaoUtil.deactivate(userLogin);
						return JsonDataPayload.ok(uri, ok, loginUser, SystemUser.class);
					}
					case API_DELETE : {
						String userLogin = paramJson.getString("userLogin", "");
						String ukey = UserDaoUtil.deleteByUserLogin(userLogin);
						return JsonDataPayload.ok(uri, ukey, loginUser, SystemUser.class);
					}
					default : {
						return JsonErrorPayload.NO_HANDLER_FOUND;
					}
				}

			}
			return JsonErrorPayload.NO_AUTHORIZATION;

		}
	}

	@Override
	public JsonDataPayload httpGetApiHandler(String userSession, String uri, MultiMap params) throws Exception {
		// TODO Auto-generated method stub
		SystemUser loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAuthorized(loginUser, SystemUser.class)) {
				if (uri.equalsIgnoreCase(API_LIST_ALL)) {
					List<SystemUser> list = UserDaoUtil.listAllUsersInNetwork(AppMetadata.DEFAULT_ID);
					return JsonDataPayload.ok(uri, list, loginUser, SystemUser.class);
				}
			} else {
				return JsonErrorPayload.NO_AUTHORIZATION;
			}
		}
		return JsonErrorPayload.NO_AUTHENTICATION;
	}

}
