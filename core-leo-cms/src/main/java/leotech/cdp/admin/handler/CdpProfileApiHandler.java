package leotech.cdp.admin.handler;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cdp.model.customer.Profile;
import leotech.cdp.service.ProfileDataService;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.User;
import leotech.system.util.RequestInfoUtil;

public class CdpProfileApiHandler extends BaseSecuredDataApi {
	
	
	static final String API_LIST_ALL = "/cdp/profiles";
	static final String API_LIST_WITH_FILTER = "/cdp/profiles/filter";
	static final String API_CREATE_NEW = "/cdp/profile/new";
	static final String API_UPDATE_INFO = "/cdp/profile/update";
	static final String API_MERGE = "/cdp/profile/merge";
	static final String API_GET_INFO = "/cdp/profile/get";
	static final String API_DISABLE = "/cdp/profile/disable";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
		User loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAdminRole(loginUser)) {
				switch (uri) {
					case API_LIST_WITH_FILTER : {
						DataFilter filter = new DataFilter(uri, paramJson);
						return ProfileDataService.filter(filter);
					}
					case API_CREATE_NEW : {
						Profile pf = ProfileDataService.createNewCrmProfile(paramJson, loginUser);
						return JsonDataPayload.ok(uri, pf.getId(), true);
					}
					case API_UPDATE_INFO : {
						String key = ProfileDataService.update(paramJson, loginUser).getId();
						return JsonDataPayload.ok(uri, key, true);
					}
					case API_DISABLE : {
						boolean rs = ProfileDataService.remove(paramJson, loginUser);
						return JsonDataPayload.ok(uri, rs, true);
					}
					default : {
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
				switch (uri) {
					case API_LIST_ALL : {
						int startIndex =   RequestInfoUtil.getInteger(params,"startIndex", 0);
						int numberResult = RequestInfoUtil.getInteger(params,"numberResult", 20);
						List<Profile> list = ProfileDataService.list(startIndex, numberResult);
						return JsonDataPayload.ok(uri, list, true);
					}
					case API_GET_INFO : {
						String id = RequestInfoUtil.getString(params,"id", "");
						if (!id.isEmpty()) {
							Profile profile;
							if (id.equals("new")) {
								profile = new Profile();
							} else {
								profile = ProfileDataService.getById(id);
							}
							return JsonDataPayload.ok(uri, profile, false);
						}
					}

					default :
						return JsonErrorPayload.NO_HANDLER_FOUND;
				}
			} else {
				return JsonErrorPayload.NO_AUTHORIZATION;
			}
		}
		return JsonErrorPayload.NO_AUTHENTICATION;
	}

}
