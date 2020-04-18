package leotech.cdp.router;

import static io.netty.handler.codec.http.HttpHeaderNames.CONNECTION;
import static io.netty.handler.codec.http.HttpHeaderNames.CONTENT_TYPE;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.RoutingContext;
import leotech.cdp.utils.EventTrackingUtil;
import leotech.core.api.BaseHttpRouter;
import leotech.system.util.HttpTrackingUtil;
import rfx.core.util.DateTimeUtil;
import rfx.core.util.StringUtil;

public class EventLogHttpRouter extends BaseHttpRouter {

    private static final String CLICK_REDIRECT = "/click-redirect";
    public static final String PREFIX_EVENT_TRACKING_V1 = "/cdp/v1";

    public EventLogHttpRouter(RoutingContext context) {
	super(context);
    }

    @Override
    public boolean handle() throws Exception {
	HttpServerRequest req = context.request();

	String uri = req.uri();
	System.out.println("RoutingHandler.URI: " + uri);

	MultiMap params = req.params();
	HttpServerResponse resp = req.response();
	MultiMap outHeaders = resp.headers();
	outHeaders.set(CONNECTION, HttpTrackingUtil.HEADER_CONNECTION_CLOSE);
	outHeaders.set(POWERED_BY, SERVER_VERSION);
	//String useragent = StringUtil.safeString(req.getHeader(BaseApiHandler.USER_AGENT));
	//DeviceInfo dv = DeviceInfoUtil.getDeviceInfo(useragent);
	//int platformId = dv.platformType;

	try {

	    // event tracking
	    if (uri.startsWith(PREFIX_EVENT_TRACKING_V1)) {

		// TODO write log
		HttpTrackingUtil.trackingResponse(req);
		return true;
	    }

	    // click redirect
	    else if (uri.startsWith(CLICK_REDIRECT)) {
		String cid = StringUtil.safeString(params.get("cid"));
		String url = StringUtil.safeString(params.get("url"));
		if (!cid.isEmpty()) {
		    // TODO handle click for all URL in content
		    // AdLogHandler.clickRedirectTracking(req, params, resp, platformId, cid);
		    if (url.length() > 4) {
			resp.headers().add("Location", url);
			resp.setStatusCode(301).end();
		    } else {
			HttpTrackingUtil.trackingResponse(req);
		    }
		} else if (url.length() > 4) {
		    MultiMap headers = resp.headers();
		    headers.add("Location", url);
		    resp.setStatusCode(301).end();
		} else {
		    resp.setStatusCode(404);
		    resp.end("url,adid, plm is INVALID");
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
	    }
	    // conversion tracking for 3rd party website
	    else if (uri.startsWith("/metric/conversion")) {
		String host = StringUtil.safeString(params.get("host"));
		if (StringUtil.isNotEmpty(host)) {
		    EventTrackingUtil.updateEvent(DateTimeUtil.currentUnixTimestamp(), "mcvs-" + host, true);
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
