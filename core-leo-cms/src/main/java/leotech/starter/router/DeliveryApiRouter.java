package leotech.starter.router;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import leotech.cms.handler.delivery.CategoryApiHandler;
import leotech.cms.handler.delivery.ContentQueryApiHandler;
import leotech.cms.handler.delivery.PageApiHandler;
import leotech.cms.handler.delivery.PostApiHandler;
import leotech.cms.handler.delivery.UserApiHandler;
import leotech.system.common.BaseApiRouter;
import leotech.system.model.JsonDataPayload;

/**
 * @author trieu
 * 
 *  API Data Delivery Handler for Ads, Content Hub, Page, Post, Category and User Login
 *
 */
public class DeliveryApiRouter extends BaseApiRouter {
	
	public static final String COMMENT_PREFIX = "/comment";
	public static final String BOOKMARK_PREFIX = "/bookmark";
	
	

	public DeliveryApiRouter(RoutingContext context) {
		super(context);
	}

	@Override
	public boolean handle() throws Exception {
		return this.handle(this.context);
	}

	@Override
	protected JsonDataPayload callHttpPostHandler(String userSession, String uri, JsonObject paramJson) {
		JsonDataPayload payload = null;
		try {

			if (uri.startsWith(CMS_POST_PREFIX)) {
				payload = new PostApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			}

			else if (uri.equalsIgnoreCase(CMS_PAGE_PREFIX)) {
				payload = new PageApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			}

			else if (uri.startsWith(CMS_CATEGORY_PREFIX)) {
				payload = new CategoryApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			}

			else if (uri.startsWith(SYSTEM_USER_PREFIX)) {
				payload = new UserApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			}

			else if (uri.startsWith(CMS_TOPIC_PREFIX)) {
				// TODO
			}

			else if (uri.startsWith(CMS_KEYWORD_PREFIX)) {
				// TODO
			}

			else if (uri.startsWith(COMMENT_PREFIX)) {
				// TODO
			}

			else if (uri.startsWith(BOOKMARK_PREFIX)) {
				// TODO
			}
			
		} catch (Throwable e) {
			e.printStackTrace();
			payload = JsonDataPayload.fail(e.getMessage(), 500);
		}
		if (payload == null) {
			payload = JsonDataPayload.fail("Not handler found for uri:" + uri, 404);
		}
		return payload;
	}

	@Override
	protected JsonDataPayload callHttpGetHandler(String userSession, String uri, MultiMap params) {
		JsonDataPayload payload = null;

		try {
			if (uri.startsWith(QUERY_PREFIX) || uri.startsWith(SEARCH_PREFIX)) {
				payload = new ContentQueryApiHandler().httpGetApiHandler(userSession, uri, params);
			}
			else if (uri.startsWith(CMS_POST_PREFIX)) {
				payload = new PostApiHandler().httpGetApiHandler(userSession, uri, params);
			}

			else if (uri.startsWith(CMS_PAGE_PREFIX)) {
				payload = new PageApiHandler().httpGetApiHandler(userSession, uri, params);
			}

			else if (uri.startsWith(CMS_CATEGORY_PREFIX)) {
				payload = new CategoryApiHandler().httpGetApiHandler(userSession, uri, params);
			}

			else if (uri.startsWith(SYSTEM_USER_PREFIX)) {
				payload = new UserApiHandler().httpGetApiHandler(userSession, uri, params);
			}

			else if (uri.equalsIgnoreCase(PING)) {
				payload = JsonDataPayload.ok(uri, PONG);
			}

			else if (uri.equalsIgnoreCase(START_DATE)) {
				payload = JsonDataPayload.ok(uri, START_DATE);
			}
			
		} catch (Throwable e) {
			e.printStackTrace();
			payload = JsonDataPayload.fail(e.getMessage(), 500);
		}

		if (payload == null) {
			payload = JsonDataPayload.fail("Not handler found for uri:" + uri, 404);
		}
		return payload;
	}
}