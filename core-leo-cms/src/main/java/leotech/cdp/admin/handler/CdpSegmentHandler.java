package leotech.cdp.admin.handler;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cdp.model.customer.Segment;
import leotech.cdp.service.SegmentDataService;
import leotech.core.api.SecuredWebDataHandler;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.JsonDataTablePayload;
import leotech.system.model.SystemUser;
import leotech.system.util.RequestInfoUtil;

/**
 * segment 
 * 
 * @author tantrieuf31
 * @since 2020/09/02
 *
 */
public class CdpSegmentHandler extends SecuredWebDataHandler {
	
	// for dataList view
	static final String API_LIST_ALL = "/cdp/segments";
	static final String API_LIST_WITH_FILTER = "/cdp/segments/filter";
	
	// for dataList view
	static final String API_CREATE_NEW = "/cdp/segment/new";
	static final String API_UPDATE_MODEL = "/cdp/segment/update";
	static final String API_GET_MODEL = "/cdp/segment/get";
	static final String API_REMOVE = "/cdp/segment/remove";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
		SystemUser loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAuthorized(loginUser, Segment.class)) {
				switch (uri) {
					case API_LIST_WITH_FILTER : {
						// the list-view component at datatables.net needs Ajax POST method to avoid long URL 
						DataFilter filter = new DataFilter(uri, paramJson);
						JsonDataTablePayload payload = SegmentDataService.filter(filter);
						payload.checkPermission(loginUser, Segment.class);
						return payload;
					}
					case API_GET_MODEL : {
						String id = paramJson.getString("id", "new");
						Segment sm;
						if (id.equals("new")) {
							sm = SegmentDataService.newInstance();
						} else {
							sm = SegmentDataService.getById(id);
						}
						return JsonDataPayload.ok(uri, sm, loginUser, Segment.class);
					}
					case API_UPDATE_MODEL : {
						String json = paramJson.getString("objectJson", "{}");
						Segment sm = SegmentDataService.updateFromJson(json);
						if(sm != null) {
							String id = sm.getId();
							return JsonDataPayload.ok(uri, id, loginUser, Segment.class);
						} else {
							return JsonDataPayload.fail("failed to save Segment data into database", 500);
						}
					}
					case API_REMOVE : {
						String id = paramJson.getString("id", "");
						boolean rs = SegmentDataService.remove(id);
						return JsonDataPayload.ok(uri, rs, loginUser, Segment.class);
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
			if (isAuthorized(loginUser, Segment.class)) {
				switch (uri) {
					case API_LIST_ALL : {
						int startIndex =   RequestInfoUtil.getInteger(params,"startIndex", 0);
						int numberResult = RequestInfoUtil.getInteger(params,"numberResult", 20);
						List<?> list = SegmentDataService.list(startIndex, numberResult);
						return JsonDataPayload.ok(uri, list, loginUser, Segment.class);
					}
					case API_GET_MODEL : {
						String id = RequestInfoUtil.getString(params,"id", "new");
						Segment sm;
						if (id.equals("new")) {
							sm = SegmentDataService.newInstance();
						} else {
							sm = SegmentDataService.getById(id);
						}
						return JsonDataPayload.ok(uri, sm, loginUser, Segment.class);
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
