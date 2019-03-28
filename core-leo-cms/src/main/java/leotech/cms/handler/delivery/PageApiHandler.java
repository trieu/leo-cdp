package leotech.cms.handler.delivery;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.dao.PageDaoUtil;
import leotech.cms.model.Page;
import leotech.cms.model.User;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.JsonDataPayload;
import rfx.core.util.StringUtil;

public class PageApiHandler extends BaseSecuredDataApi {

    static final String API_PAGE_LIST_BY_CATEGORY = "/page/list-by-category";
    static final String API_PAGE_LIST_BY_KEYWORD = "/page/list-by-keyword";

    @Override
    public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
	User loginUser = getUserFromSession(userSession);
	if (loginUser == null) {
	    return JsonErrorPayload.NO_AUTHENTICATION;
	} else {
	    if (uri.equalsIgnoreCase(API_PAGE_LIST_BY_CATEGORY)) {
		String catId = paramJson.getString("categoryId", "");
		if (catId.isEmpty()) {
		    return JsonDataPayload.fail("categoryId is empty", 500);
		} else {
		    List<Page> pages = PageDaoUtil.listByCategory(catId);
		    return JsonDataPayload.ok(uri, pages);
		}
	    }
	    return JsonErrorPayload.NO_HANDLER_FOUND;
	}

    }

    @Override
    public JsonDataPayload httpGetApiHandler(String userSession, String uri, MultiMap params) throws Exception {
	User loginUser = getUserFromSession(userSession);
	if (loginUser == null) {
	    return JsonErrorPayload.NO_AUTHENTICATION;
	} else {
	    if (uri.equalsIgnoreCase(API_PAGE_LIST_BY_CATEGORY)) {
		String catId = StringUtil.safeString(params.get("categoryId"), "");
		if (catId.isEmpty()) {
		    return JsonDataPayload.fail("categoryId is empty", 500);
		} else {
		    List<Page> pages = PageDaoUtil.listByCategory(catId);
		    return JsonDataPayload.ok(uri, pages);
		}
	    }
	    return JsonErrorPayload.NO_HANDLER_FOUND;
	}
    }

}
