package leotech.cms.handler.delivery;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.dao.CategoryDaoUtil;
import leotech.cms.model.Category;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.AppMetadata;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.SystemUser;

public class CategoryApiHandler extends BaseSecuredDataApi {

    private static final String CATEGORY_LIST = "/category/list";

    @Override
    public JsonDataPayload httpPostApiHandler(String userSession ,String uri, JsonObject paramJson ) throws Exception {
	 return JsonErrorPayload.NO_HANDLER_FOUND;
    }

    @Override
    public JsonDataPayload httpGetApiHandler(String userSession, String uri, MultiMap params) throws Exception {
	SystemUser loginUser = getUserFromSession(userSession);
	if (loginUser == null) {
	    return JsonErrorPayload.NO_AUTHENTICATION;
	} else {
	    if (uri.equalsIgnoreCase(CATEGORY_LIST)) {
		List<Category> cats = CategoryDaoUtil.listAllByNetwork(AppMetadata.DEFAULT_ID);
		return JsonDataPayload.ok(uri, cats);
	    }
	    return JsonErrorPayload.NO_HANDLER_FOUND;
	}
    }

}
