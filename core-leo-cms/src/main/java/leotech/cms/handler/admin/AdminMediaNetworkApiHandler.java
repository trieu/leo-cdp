package leotech.cms.handler.admin;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.User;
import leotech.cms.service.MediaNetworkDataService;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.JsonDataPayload;

public class AdminMediaNetworkApiHandler extends BaseSecuredDataApi {

    // for Admin CMS, only for ROLE_ADMIN and ROLE_SUPER_ADMIN
    static final String API_LIST_ALL = "/media-network/list-all";
    static final String API_CREATE_NEW = "/media-network/create-new";
    static final String API_UPDATE_INFO = "/media-network/update-info";
    static final String API_GET_INFO = "/media-network/get-info";
    static final String API_DELETE = "/media-network/delete";

    @Override
    public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
	User loginUser = getUserFromSession(userSession);
	if (loginUser != null) {
	    if (isAdminRole(loginUser)) {

		switch (uri) {

		case API_LIST_ALL: {
		    List<MediaNetwork> list = MediaNetworkDataService.listAll();
		    return JsonDataPayload.ok(uri, list, true);
		}
		case API_GET_INFO: {
		    String key = paramJson.getString("key", "");
		    if (!key.isEmpty()) {
			MediaNetwork network;
			if (key.equals("newcategory")) {
			    network = new MediaNetwork();
			} else {
			    network = MediaNetworkDataService.getByKey(key);
			}
			return JsonDataPayload.ok(uri, network, false);
		    }
		}
		case API_CREATE_NEW: {
		    String key = MediaNetworkDataService.save(paramJson, true);
		    return JsonDataPayload.ok(uri, key, true);
		}
		case API_UPDATE_INFO: {
		    String key = MediaNetworkDataService.save(paramJson, false);
		    return JsonDataPayload.ok(uri, key, true);
		}
		case API_DELETE: {
		    String key = paramJson.getString("key", "");
		    MediaNetworkDataService.deleteByKey(key);
		    return JsonDataPayload.ok(uri, key, true);
		}
		default: {
		    return JsonErrorPayload.NO_HANDLER_FOUND;
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
