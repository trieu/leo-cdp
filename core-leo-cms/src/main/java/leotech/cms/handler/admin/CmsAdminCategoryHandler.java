package leotech.cms.handler.admin;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.dao.CategoryDaoUtil;
import leotech.cms.model.Category;
import leotech.cms.service.CategoryDataService;
import leotech.system.common.SecuredWebDataHandler;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.SystemUser;

public class CmsAdminCategoryHandler extends SecuredWebDataHandler {
	// for Admin CMS, only for ROLE_SUPER_ADMIN
	static final String API_LIST_ALL = "/category/list-all";
	static final String API_CREATE_NEW = "/category/create-new";
	static final String API_UPDATE_INFO = "/category/update-info";
	static final String API_GET_INFO = "/category/get-info";
	static final String API_DELETE = "/category/delete";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
		SystemUser loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAuthorized(loginUser, Category.class)) {
				switch (uri) {
					case API_LIST_ALL : {
						List<Category> list = CategoryDaoUtil.getAllCategories();
						return JsonDataPayload.ok(uri, list, loginUser, Category.class);
					}
					case API_GET_INFO : {
						String key = paramJson.getString("key", "");
						if (!key.isEmpty()) {
							Category category;
							if (key.equals("newcategory")) {
								category = new Category();
							} else {
								category = CategoryDaoUtil.getByKey(key);
							}
							return JsonDataPayload.ok(uri, category, loginUser, Category.class);
						}
					}
					case API_CREATE_NEW : {
						String key = CategoryDataService.save(paramJson, true);
						return JsonDataPayload.ok(uri, key, loginUser, Category.class);
					}
					case API_UPDATE_INFO : {
						String key = CategoryDataService.save(paramJson, false);
						return JsonDataPayload.ok(uri, key, loginUser, Category.class);
					}
					case API_DELETE : {
						String key = paramJson.getString("key", "");
						CategoryDaoUtil.deleteByKey(key);
						return JsonDataPayload.ok(uri, key, true);
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
			if (isAuthorized(user, Category.class)) {
				// skip
			} else {
				return JsonErrorPayload.NO_AUTHORIZATION;
			}
		}
		return JsonErrorPayload.NO_AUTHENTICATION;
	}

}
