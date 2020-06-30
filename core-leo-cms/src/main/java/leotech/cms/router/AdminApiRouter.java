package leotech.cms.router;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import leotech.cdp.admin.handler.CdpProfileApiHandler;
import leotech.cms.handler.admin.AdminCategoryApiHandler;
import leotech.cms.handler.admin.AdminPageApiHandler;
import leotech.cms.handler.admin.AdminPostApiHandler;
import leotech.cms.handler.admin.AdminSystemApiHandler;
import leotech.cms.handler.admin.AdminUserApiHandler;
import leotech.cms.handler.admin.BotApiHandler;
import leotech.cms.handler.delivery.ContentQueryApiHandler;
import leotech.core.api.BaseApiRouter;
import leotech.system.model.JsonDataPayload;

public class AdminApiRouter extends BaseApiRouter {

	public AdminApiRouter(RoutingContext context) {
		super(context);
	}

	public boolean handle() throws Exception {
		return this.handle(this.context);
	}

	@Override
	protected JsonDataPayload callHttpPostApiProcessor(String userSession, String uri, JsonObject paramJson) {
		JsonDataPayload payload = null;
		try {
			if (uri.startsWith(USER_PREFIX)) {
				payload = new AdminUserApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if (uri.startsWith(CDP_PROFILE_PREFIX)) {
				payload = new CdpProfileApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if (uri.startsWith(CATEGORY_PREFIX)) {
				payload = new AdminCategoryApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if (uri.startsWith(PAGE_PREFIX)) {
				payload = new AdminPageApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if (uri.startsWith(POST_PREFIX)) {
				payload = new AdminPostApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if (uri.startsWith(SYSTEM_PREFIX)) {
				payload = new AdminSystemApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			} 
			//
			else if (uri.startsWith(BOT_PREFIX)) {
				payload = new BotApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
		} catch (Throwable e) {
			if (e instanceof IllegalArgumentException) {
				payload = JsonDataPayload.fail(e.getMessage(), 501);
			} else {
				e.printStackTrace();
				payload = JsonDataPayload.fail(e.getMessage(), 500);
			}
		}
		return payload;
	}

	@Override
	protected JsonDataPayload callHttpGetApiProcessor(String userSession, String uri, MultiMap params) {
		JsonDataPayload payload = null;
		try {
			if (uri.startsWith(USER_PREFIX)) {
				payload = new AdminUserApiHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(CDP_PROFILE_PREFIX)) {
				payload = new CdpProfileApiHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(CATEGORY_PREFIX)) {
				payload = new AdminCategoryApiHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(PAGE_PREFIX)) {
				payload = new AdminPageApiHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(POST_PREFIX)) {
				payload = new AdminPostApiHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(QUERY_PREFIX) || uri.startsWith(SEARCH_PREFIX)) {
				payload = new ContentQueryApiHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(BOT_PREFIX)) {
				payload = new BotApiHandler().httpGetApiHandler(userSession, uri, params);
			}
		} catch (Throwable e) {
			e.printStackTrace();
			payload = JsonDataPayload.fail(e.getMessage(), 500);
		}
		return payload;
	}

}
