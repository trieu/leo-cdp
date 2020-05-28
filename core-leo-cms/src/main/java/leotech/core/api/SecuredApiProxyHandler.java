package leotech.core.api;

import java.util.concurrent.TimeUnit;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.ext.web.RoutingContext;
import leotech.core.api.BaseSecuredDataApi.JsonErrorPayload;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.User;
import leotech.system.util.CookieUserSessionUtil;
import rfx.core.util.HttpClientUtil;
import rfx.core.util.StringUtil;

public class SecuredApiProxyHandler {

    static final class ApiProxyHttpGetRequest {

	String provider;
	String uri;

	public ApiProxyHttpGetRequest(String provider, String uri) {
	    super();

	    this.provider = provider;
	    this.uri = uri;
	}

	public String getProvider() {
	    return provider;
	}

	public void setProvider(String provider) {
	    this.provider = provider;
	}

	public String getUri() {
	    return uri;
	}

	public void setUri(String uri) {
	    this.uri = uri;
	}

	@Override
	public int hashCode() {
	    return toString().hashCode();
	}

	@Override
	public String toString() {
	    return StringUtil.join(":", provider, uri);
	}

    }

    public static final int CACHE_TIME_OUT = 30;// seconds
    static final LoadingCache<ApiProxyHttpGetRequest, String> queriedCache = CacheBuilder.newBuilder().maximumSize(9999999).expireAfterWrite(CACHE_TIME_OUT, TimeUnit.SECONDS)
	    .build(new CacheLoader<ApiProxyHttpGetRequest, String>() {
		@Override
		public String load(ApiProxyHttpGetRequest q) {
		    String url = "http://" + q.getProvider() + q.getUri();
		    String json = HttpClientUtil.executeGet(url).trim();
		    if ("null".equals(json)) {
			return "";
		    }
		    return json;
		}
	    });

    public static String process(RoutingContext context, HttpServerRequest req) {
	String json = "{}";

	String provider = StringUtil.safeString(req.getParam("provider"));
	String uri = StringUtil.safeString(req.getParam("uri"));
	MultiMap reqHeaders = req.headers();
	String userSession = CookieUserSessionUtil.getUserSession(context, StringUtil.safeString(reqHeaders.get(BaseApiRouter.HEADER_SESSION)));

	User loginUser = BaseSecuredDataApi.getUserFromSession(userSession);
	if (loginUser != null) {
	    try {
		String rs = queriedCache.get(new ApiProxyHttpGetRequest(provider, uri));
		json = JsonDataPayload.ok(req.path(), rs, true).toString();
	    } catch (Exception e) {
		e.printStackTrace();
	    }
	} else {
	    json = JsonErrorPayload.NO_AUTHENTICATION.toString();
	}

	return json;
    }
}
