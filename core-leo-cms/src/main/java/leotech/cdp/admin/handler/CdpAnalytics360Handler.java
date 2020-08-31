package leotech.cdp.admin.handler;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cdp.model.analytics.Notebook;
import leotech.cdp.service.Analytics360Service;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.SystemUser;
import leotech.system.util.RequestInfoUtil;

public class CdpAnalytics360Handler extends BaseSecuredDataApi {
	
	// for dataList view
	static final String API_LIST_ALL = "/cdp/analytics360/notebooks";
	
	// for dataList view
	static final String API_CREATE_NEW = "/cdp/analytics360/notebook/new";
	static final String API_UPDATE_MODEL = "/cdp/analytics360/notebook/update";
	static final String API_GET_MODEL = "/cdp/analytics360/notebook/get";
	static final String API_REMOVE = "/cdp/analytics360/notebook/remove";
	static final String API_RUN_MANUALLY = "/cdp/analytics360/notebook/run";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
		SystemUser loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAdminRole(loginUser)) {
				switch (uri) {
					case API_LIST_ALL : {
						int startIndex =   RequestInfoUtil.getInteger(paramJson,"startIndex", 0);
						int numberResult = RequestInfoUtil.getInteger(paramJson,"numberResult", 10);
						List<Notebook> list = Analytics360Service.getNotebooks(startIndex, numberResult);
						return JsonDataPayload.ok(uri, list, true);
					}
					case API_RUN_MANUALLY : {
						String id = paramJson.getString("id", "0");
						//TODO
						return JsonDataPayload.ok(uri, null, true);
					}
					case API_GET_MODEL : {
						String id = paramJson.getString("id", "0");
						//TODO
						return JsonDataPayload.ok(uri, null, true);
					}
					case API_UPDATE_MODEL : {
						String key = null;
						//TODO                                                                                                                                                                                                                                                                
						return JsonDataPayload.ok(uri, key, true);
					}
					case API_REMOVE : {
						// the data is not deleted, we need to remove it from valid data view, set status of object = -4
						//TODO
						boolean rs = false;
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
		SystemUser user = getUserFromSession(userSession);
		if (user != null) {
			if (isAdminRole(user)) {
				switch (uri) {
					case API_LIST_ALL : {
						int startIndex =   RequestInfoUtil.getInteger(params,"startIndex", 0);
						int numberResult = RequestInfoUtil.getInteger(params,"numberResult", 10);
						List<Notebook> list = Analytics360Service.getNotebooks(startIndex, numberResult);
						return JsonDataPayload.ok(uri, list, true);
					}
					case API_GET_MODEL : {
						String id = RequestInfoUtil.getString(params,"id", "");
						if (!id.isEmpty()) {
							//TODO
							return JsonDataPayload.ok(uri, null, false);
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
