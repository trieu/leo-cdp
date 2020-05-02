package leotech.cdp.router;

import static io.netty.handler.codec.http.HttpHeaderNames.CONNECTION;
import static io.netty.handler.codec.http.HttpHeaderNames.CONTENT_TYPE;

import com.google.gson.Gson;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.RoutingContext;
import leotech.cdp.model.ContextSession;
import leotech.cdp.router.api.TrackingApi;
import leotech.cdp.router.api.TrackingApiParam;
import leotech.cdp.service.ContextSessionService;
import leotech.cdp.utils.EventTrackingUtil;
import leotech.core.api.BaseApiHandler;
import leotech.core.api.BaseHttpRouter;
import leotech.system.model.DeviceInfo;
import leotech.system.util.DeviceInfoUtil;
import leotech.system.util.HttpTrackingUtil;
import rfx.core.util.StringUtil;

/**
 * @author Trieu Nguyen diagram:
 *         https://github.com/USPA-Technology/leotech-final-build/blob/master/leo-cdp-event-observer-data-flow.md
 *
 */
public class EventObserverHttpRouter extends BaseHttpRouter {

    public static final String INVALID = "invalid";
    public static final String FAILED = "failed";
    public static final String OK = "ok";

    public static final String PREFIX_CLICK_REDIRECT = "/clr";
    
    public static final String PREFIX_CONTEXT_SESSION_PROFILE_INIT = "/cxs-pf-init";
    public static final String PREFIX_EVENT_VIEW = "/etv";
    public static final String PREFIX_EVENT_ACTION = "/eta";
    public static final String PREFIX_EVENT_CONVERSION = "/etc";

    public EventObserverHttpRouter(RoutingContext context) {
	super(context);
    }

    static class ObserverResponse {
	public final String sessionKey;
	public final String message;
	public final int status;

	public ObserverResponse(String sessionKey, String message, int status) {
	    super();
	    this.sessionKey = sessionKey;
	    this.message = message;
	    this.status = status;
	}

    }

    @Override
    public boolean handle() throws Exception {
	HttpServerRequest req = context.request();

	String uri = req.uri();
	System.out.println("RoutingHandler.URI: " + uri);

	MultiMap reqHeaders = req.headers();
	MultiMap params = req.params();
	HttpServerResponse resp = req.response();
	MultiMap outHeaders = resp.headers();
	outHeaders.set(CONNECTION, HttpTrackingUtil.HEADER_CONNECTION_CLOSE);
	outHeaders.set(POWERED_BY, SERVER_VERSION);
	String useragent = StringUtil.safeString(req.getHeader(BaseApiHandler.USER_AGENT));
	DeviceInfo device = DeviceInfoUtil.getDeviceInfo(useragent);
	// int platformId = dv.platformType;

	try {

	    // set CORS Header
	    String origin = StringUtil.safeString(reqHeaders.get(BaseApiHandler.ORIGIN), "*");
	    BaseHttpRouter.setCorsHeaders(outHeaders, origin);
	    outHeaders.set(CONTENT_TYPE, BaseApiHandler.CONTENT_TYPE_JSON);

	    // init core params
	    String eventName = StringUtil.safeString(params.get(TrackingApiParam.EVENT_NAME)).toLowerCase();
	    String clientSessionKey = StringUtil.safeString(params.get(TrackingApiParam.CTX_SESSION_KEY));

	    if (uri.startsWith(PREFIX_CONTEXT_SESSION_PROFILE_INIT) && StringUtil.isEmpty(clientSessionKey)) {

		// init ContextSession 
		ContextSession initSession = ContextSessionService.init(req, params, device);
		resp.end(new Gson().toJson(new ObserverResponse(initSession.getSessionKey(), OK, 101)));

	    } else if (StringUtil.isNotEmpty(eventName)) {

		// synch ContextSession with event tracking
		ContextSession currentSession = ContextSessionService.synchData(clientSessionKey, req, params, device);

		int status = 404;
		if (currentSession != null) {
		    // event-view(pageview|screenview|storeview|trueview,contentId,sessionKey,profileId)
		    if (uri.startsWith(PREFIX_EVENT_VIEW)) {
			status = TrackingApi.recordViewEvent(req, params, device, currentSession, eventName);
		    }

		    // event-action(click|play|touch|contact,sessionKey,profileId)
		    else if (uri.startsWith(PREFIX_EVENT_ACTION)) {
			status = TrackingApi.recordActionEvent(req, params, device, currentSession, eventName);
		    }

		    // event-conversion(add_to_cart|submit_form|checkout,sessionKey,profileId)
		    else if (uri.startsWith(PREFIX_EVENT_CONVERSION)) {
			status = TrackingApi.recordConversionEvent(req, params, device, currentSession, eventName);
		    }

		    // synchronize the device (how), touchpoint's context (where), session (when)
		    // and profile (who) into one object for analytics (understand why)
		    else if (uri.startsWith(PREFIX_CONTEXT_SESSION_PROFILE_INIT)) {
			if (StringUtil.isNotEmpty(currentSession.getEmail())) {
			    status = ContextSessionService.updateSessionWithProfile(req, params, currentSession);
			} else {
			    status = 101;
			}
		    }
		}

		if (status >= 200 && status < 300) {
		    resp.end(new Gson().toJson(new ObserverResponse(currentSession.getSessionKey(), OK, status)));
		} else if (status == 500) {
		    resp.end(new Gson().toJson(new ObserverResponse(currentSession.getSessionKey(), FAILED, status)));
		} else if (status == 102) {
		    resp.end(new Gson().toJson(new ObserverResponse(currentSession.getSessionKey(), OK, status)));
		} else {
		    resp.end(new Gson().toJson(new ObserverResponse(currentSession.getSessionKey(), INVALID, status)));
		}
		return true;

	    }

	    // click redirect for O2O synchronization
	    // E.g: https://domain/clr/5wbwf6yUxVBcr48AMbz9cb
	    else if (uri.startsWith(PREFIX_CLICK_REDIRECT)) {

		String[] segments = uri.split("/");
		String beacon = segments[segments.length - 1];

		if (!beacon.isEmpty()) {
		    // TODO decode beacon and redirect to url, write log to DW
		    String url = "";
		    // AdLogHandler.clickRedirectTracking(req, params, resp, platformId, cid);
		    if (url.length() > 5) {
			resp.headers().add("Location", url);
			resp.setStatusCode(301).end();
		    } else {
			HttpTrackingUtil.trackingResponse(req);
		    }
		} else {
		    resp.setStatusCode(404);
		    resp.end("beacon is INVALID");
		}
		return true;
	    }

	    else if (uri.equalsIgnoreCase("/ping")) {
		outHeaders.set(CONTENT_TYPE, "text/html");
		resp.end("PONG");
		return true;
	    }
	    // no handler found
	    else {
		resp.end("Not handler found for uri:" + uri);
		return false;
	    }
	} catch (Exception e) {
	    // resp.end();
	    System.err.println("uri:" + uri + " error:" + e.getMessage());
	    e.printStackTrace();
	}
	return false;
    }
}