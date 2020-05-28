package leotech.cms.handler.admin;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.AppMetadata;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.User;
import leotech.system.service.AppMetadataService;

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
		    List<AppMetadata> list = AppMetadataService.listAll();
		    return JsonDataPayload.ok(uri, list, true);
		}
		case API_GET_INFO: {
		    String key = paramJson.getString("key", "");
		    if (!key.isEmpty()) {
			AppMetadata network;
			if (key.equals("newcategory")) {
			    network = new AppMetadata();
			} else {
			    network = AppMetadataService.getByKey(key);
			}
			return JsonDataPayload.ok(uri, network, false);
		    }
		}
		case API_CREATE_NEW: {
		    String key = AppMetadataService.save(paramJson, true);
		    return JsonDataPayload.ok(uri, key, true);
		}
		case API_UPDATE_INFO: {
		    String key = AppMetadataService.save(paramJson, false);
		    return JsonDataPayload.ok(uri, key, true);
		}
		case API_DELETE: {
		    String key = paramJson.getString("key", "");
		    AppMetadataService.deleteByKey(key);
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
