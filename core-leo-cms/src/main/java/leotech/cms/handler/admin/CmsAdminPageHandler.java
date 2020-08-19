package leotech.cms.handler.admin;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.dao.PageDaoUtil;
import leotech.cms.model.Page;
import leotech.cms.service.PageDataService;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.AppMetadata;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.User;

public class CmsAdminPageHandler extends BaseSecuredDataApi {
	
	// for Admin CMS, only for ROLE_ADMIN and ROLE_SUPER_ADMIN
	static final String API_LIST_RECENT_PAGES_OF_CATEGORY = "/page/recent-from-category";
	static final String API_LIST_ALL = "/page/list-of-cate";
	static final String API_SAVE = "/page/save";

	static final String API_GET_INFO = "/page/get-info";
	static final String API_DELETE = "/page/delete";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson)
			throws Exception {
		User loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAdminRole(loginUser)) {
				System.out.println("uri " + uri);

				switch (uri) {
					case API_LIST_ALL : {
						int startIndex = paramJson.getInteger("startIndex", 0);
						int numberResult = paramJson.getInteger("numberResult", 1000);
						List<Page> list = PageDaoUtil.listByNetwork(AppMetadata.DEFAULT_ID, startIndex,
								numberResult);
						return JsonDataPayload.ok(uri, list, true);
					}
					case API_LIST_RECENT_PAGES_OF_CATEGORY : {
						String categoryKey = paramJson.getString("categoryKey", "");
						if (!categoryKey.isEmpty()) {
							List<Page> list = PageDaoUtil.listByCategory(categoryKey);
							return JsonDataPayload.ok(uri, list, true);
						} else {
							return JsonDataPayload.fail("Missing categoryKey", 500);
						}
					}
					case API_SAVE : {
						String key = null;
						try {
							key = PageDataService.savePageInfo(paramJson, loginUser);
						} catch (Throwable e) {
							return JsonDataPayload.fail(e, 500);
						}
						if (key != null) {
							return JsonDataPayload.ok(uri, key, true);
						} else {
							return JsonErrorPayload.UNKNOWN_EXCEPTION;
						}
					}
					case API_GET_INFO : {
						String pageId = paramJson.getString("pageId", "");
						Page page;
						if (pageId.isEmpty()) {
							page = new Page();
						} else {
							page = PageDaoUtil.getById(pageId);
						}
						return JsonDataPayload.ok(uri, page, true);
					}
					case API_DELETE : {
						String pageId = paramJson.getString("pageId", "");
						if (!pageId.isEmpty()) {
							boolean ok = PageDataService.deletePage(pageId);
							return JsonDataPayload.ok(uri, ok, true);
						} else {
							return JsonDataPayload.fail("Missing pageId", 500);
						}
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
		// TODO Auto-generated method stub
		User user = getUserFromSession(userSession);
		if (user != null) {
			if (isAdminRole(user)) {

			} else {
				return JsonErrorPayload.NO_AUTHORIZATION;
			}
		}
		return JsonErrorPayload.NO_AUTHENTICATION;
	}

}
