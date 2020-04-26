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

    private static final String TRANSACTION_CODE = "tsc";
    public static final String PREFIX_CLICK_REDIRECT = "/clr/";
    public static final String PREFIX_CONTEXT_SESSION = "/cxs/";
    public static final String PREFIX_EVENT_VIEW = "/etv/";
    public static final String PREFIX_EVENT_ACTION = "/eta/";
    public static final String PREFIX_EVENT_CONVERSION = "/etc/";
    public static final String EVENT_NAME = "en";
    public static final String EVENT_VALUE = "ev";

    public EventObserverHttpRouter(RoutingContext context) {
	super(context);
    }

    static class ObserverResponse {
	public final String data;
	public final int status;

	public ObserverResponse(String data, int status) {
	    super();
	    this.data = data;
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
	DeviceInfo dv = DeviceInfoUtil.getDeviceInfo(useragent);
	// int platformId = dv.platformType;

	try {
	    String sessionKey = StringUtil.safeString(params.get("sk"));
	    ContextSession contextSession = ContextSessionService.synchData(sessionKey, req, params, dv);

	    String origin = StringUtil.safeString(reqHeaders.get(BaseApiHandler.ORIGIN), "*");
	    BaseHttpRouter.setCorsHeaders(outHeaders, origin);
	    outHeaders.set(CONTENT_TYPE, BaseApiHandler.CONTENT_TYPE_JSON);

	    String eventName = StringUtil.safeString(params.get(EVENT_NAME)).toLowerCase();

	    if (StringUtil.isNotEmpty(sessionKey) && StringUtil.isNotEmpty(eventName)) {

		boolean ok = false;
		if (contextSession != null) {
		    // event-view(pageview|screenview|storeview|trueview,contentId,sessionKey,profileId)
		    if (uri.startsWith(PREFIX_EVENT_VIEW)) {
			//ok = TrackingApi.record(contextSession, eventName);

		    }
		    // event-action(click|play|touch|contact,sessionKey,profileId)
		    else if (uri.startsWith(PREFIX_EVENT_ACTION)) {
			int eventValue = StringUtil.safeParseInt(params.get(EVENT_VALUE));
			//ok = TrackingApi.record(contextSession, eventName, eventValue);
		    }

		    // event-conversion(add_to_cart|submit_form|checkout,sessionKey,profileId)
		    else if (uri.startsWith(PREFIX_EVENT_CONVERSION)) {
			int eventValue = StringUtil.safeParseInt(params.get(EVENT_VALUE));
			String transactionCode = StringUtil.safeString(params.get(TRANSACTION_CODE));
			// TODO for ext conversion data
			//ok = TrackingApi.record(contextSession, eventName, eventValue, transactionCode);
		    }
		}

		if (ok) {
		    resp.end(new Gson().toJson(new ObserverResponse("ok", 200)));
		} else {
		    resp.end(new Gson().toJson(new ObserverResponse("failed", 503)));
		}
		return true;

	    }

	    // synchronize the device (how), touchpoint's context (where), session (when)
	    // and profile (who) into one object for analytics (understand why)
	    else if (uri.startsWith(PREFIX_CONTEXT_SESSION)) {
		// CORS Header

		if (contextSession != null) {
		    resp.end(new Gson().toJson(new ObserverResponse(contextSession.getSessionKey(), 101)));
		}

		// TODO write log to Apache Kafka

		return true;
	    }

	    // click redirect for O2O synchronization . E.g:
	    // https://domain/clr/5wbwf6yUxVBcr48AMbz9cb
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

	    // ------ analytics handlers -----------
	    else if (uri.startsWith("/metric/pageview")) {
		// https://log.[hostname]/metric/pageview?uuid=cdebc033538a4ea596ab21b6b1567ecf&referrer=&url=https%3A%2F%2Fwww.fshare.vn%2Ffile%2FOKLYRPW83HVQ&host=www.fshare.vn&t=1450609053690&sid=7&tag=download%2Findex
		String host = StringUtil.safeString(params.get("host")).toLowerCase();
		String tag = StringUtil.safeString(params.get("tag")).toLowerCase();
		if (StringUtil.isNotEmpty(host) && StringUtil.isNotEmpty(tag)) {
		    // RealtimeTrackingUtil.updateEvent("pv:",DateTimeUtil.currentUnixTimestamp(),
		    // "mpav-"+host, true);
		    String uuid = StringUtil.safeString(params.get("uuid"));
		    EventTrackingUtil.recordTrackingEvent(host, uuid, tag);
		}
		HttpTrackingUtil.trackingResponse(req);
		return true;
	    } else if (uri.startsWith("/metric/event")) {
		// https://log.[hostname]/metric/event?uuid=cdebc033538a4ea596ab21b6b1567ecf&referrer=&url=https%3A%2F%2Fwww.fshare.vn%2Ffile%2FOKLYRPW83HVQ&host=www.fshare.vn&t=1450609053690&event=tgrm2016-pv
		String hostReferer = StringUtil.safeString(params.get("host")).toLowerCase();
		String event = StringUtil.safeString(params.get("event")).toLowerCase();

		if (StringUtil.isNotEmpty(hostReferer) && StringUtil.isNotEmpty(event)) {
		    String uuid = StringUtil.safeString(params.get("uuid"));
		    EventTrackingUtil.recordTrackingEvent(hostReferer, uuid, "epv");
		}
		HttpTrackingUtil.trackingResponse(req);
		return true;
	    } else if (uri.equalsIgnoreCase("/ping")) {
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
