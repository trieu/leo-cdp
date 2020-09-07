package leotech.cdp.handler;

import java.util.List;
import java.util.Map;

import com.google.common.collect.ImmutableMap;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cdp.model.customer.Segment;
import leotech.cdp.service.ProfileDataService;
import leotech.cdp.service.SegmentDataService;
import leotech.system.common.SecuredWebDataHandler;
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
	static final String API_SAVE_MODEL = "/cdp/segment/save";
	static final String API_GET_MODEL = "/cdp/segment/get";
	static final String API_PROFILES_FROM_QUERY_BUILDER = "/cdp/segment/profiles/query-builder";
	static final String API_GET_STATISTICS = "/cdp/segment/statistics";
	static final String API_DELETE = "/cdp/segment/delete";
	static final String API_PROFILES_IN_SEGMENT = "/cdp/segment/profiles";

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
					case API_PROFILES_IN_SEGMENT : {
						// the list-view component at datatables.net needs Ajax POST method to avoid long URL 
						String segmentId = paramJson.getString("segmentId", "");
						if(!segmentId.isEmpty()) {
							DataFilter filter = new DataFilter(uri, paramJson);
							JsonDataTablePayload payload = SegmentDataService.getProfilesInSegment(segmentId, filter);
							payload.checkPermission(loginUser, Segment.class);
							return payload;
						}
						return JsonDataPayload.fail("segmentId is not valid", 500);
					}
					case API_PROFILES_FROM_QUERY_BUILDER : {
						// the list-view component at datatables.net needs Ajax POST method to avoid long URL 
						String jsonQueryRules = paramJson.getString("jsonQueryRules", "");
						String beginFilterDate = paramJson.getString("beginFilterDate", "");
						String endFilterDate = paramJson.getString("endFilterDate", "");
						if(!jsonQueryRules.isEmpty()) {
							DataFilter filter = new DataFilter(uri, paramJson);
							JsonDataTablePayload payload = SegmentDataService.getProfilesFromQueryBuilder(jsonQueryRules, beginFilterDate, endFilterDate, filter);
							payload.checkPermission(loginUser, Segment.class);
							return payload;
						}
						return JsonDataPayload.fail("segmentId is not valid", 500);
					}
					case API_GET_STATISTICS : {
						String jsonQueryRules = paramJson.getString("jsonQueryRules", "");
						String beginFilterDate = paramJson.getString("beginFilterDate", "");
						String endFilterDate = paramJson.getString("endFilterDate", "");
						
						long querySize = SegmentDataService.computeSegmentSize(jsonQueryRules,  beginFilterDate, endFilterDate);
						long totalProfilesInCdp = ProfileDataService.countTotalOfProfiles();
						Map<String,Long> stats = ImmutableMap.of("totalProfilesInSegment", querySize, "totalProfilesInCdp", totalProfilesInCdp);
						return JsonDataPayload.ok(uri, stats, loginUser, Segment.class);
					}
					case API_GET_MODEL : {
						String id = paramJson.getString("id", "new");
						Segment sm;
						if (id.equals("new")) {
							sm = SegmentDataService.newInstance();
						} else {
							sm = SegmentDataService.getById(id);
						}
						
						long totalProfilesInCdp = ProfileDataService.countTotalOfProfiles();
						Map<String,Long> stats = ImmutableMap.of("totalProfilesInSegment", sm.getTotalCount(), "totalProfilesInCdp", totalProfilesInCdp);
						Map<String,Object> data = ImmutableMap.of("segmentData", sm, "segmentStats", stats);
						
						return JsonDataPayload.ok(uri, data, loginUser, Segment.class);
					}
					case API_SAVE_MODEL : {
						String json = paramJson.getString("dataObject", "{}");
						String segmentId = SegmentDataService.saveFromJson(json);
						if(segmentId != null) {
							return JsonDataPayload.ok(uri, segmentId, loginUser, Segment.class);
						} else {
							return JsonDataPayload.fail("failed to save Segment data into database", 500);
						}
					}
					case API_DELETE : {
						String id = paramJson.getString("id", "");
						boolean rs = SegmentDataService.delete(id);
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
