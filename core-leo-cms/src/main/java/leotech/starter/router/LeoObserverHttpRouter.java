package leotech.starter.router;

import static io.netty.handler.codec.http.HttpHeaderNames.CONNECTION;
import static io.netty.handler.codec.http.HttpHeaderNames.CONTENT_TYPE;

import com.google.gson.Gson;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.RoutingContext;
import leotech.cdp.model.analytics.ContextSession;
import leotech.cdp.router.api.TrackingApi;
import leotech.cdp.router.api.TrackingApiParam;
import leotech.cdp.service.ContextSessionService;
import leotech.cdp.service.TargetMediaUnitService;
import leotech.system.common.BaseApiHandler;
import leotech.system.common.BaseHttpRouter;
import leotech.system.common.PublicFileHttpRouter;
import leotech.system.model.DeviceInfo;
import leotech.system.util.DeviceInfoUtil;
import leotech.system.util.HttpTrackingUtil;
import rfx.core.util.StringUtil;

/**
 * @author Trieu Nguyen diagram:
 * https://github.com/USPA-Technology/leotech-final-build/blob/master/leo-cdp-event-observer-data-flow.md
 *
 */
public class LeoObserverHttpRouter extends BaseHttpRouter {

	public static final String INVALID = "invalid";
	public static final String FAILED = "failed";
	public static final String OK = "ok";

	public static final String PREFIX_REDIRECT_TARGET_MEDIA_UNIT = "/rtmu/";

	public static final String PREFIX_CONTEXT_SESSION_PROFILE_INIT = "/cxs-pf-init";
	public static final String PREFIX_UPDATE_PROFILE_INFO = "/cxs-pf-update";
	
	public static final String PREFIX_EVENT_VIEW = "/etv";
	public static final String PREFIX_EVENT_ACTION = "/eta";
	public static final String PREFIX_EVENT_CONVERSION = "/etc";

	public LeoObserverHttpRouter(RoutingContext context) {
		super(context);
		
		// TODO trigger a scheduler for data summary computation 
	}

	static class ObserverResponse {
		public final String sessionKey;
		public final String visitorId;
		public final String message;
		public final int status;

		public ObserverResponse(String visitorId, String sessionKey, String message, int status) {
			super();
			this.visitorId = visitorId;
			this.sessionKey = sessionKey;
			this.message = message;
			this.status = status;
		}
	}

	@Override
	public boolean handle() throws Exception {
		HttpServerRequest req = context.request();

		String httpMethod = req.rawMethod();
		String uri = req.uri();
		
		System.out.println(httpMethod + " : " + req.absoluteURI());

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

			// init core params
			String eventName = StringUtil.safeString(params.get(TrackingApiParam.EVENT_METRIC_NAME)).toLowerCase();
			String clientSessionKey = StringUtil.safeString(params.get(TrackingApiParam.CTX_SESSION_KEY));

			if(httpMethod.equalsIgnoreCase("GET") && uri.startsWith("/track/ads")) {
				//TODO
				resp.end("");
			}
			else if (uri.startsWith(PREFIX_CONTEXT_SESSION_PROFILE_INIT) && StringUtil.isEmpty(clientSessionKey)) {
				
				BaseHttpRouter.setCorsHeaders(outHeaders, origin);
				outHeaders.set(CONTENT_TYPE, BaseApiHandler.CONTENT_TYPE_JSON);
				
				// synchronize session (when) with user's device (how), touchpoint's context (where) and profile (who)
				// into one object for analytics (understand why)
			
				ContextSession session = ContextSessionService.init(req, params, device);
				resp.end(new Gson().toJson(new ObserverResponse(session.getVisitorId(), session.getSessionKey(), OK, 101)));
				
			} 
			else if (StringUtil.isNotEmpty(eventName)) {
				
				BaseHttpRouter.setCorsHeaders(outHeaders, origin);
				outHeaders.set(CONTENT_TYPE, BaseApiHandler.CONTENT_TYPE_JSON);

				// synch ContextSession with event tracking
				ContextSession currentSession = ContextSessionService.synchData(clientSessionKey, req, params,device);

				int status = 404;
				if (currentSession != null) {
					// event-view(pageview|screenview|storeview|trueview|placeview,contentId,sessionKey,visitorId)
					if (uri.startsWith(PREFIX_EVENT_VIEW)) {
						status = TrackingApi.recordViewEvent(req, params, device, currentSession, eventName);
					}

					// event-action(click|play|touch|contact|watch|test,sessionKey,visitorId)
					else if (uri.startsWith(PREFIX_EVENT_ACTION)) {
						status = TrackingApi.recordActionEvent(req, params, device, currentSession, eventName);
					}

					// event-conversion(add_to_cart|submit_form|checkout|join,sessionKey,visitorId)
					else if (uri.startsWith(PREFIX_EVENT_CONVERSION)) {
						status = TrackingApi.recordConversionEvent(req, params, device, currentSession, eventName);
					}
					
				} else {
					//
					resp.end(new Gson().toJson(new ObserverResponse("","", INVALID, status)));
				}

				String visitorId = currentSession.getVisitorId();
				String sessionKey = currentSession.getSessionKey();
				if (status >= 200 && status < 300) {
					ObserverResponse rs = new ObserverResponse(visitorId,sessionKey, OK, status);
					resp.end(new Gson().toJson(rs));
				} else if (status == 500) {
					ObserverResponse rs = new ObserverResponse(visitorId,sessionKey, FAILED, status);
					resp.end(new Gson().toJson(rs));
				} else if (status == 102) {
					ObserverResponse rs = new ObserverResponse(visitorId,sessionKey, OK, status);
					resp.end(new Gson().toJson(rs));
				} else {
					ObserverResponse rs = new ObserverResponse(visitorId,sessionKey, INVALID, status);
					resp.end(new Gson().toJson(rs));
				}
				return true;
				
			} 
			else if(httpMethod.equalsIgnoreCase("POST") && uri.startsWith(PREFIX_UPDATE_PROFILE_INFO)) {
				
				BaseHttpRouter.setCorsHeaders(outHeaders, origin);
				outHeaders.set(CONTENT_TYPE, BaseApiHandler.CONTENT_TYPE_JSON);
				
				int status = 404;
				// SYNCH ContextSession with request
				ContextSession currentSession = ContextSessionService.synchData(clientSessionKey, req, params, device);
				
				// UPDATE profile from POST data
				String profileId = currentSession.getProfileId();
				if (StringUtil.isNotEmpty(profileId)) {
					status = ContextSessionService.updateProfileData(req, params, currentSession, device);
				} else {
					status = 101;
				}
				resp.end(new Gson().toJson(new ObserverResponse(currentSession.getVisitorId(),currentSession.getSessionKey(), OK, status)));
			}

			// click redirect for O2O synchronization
			// E.g: https://demotrack.leocdp.net/rtmu/294HGH6ZYaYyOBqdTnjhG3
			else if (uri.startsWith(PREFIX_REDIRECT_TARGET_MEDIA_UNIT)) {
				String[] toks = uri.split("/");
				String id = toks[toks.length - 1];

				if (!id.isEmpty()) {
					
					String url = TargetMediaUnitService.recordEventAndGetLandingPageUrl(id, req, params, device);
					// AdLogHandler.clickRedirectTracking(req, params, resp, platformId, cid);
					if (url.length() > 10) {
						resp.headers().add("Location", url);
						resp.setStatusCode(301).end();
					} else {
						HttpTrackingUtil.trackingResponse(req);
					}
				} else {
					resp.setStatusCode(404);
					resp.end("TargetMediaUnit ID is INVALID");
				}
				return true;
			}
			
			
			// Files handler with CDN (Images, CSS, JS, JSON,...)
			else if (req.path().startsWith(PublicFileHttpRouter.PUBLIC_FILE_ROUTER)) {
				PublicFileHttpRouter.handle(resp, outHeaders, req.path(), params);
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
