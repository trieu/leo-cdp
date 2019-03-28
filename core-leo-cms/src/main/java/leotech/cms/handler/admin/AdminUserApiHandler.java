package leotech.cms.handler.admin;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.dao.UserDaoUtil;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.User;
import leotech.cms.service.UserDataService;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.JsonDataPayload;

public class AdminUserApiHandler extends BaseSecuredDataApi {
    // for Admin CMS, only for ROLE_ADMIN and ROLE_SUPER_ADMIN
    static final String API_LIST_ALL = "/user/list-all";
    static final String API_CREATE = "/user/create";
    static final String API_UPDATE = "/user/update";
    static final String API_GET_INFO = "/user/get-info";
    static final String API_ACTIVATE = "/user/activate";
    static final String API_DEACTIVATE = "/user/deactivate";
    static final String API_DELETE = "/user/delete";

    @Override
    public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
	System.out.println("ManageUserApiHandler");
	User loginUser = getUserFromSession(userSession);
	System.out.println("getUserFromSession " + loginUser);
	if (loginUser == null) {
	    return userLoginHandler(userSession, uri, paramJson);
	} else {

	    if (isAdminRole(loginUser)) {
		switch (uri) {

		case API_LIST_ALL:
		    List<User> list = UserDaoUtil.listAllUsersInNetwork(MediaNetwork.DEFAULT_ID);
		    return JsonDataPayload.ok(uri, list, false);
		case API_CREATE: {
		    String userId = UserDataService.saveUserInfo(paramJson, true);
		    System.out.println("API_CREATE.saveUserInfo " + userId);
		    return JsonDataPayload.ok(uri, userId, true);
		}
		case API_UPDATE: {
		    String userId = UserDataService.saveUserInfo(paramJson, false);
		    System.out.println("API_UPDATE.saveUserInfo " + userId);
		    return JsonDataPayload.ok(uri, userId, true);
		}
		case API_GET_INFO: {
		    String key = paramJson.getString("key", "");
		    User userInfo = loginUser;
		    if (!key.isEmpty()) {
			if (key.equals("newuser")) {
			    userInfo = new User();
			} else {
			    userInfo = UserDaoUtil.getByUserId(key);
			}
		    }
		    return JsonDataPayload.ok(uri, userInfo, false);
		}
		case API_ACTIVATE: {
		    String userLogin = paramJson.getString("userLogin", "");
		    String activationKey = paramJson.getString("activationKey", "");
		    boolean ok = UserDaoUtil.activate(userLogin, activationKey);
		    return JsonDataPayload.ok(uri, ok, true);
		}
		case API_DEACTIVATE: {
		    String userLogin = paramJson.getString("userLogin", "");
		    boolean ok = UserDaoUtil.deactivate(userLogin);
		    return JsonDataPayload.ok(uri, ok, true);
		}
		case API_DELETE: {
		    String userLogin = paramJson.getString("userLogin", "");
		    String ukey = UserDaoUtil.deleteByUserLogin(userLogin);
		    return JsonDataPayload.ok(uri, ukey, true);
		}
		default: {
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
	User user = getUserFromSession(userSession);
	if (user != null) {
	    if (isAdminRole(user)) {
		if (uri.equalsIgnoreCase(API_LIST_ALL)) {
		    List<User> list = UserDaoUtil.listAllUsersInNetwork(MediaNetwork.DEFAULT_ID);
		    return JsonDataPayload.ok(uri, list, true);
		}
	    } else {
		return JsonErrorPayload.NO_AUTHORIZATION;
	    }
	}
	return JsonErrorPayload.NO_AUTHENTICATION;
    }

   
}
