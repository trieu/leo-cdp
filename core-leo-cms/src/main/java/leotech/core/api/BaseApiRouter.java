package leotech.core.api;

import static io.netty.handler.codec.http.HttpHeaderNames.CONNECTION;
import static io.netty.handler.codec.http.HttpHeaderNames.CONTENT_TYPE;

import java.util.Set;

import io.netty.handler.codec.http.HttpHeaderNames;
import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import leotech.system.model.JsonDataPayload;
import leotech.system.util.CookieUUIDUtil;
import leotech.system.util.CookieUserSessionUtil;
import leotech.system.util.HttpTrackingUtil;
import rfx.core.util.StringUtil;

public abstract class BaseApiRouter extends BaseHttpRouter {

	private static final String P_USER_SESSION = "usersession";
	
	public static final String SYSTEM_USER_PREFIX = "/user";
	
	////////////
	public static final String START_DATE = "/start-date";
	public static final String REQ_INFO = "/req-info";
	public static final String GEOLOCATION = "/geolocation";

	public static final String CMS_POST_PREFIX = "/post";
	public static final String CMS_PAGE_PREFIX = "/page";
	public static final String CMS_CATEGORY_PREFIX = "/category";
	public static final String CMS_TOPIC_PREFIX = "/topic";
	public static final String CMS_KEYWORD_PREFIX = "/keyword";

	public static final String SEARCH_PREFIX = "/search";
	public static final String QUERY_PREFIX = "/query";
	public static final String BOT_PREFIX = "/bot";
	public static final String SYSTEM_PREFIX = "/system";

	private JsonDataPayload defaultDataHttpGet = JsonDataPayload.fail("No HTTP GET handler found", 404);
	private JsonDataPayload defaultDataHttpPost = JsonDataPayload.fail("No HTTP POST handler found", 404);

	///////////
	public BaseApiRouter(RoutingContext context) {
		super(context);
	}

	// for implemented POST method
	abstract protected JsonDataPayload callHttpPostHandler(String userSession, String uri, JsonObject paramJson);

	// for implemented GET method
	abstract protected JsonDataPayload callHttpGetHandler(String userSession, String uri, MultiMap params);
	
	
	public void enableAutoRedirectToHomeIf404() {
		defaultDataHttpGet = JsonDataPayload.ok("/", "");
		defaultDataHttpGet.setHttpCode(301);
	}

	protected boolean handle(RoutingContext context) {

		HttpServerRequest request = context.request();
		HttpServerResponse resp = context.response();
		// ---------------------------------------------------------------------------------------------------
		MultiMap outHeaders = resp.headers();
		outHeaders.set(CONNECTION, HttpTrackingUtil.HEADER_CONNECTION_CLOSE);
		outHeaders.set(POWERED_BY, SERVER_VERSION);
		outHeaders.set(CONTENT_TYPE, BaseApiHandler.CONTENT_TYPE_JSON);

		MultiMap reqHeaders = request.headers();
		String origin = StringUtil.safeString(reqHeaders.get(BaseApiHandler.ORIGIN), "*");
		String contentType = StringUtil.safeString(reqHeaders.get(BaseApiHandler.CONTENT_TYPE),BaseApiHandler.CONTENT_TYPE_JSON);

		// CORS Header
		BaseHttpRouter.setCorsHeaders(outHeaders, origin);

		String httpMethod = request.rawMethod();
		String uri = request.path();
		String host = request.host();
		String userAgent = request.getHeader(HttpHeaderNames.USER_AGENT);
		String userIp = CookieUUIDUtil.getRemoteIP(request);
		String leoAdminSession = StringUtil.safeString(reqHeaders.get(HEADER_SESSION));
		
		System.out.println(httpMethod + " ==>>>> host: " + host + " uri: " + uri);

		if (HTTP_POST_NAME.equalsIgnoreCase(httpMethod)) {
			String bodyStr = StringUtil.safeString(context.getBodyAsString(), "{}");
//			System.out.println("HTTP_POST ===> getBodyAsString: " + bodyStr);
//			System.out.println("HTTP_POST ===> contentType: " + contentType);

			JsonObject paramJson = null;
			if (contentType.equalsIgnoreCase(BaseApiHandler.CONTENT_TYPE_JSON)) {
				try {
					paramJson = new JsonObject(bodyStr);
				} catch (io.vertx.core.json.DecodeException e) {
					e.printStackTrace();
					paramJson = new JsonObject();
				}
			} else {
				MultiMap formAttributes = request.formAttributes();
				Set<String> fieldNames = formAttributes.names();
				paramJson = new JsonObject();
				for (String fieldName : fieldNames) {
					paramJson.put(fieldName, StringUtil.safeString(formAttributes.get(fieldName)));
				}
			}

			String userSession = paramJson.getString(P_USER_SESSION, leoAdminSession);

			JsonDataPayload out = callHttpPostHandler(userSession, uri, paramJson);
			if (out != null) {
				resp.end(out.toString());
				return true;
			} else {
				defaultDataHttpPost.setUri(uri);
				resp.end(defaultDataHttpPost.toString());
				return false;
			}

		} else if (HTTP_GET_NAME.equalsIgnoreCase(httpMethod)) {
			
			String userSession = CookieUserSessionUtil.getUserSession(context, leoAdminSession );

			MultiMap params = request.params();
			params.add("__userIp", userIp);
			params.add("__userAgent", userAgent);
			JsonDataPayload out = callHttpGetHandler(userSession, uri, params);
			if (out != null) {
				resp.end(out.toString());
				return true;
			} else {
				if (defaultDataHttpGet.getHttpCode() == 301) {
					resp.putHeader("Location", defaultDataHttpGet.getUri());
					resp.setStatusCode(defaultDataHttpGet.getHttpCode());
					resp.end();
				} else {
					defaultDataHttpGet.setUri(uri);
					resp.end(defaultDataHttpGet.toString());
				}
				return false;
			}
		} else if (HTTP_GET_OPTIONS.equals(httpMethod)) {
			resp.end("");
			return true;
		} else {
			resp.end(JsonDataPayload.fail("Not HTTP handler found for uri:" + uri, 404).toString());
			return false;
		}
	}
}
