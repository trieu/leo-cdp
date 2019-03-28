package leotech.cms.handler.admin;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.model.User;
import leotech.cms.service.PostDataService;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.JsonDataPayload;

public class AdminSystemApiHandler extends BaseSecuredDataApi {
    // for Admin CMS, only for ROLE_SUPER_ADMIN
    static final String API_SYSTEM_COMMAND = "/system/command";

    @Override
    public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
	User loginUser = getUserFromSession(userSession);
	if (loginUser != null) {
	    if (isSuperAdminRole(loginUser)) {
		if (uri.equalsIgnoreCase(API_SYSTEM_COMMAND)) {
		    String cmd = paramJson.getString("cmd", "");
		    switch (cmd) {
		    case "rebuildSearchIndex": {
			int n = PostDataService.rebuildSearchIndex();
			return JsonDataPayload.ok(uri, "rebuildSearchIndex " + n, true);
		    }
		    default: {
			return JsonErrorPayload.NO_HANDLER_FOUND;
		    }
		    }
		}

	    }
	    return JsonErrorPayload.NO_AUTHORIZATION;

	} else {
	    return JsonErrorPayload.NO_AUTHENTICATION;
	}
    }

    @Override
    public JsonDataPayload httpGetApiHandler(String userSession, String uri, MultiMap params) throws Exception {
	User user = getUserFromSession(userSession);
	if (user != null) {
	    if (isAdminRole(user)) {
		// skip
	    } else {
		return JsonErrorPayload.NO_AUTHORIZATION;
	    }
	}
	return JsonErrorPayload.NO_AUTHENTICATION;
    }

}
