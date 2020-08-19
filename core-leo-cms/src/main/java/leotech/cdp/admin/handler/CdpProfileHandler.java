package leotech.cdp.admin.handler;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cdp.dao.singleview.EventSingleDataView;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.model.customer.Profile;
import leotech.cdp.service.EventTrackingService;
import leotech.cdp.service.ProfileDataService;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.User;
import leotech.system.util.RequestInfoUtil;

public class CdpProfileHandler extends BaseSecuredDataApi {
	
	// for dataList view
	static final String API_LIST_ALL = "/cdp/profiles";
	static final String API_LIST_WITH_FILTER = "/cdp/profiles/filter";
	
	// for dataList view
	static final String API_CREATE_NEW = "/cdp/profile/new";
	static final String API_UPDATE_MODEL = "/cdp/profile/update";
	static final String API_GET_MODEL = "/cdp/profile/get";
	static final String API_REMOVE = "/cdp/profile/remove";
	
	// event view
	static final String API_GET_TRACKING_EVENTS = "/cdp/profile/tracking-events";
	static final String API_GET_CONVERSION_EVENTS = "/cdp/profile/conversion-events";
	
	// for identity resolution and profile data processing
	static final String API_IDENTITY_RESOLUTION = "/cdp/profiles/identityresolution";
	static final String API_IMPORT = "/cdp/profiles/import";
	static final String API_EXPORT = "/cdp/profiles/export";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
		User loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAdminRole(loginUser)) {
				switch (uri) {
					case API_LIST_WITH_FILTER : {
						// the list-view component at datatables.net needs AJAX POST method to avoid long URL 
						DataFilter filter = new DataFilter(uri, paramJson);
						return ProfileDataService.filter(filter);
					}
					case API_GET_MODEL : {
						String id = paramJson.getString("id", "0");
						ProfileSingleDataView pf = ProfileDataService.getSingleViewById(id);
						if(pf == null) {
							// in case create new model, the schema data model must be returned from server 
							pf = new ProfileSingleDataView();
						}
						return JsonDataPayload.ok(uri, pf, true);
					}
					case API_UPDATE_MODEL : {
						String json = paramJson.getString("objectJson", "{}");
						String id = ProfileDataService.updateSingleDataViewFromJson(json).getId();
						return JsonDataPayload.ok(uri, id, true);
					}
					case API_REMOVE : {
						// the data is not deleted, we need to remove it from valid data view, set status of object = -4
						String id = paramJson.getString("id", "");
						boolean rs = ProfileDataService.remove(id);
						return JsonDataPayload.ok(uri, rs, true);
					}
					case API_IDENTITY_RESOLUTION : {
						//TODO
						return JsonDataPayload.ok(uri, null, true);
					}
					case API_IMPORT : {
						//TODO
						return JsonDataPayload.ok(uri, null, true);
					}
					case API_EXPORT : {
						//TODO
						return JsonDataPayload.ok(uri, null, true);
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
					case API_GET_MODEL : {
						String id = RequestInfoUtil.getString(params,"id", "new");
						if (!id.isEmpty()) {
							Profile pf;
							if (id.equals("new")) {
								pf = new ProfileSingleDataView();
							} else {
								pf = ProfileDataService.getSingleViewById(id);
							}
							return JsonDataPayload.ok(uri, pf, false);
						}
					}
					case API_GET_TRACKING_EVENTS : {
						String profileId = RequestInfoUtil.getString(params,"id", "");
						int startIndex =   RequestInfoUtil.getInteger(params,"startIndex", 0);
						int numberResult = RequestInfoUtil.getInteger(params,"numberResult", 20);
						List<EventSingleDataView> list = EventTrackingService.getEventActivityFlowOfProfile(profileId, startIndex, numberResult);
						return JsonDataPayload.ok(uri, list, true);
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
