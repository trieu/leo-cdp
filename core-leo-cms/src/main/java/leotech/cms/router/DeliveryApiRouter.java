package leotech.cms.router;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import leotech.cms.handler.delivery.CategoryApiHandler;
import leotech.cms.handler.delivery.ContentQueryApiHandler;
import leotech.cms.handler.delivery.PageApiHandler;
import leotech.cms.handler.delivery.PostApiHandler;
import leotech.cms.handler.delivery.UserApiHandler;
import leotech.core.api.BaseApiRouter;
import leotech.system.model.JsonDataPayload;

/**
 * @author trieu
 * 
 *         App Data API Delivery Handler for Content Hub, Page, Post, Category
 *         and User Login
 *
 */
public class DeliveryApiRouter extends BaseApiRouter {

    
    public DeliveryApiRouter(RoutingContext context) {
	super(context);
    }

    @Override
    public void handle() throws Exception {
	this.handle(this.context);
    }

    @Override
    protected String callHttpPostApiProcessor(String userSession, String uri, JsonObject paramJson) {
	JsonDataPayload payload = null;
	try {

	    if (uri.startsWith(POST_PREFIX)) {
		payload = new PostApiHandler().httpPostApiHandler(userSession, uri, paramJson);
	    }

	    else if (uri.equalsIgnoreCase(PAGE_PREFIX)) {
		payload = new PageApiHandler().httpPostApiHandler(userSession, uri, paramJson);
	    }

	    else if (uri.startsWith(CATEGORY_PREFIX)) {
		payload = new CategoryApiHandler().httpPostApiHandler(userSession, uri, paramJson);
	    }

	    else if (uri.startsWith(USER_PREFIX)) {
		payload = new UserApiHandler().httpPostApiHandler(userSession, uri, paramJson);
	    }

	    else if (uri.startsWith(TOPIC_PREFIX)) {
		// TODO
	    }

	    else if (uri.startsWith(KEYWORD_PREFIX)) {
		// TODO
	    }

	    else if (uri.startsWith(COMMENT_PREFIX)) {
		// TODO
	    }

	    else if (uri.startsWith(BOOKMARK_PREFIX)) {
		// TODO
	    }

	    else if (uri.startsWith(ADS_PREFIX)) {
		// SSP Bid Request processing
		// AdBiddingHandler.handle(context);
	    }
	} catch (Throwable e) {
	    e.printStackTrace();
	    payload = JsonDataPayload.fail(e.getMessage(), 500);
	}
	if (payload == null) {
	    payload = JsonDataPayload.fail("Not handler found for uri:" + uri, 404);
	}
	return payload.toString();
    }

    @Override
    protected String callHttpGetApiProcessor(String userSession, String uri, MultiMap params) {
	JsonDataPayload payload = null;

	try {
	    if (uri.startsWith(QUERY_PREFIX) || uri.startsWith(SEARCH_PREFIX)) {
		payload = new ContentQueryApiHandler().httpGetApiHandler(userSession, uri, params);
	    }

	    else if (uri.startsWith(POST_PREFIX)) {
		payload = new PostApiHandler().httpGetApiHandler(userSession, uri, params);
	    }

	    else if (uri.startsWith(PAGE_PREFIX)) {
		payload = new PageApiHandler().httpGetApiHandler(userSession, uri, params);
	    }

	    else if (uri.startsWith(CATEGORY_PREFIX)) {
		payload = new CategoryApiHandler().httpGetApiHandler(userSession, uri, params);
	    }

	    else if (uri.startsWith(USER_PREFIX)) {
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
	return payload.toString();
    }
}