package leotech.cdp.admin.handler;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cdp.model.journey.Touchpoint;
import leotech.core.api.SecuredWebDataHandler;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.SystemUser;
import leotech.system.util.RequestInfoUtil;

public class CdpTouchpointHandler extends SecuredWebDataHandler {
	
	// for dataList view
	static final String API_LIST_ALL = "/cdp/touchpoints";
	static final String API_LIST_WITH_FILTER = "/cdp/touchpoints/filter";
	
	// for dataList view
	static final String API_CREATE_NEW = "/cdp/touchpoint/new";
	static final String API_UPDATE_MODEL = "/cdp/touchpoint/update";
	static final String API_GET_MODEL = "/cdp/touchpoint/get";
	static final String API_REMOVE = "/cdp/touchpoint/remove";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
		SystemUser loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAuthorized(loginUser, Touchpoint.class)) {
				switch (uri) {
					case API_LIST_WITH_FILTER : {
						// the list-view component at datatables.net needs Ajax POST method to avoid long URL 
						DataFilter filter = new DataFilter(uri, paramJson);
						//TODO
						return null;
					}
					case API_GET_MODEL : {
						String id = paramJson.getString("id", "0");
						//TODO
						return JsonDataPayload.ok(uri, null, loginUser, Touchpoint.class);
					}
					case API_UPDATE_MODEL : {
						String key = null;
						//TODO                                                                                                                                                                                                                                                                
						return JsonDataPayload.ok(uri, key, loginUser, Touchpoint.class);
					}
					case API_REMOVE : {
						// the data is not deleted, we need to remove it from valid data view, set status of object = -4
						//TODO
						boolean rs = false;
						return JsonDataPayload.ok(uri, rs, loginUser, Touchpoint.class);
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
		SystemUser loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAuthorized(loginUser, Touchpoint.class)) {
				switch (uri) {
					case API_LIST_ALL : {
						int startIndex =   RequestInfoUtil.getInteger(params,"startIndex", 0);
						int numberResult = RequestInfoUtil.getInteger(params,"numberResult", 20);
						//TODO
						List<?> list = null;
						return JsonDataPayload.ok(uri, list, loginUser, Touchpoint.class);
					}
					case API_GET_MODEL : {
						String id = RequestInfoUtil.getString(params,"id", "");
						if (!id.isEmpty()) {
							//TODO
							return JsonDataPayload.ok(uri, null, loginUser, Touchpoint.class);
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
