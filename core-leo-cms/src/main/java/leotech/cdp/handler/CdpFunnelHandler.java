package leotech.cdp.handler;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cdp.model.journey.BehavioralEventMetric;
import leotech.cdp.model.journey.DataFlowStage;
import leotech.cdp.service.FunnelDataService;
import leotech.system.common.SecuredWebDataHandler;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.SystemUser;
import leotech.system.util.RequestInfoUtil;

public class CdpFunnelHandler extends SecuredWebDataHandler {
	
	// for dataList view
	static final String API_LIST_ALL_WITH_FUNNEL_TYPES = "/cdp/funnels-and-event-metrics";
	
	// for dataList view
	static final String API_CREATE_NEW = "/cdp/funnel/new";
	static final String API_UPDATE_MODEL = "/cdp/funnel/update";
	static final String API_GET_MODEL = "/cdp/funnel/get";
	static final String API_REMOVE = "/cdp/funnel/remove";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
		SystemUser loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAuthorized(loginUser, DataFlowStage.class)) {
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
		SystemUser loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAuthorized(loginUser, DataFlowStage.class)) {
				switch (uri) {
					case API_LIST_ALL_WITH_FUNNEL_TYPES : {
						String funnelTypes = RequestInfoUtil.getString(params, "funnelTypes", "");
						
						String[] toks = funnelTypes.split(",");
						
						Map<String, Object> map = new HashMap<>(toks.length);
						
						for (String funnelType : toks) {
							if(funnelType.equals("event_retail")) {
								List<DataFlowStage> list = FunnelDataService.getEventFunnelStages();
								map.put(funnelType, list);
							}
							else if(funnelType.equals("customer_retail")) {
								List<DataFlowStage> list = FunnelDataService.getCustomerFunnelStages();
								map.put(funnelType, list);
							}
						}
						
						Collection<BehavioralEventMetric> metrics = FunnelDataService.getEventRetailMetrics();
						map.put("behavioral_metrics", metrics);
						
						return JsonDataPayload.ok(uri, map, loginUser, DataFlowStage.class);
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
