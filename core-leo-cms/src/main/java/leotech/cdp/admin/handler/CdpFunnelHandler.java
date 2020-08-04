package leotech.cdp.admin.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cdp.model.marketing.FunnelNameStage;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.User;
import leotech.system.util.RequestInfoUtil;

public class CdpFunnelHandler extends BaseSecuredDataApi {
	
	// for dataList view
	static final String API_LIST_FUNNEL_STAGES = "/cdp/funnel/list-name-stages";
	
	// for dataList view
	static final String API_CREATE_NEW = "/cdp/funnel/new";
	static final String API_UPDATE_MODEL = "/cdp/funnel/update";
	static final String API_GET_MODEL = "/cdp/funnel/get";
	static final String API_REMOVE = "/cdp/funnel/remove";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
		User loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAdminRole(loginUser)) {
				switch (uri) {
					// TODO
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
					case API_LIST_FUNNEL_STAGES : {
						String kinds = RequestInfoUtil.getString(params, "kinds", "");
						String[] toks = kinds.split(",");
						
						Map<String, List<FunnelNameStage>> map = new HashMap<>(toks.length);
						for (String kind : toks) {
							
							if(kind.equals("event_retail")) {
								List<FunnelNameStage> list = FunnelNameStage.getEventRetailFunnelStages();
								map.put(kind, list);
							}
							else if(kind.equals("customer_retail")) {
								List<FunnelNameStage> list = FunnelNameStage.getCustomerRetailFunnelStages();
								map.put(kind, list);
							}
						}
						
						return JsonDataPayload.ok(uri, map, true);
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
