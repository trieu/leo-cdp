package leotech.core.api;

import io.vertx.core.http.Cookie;
import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpHeaders;
import io.vertx.ext.web.RoutingContext;

public abstract class BaseHttpRouter {

	public static final String POWERED_BY = "PoweredBy";
	public static final String SERVER_VERSION = "LeoTech";
	public static final String HTTP = "http://";
	public final static String DEFAULT_PATH = "/";
	

	public final String SPIDER = "Spider";

	public final static int COOKIE_AGE_1_DAY = 86400; // One week
	public final static int COOKIE_AGE_1_WEEK = COOKIE_AGE_1_DAY * 7; // One
																		// week
	public final static int COOKIE_AGE_2_WEEKS = COOKIE_AGE_1_DAY * 14; // TWo
																		// week
	public final static int COOKIE_AGE_10_YEAR = 31557600 * 10; // 10 years

	protected static final String PONG = "PONG";
	protected static final String FAVICON_ICO = "/favicon.ico";
	protected static final String PING = "/ping";
	
	public static final String HTTP_POST_NAME = "POST";
	public static final String HTTP_PUT_NAME = "PUT";
	public static final String HTTP_PATCH_NAME = "PATCH";
	public static final String HTTP_GET_NAME = "GET";
	public static final String HTTP_DELETE_NAME = "DELETE";
	
	public static final String HTTP_GET_OPTIONS = "options";
	public static final String HEADER_SESSION = "leouss";

	final protected RoutingContext context;

	public BaseHttpRouter(RoutingContext context) {
		this.context = context;
	}

	public static Cookie createCookie(String name, String value, String domain, String path) {
		Cookie cookie = Cookie.cookie(name, value);
		cookie.setDomain(domain);
		cookie.setPath(path);
		return cookie;
	}

	public static void setCacheControlHeader(MultiMap headers) {
		headers.set(HttpHeaders.CACHE_CONTROL, "private, max-age=600");
	}

	public static void setCorsHeaders(MultiMap headers, String origin) {
		headers.set("Accept-Ranges", "bytes");
		headers.set("Access-Control-Allow-Origin", origin);
		headers.set("Access-Control-Allow-Credentials", "true");
		headers.set("Access-Control-Allow-Methods", "GET,POST");
		headers.set("Access-Control-Allow-Headers", "Content-Type, Range, leouss, *");
		headers.set("Access-Control-Expose-Headers", "Content-Range, Content-Length, leouss");
		headers.set("Access-Control-Max-Age", "86400");
		headers.set("Cache-Control", "no-cache,no-store");
		headers.set("Connection", "Keep-Alive");
		headers.set("P3P", "CP=\"CAO PSA OUR\"");
		headers.set("Pragma", "no-cache");
	}

	abstract public boolean handle() throws Exception;

}