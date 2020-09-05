package leotech.cdp.handler;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cdp.dao.singleview.EventSingleDataView;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.model.customer.Profile;
import leotech.cdp.service.EventTrackingService;
import leotech.cdp.service.ProfileDataService;
import leotech.system.common.SecuredWebDataHandler;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.JsonDataTablePayload;
import leotech.system.model.SystemUser;
import leotech.system.util.RequestInfoUtil;

public class CdpProfileHandler extends SecuredWebDataHandler {
	
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
		SystemUser loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAuthorized(loginUser, Profile.class)) {
				switch (uri) {
					case API_LIST_WITH_FILTER : {
						// the list-view component at datatables.net needs AJAX POST method to avoid long URL 
						DataFilter filter = new DataFilter(uri, paramJson);
						JsonDataTablePayload payload = ProfileDataService.filter(filter);
						payload.checkPermission(loginUser, Profile.class);
						return payload;
					}
					case API_GET_MODEL : {
						String id = paramJson.getString("id", "0");
						ProfileSingleDataView pf = ProfileDataService.getSingleViewById(id);
						if(pf == null) {
							// in case create new model, the schema data model must be returned from server 
							pf = new ProfileSingleDataView();
						}
						return JsonDataPayload.ok(uri, pf, loginUser, Profile.class);
					}
					case API_UPDATE_MODEL : {
						String json = paramJson.getString("objectJson", "{}");
						Profile profile = ProfileDataService.updateFromJson(json);
						if(profile != null) {
							String id = profile.getId();
							return JsonDataPayload.ok(uri, id, loginUser, Profile.class);
						} else {
							return JsonDataPayload.fail("failed to save Profile data into database", 500);
						}
					}
					case API_REMOVE : {
						
						String id = paramJson.getString("id", "");
						boolean rs = ProfileDataService.remove(id);
						return JsonDataPayload.ok(uri, rs, loginUser, Profile.class);
					}
					case API_IDENTITY_RESOLUTION : {
						//TODO
						return JsonDataPayload.ok(uri, null, loginUser, Profile.class);
					}
					case API_IMPORT : {
						//TODO
						return JsonDataPayload.ok(uri, null, loginUser, Profile.class);
					}
					case API_EXPORT : {
						//TODO
						return JsonDataPayload.ok(uri, null, loginUser, Profile.class);
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
			if (isAuthorized(loginUser, Profile.class)) {
				switch (uri) {
					case API_LIST_ALL : {
						int startIndex =   RequestInfoUtil.getInteger(params,"startIndex", 0);
						int numberResult = RequestInfoUtil.getInteger(params,"numberResult", 20);
						List<Profile> list = ProfileDataService.list(startIndex, numberResult);
						return JsonDataPayload.ok(uri, list, loginUser, Profile.class);
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
							return JsonDataPayload.ok(uri, pf, loginUser, Profile.class);
						}
					}
					case API_GET_TRACKING_EVENTS : {
						String profileId = RequestInfoUtil.getString(params,"id", "");
						int startIndex =   RequestInfoUtil.getInteger(params,"startIndex", 0);
						int numberResult = RequestInfoUtil.getInteger(params,"numberResult", 20);
						List<EventSingleDataView> list = EventTrackingService.getEventActivityFlowOfProfile(profileId, startIndex, numberResult);
						return JsonDataPayload.ok(uri, list, loginUser, Profile.class);
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
