package leotech.cdp.admin.handler;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.google.common.collect.ImmutableMap;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cdp.dao.MediaJourneyMapDao;
import leotech.cdp.model.customer.Profile;
import leotech.cdp.model.journey.MediaChannelType;
import leotech.cdp.model.journey.MediaJourneyMap;
import leotech.cdp.service.JourneyMapService;
import leotech.core.api.SecuredWebDataHandler;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.JsonDataTablePayload;
import leotech.system.model.SystemUser;
import leotech.system.util.ClassStaticDataList;
import leotech.system.util.RequestInfoUtil;

public class CdpJourneyMapHandler extends SecuredWebDataHandler {
	
	// for dataList view
	static final String API_LIST_ALL = "/cdp/journeymaps";
	static final String API_LIST_WITH_FILTER = "/cdp/journeymaps/filter";
	
	// for dataList view
	static final String API_CREATE_NEW = "/cdp/journeymap/new";
	static final String API_UPDATE_MODEL = "/cdp/journeymap/update";
	static final String API_GET_MODEL = "/cdp/journeymap/get";
	static final String API_REMOVE = "/cdp/journeymap/remove";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
		SystemUser loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAuthorized(loginUser, MediaJourneyMap.class)) {
				switch (uri) {
					case API_LIST_WITH_FILTER : {
						// the list-view component at datatables.net needs Ajax POST method to avoid long URL 
						DataFilter filter = new DataFilter(uri, paramJson);
						JsonDataTablePayload payload = JourneyMapService.filter(filter);
						payload.checkPermission(loginUser, Profile.class);
						return payload;
					}
					case API_GET_MODEL : {
						String id = paramJson.getString("id", "");
						MediaJourneyMap map;
						if(id.isEmpty()) {
							map = MediaJourneyMapDao.getDefaultMap();
						} else {
							map = MediaJourneyMapDao.get(id);
						}
						return JsonDataPayload.ok(uri, map, loginUser, MediaJourneyMap.class);
					}
					case API_UPDATE_MODEL : {
						String key = null;
						//TODO                                                                                                                                                                                                                                                                
						return JsonDataPayload.ok(uri, key, loginUser, MediaJourneyMap.class);
					}
					case API_REMOVE : {
						// the data is not deleted, we need to remove it from valid data view, set status of object = -4
						//TODO
						boolean rs = false;
						return JsonDataPayload.ok(uri, rs, loginUser, MediaJourneyMap.class);
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
			if (isAuthorized(loginUser, MediaJourneyMap.class)) {
				switch (uri) {
					case API_LIST_ALL : {
						int startIndex =   RequestInfoUtil.getInteger(params,"startIndex", 0);
						int numberResult = RequestInfoUtil.getInteger(params,"numberResult", 20);
						//TODO
						List<MediaJourneyMap> list = new ArrayList<MediaJourneyMap>();
						return JsonDataPayload.ok(uri, list, loginUser, MediaJourneyMap.class);
					}
					case API_GET_MODEL : {
						String id = RequestInfoUtil.getString(params, "id", "");
						MediaJourneyMap map;
						if(id.isEmpty()) {
							map = MediaJourneyMapDao.getDefaultMap();
						} else {
							map = MediaJourneyMapDao.get(id);
						}
						Map<Integer, String> channelTypes = ClassStaticDataList.getIntegerMap(MediaChannelType.class); 
						Map<String,Object> data = ImmutableMap.of("mediaJourneyMap", map, "channelTypes", channelTypes);
						return JsonDataPayload.ok(uri, data, loginUser, MediaJourneyMap.class);
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
