package leotech.cms.router;

import static io.netty.handler.codec.http.HttpHeaderNames.CONNECTION;
import static io.netty.handler.codec.http.HttpHeaderNames.CONTENT_TYPE;

import java.io.File;

import org.apache.http.HttpStatus;
import org.apache.http.entity.ContentType;

import io.netty.handler.codec.http.HttpHeaderNames;
import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.RoutingContext;
import leotech.cms.model.renderable.WebData;
import leotech.cms.service.WebDataServiceUtil;
import leotech.core.api.BaseApiHandler;
import leotech.core.api.BaseApiRouter;
import leotech.core.api.BaseHttpRouter;
import leotech.core.api.PublicFileHttpRouter;
import leotech.core.api.SecuredApiProxyHandler;
import leotech.system.model.DeviceInfo;
import leotech.system.service.AppMetadataService;
import leotech.system.template.HandlebarsTemplateUtil;
import leotech.system.template.TemplateUtil;
import leotech.system.util.DeviceInfoUtil;
import leotech.system.util.HttpTrackingUtil;
import rfx.core.configs.WorkerConfigs;
import rfx.core.util.StringUtil;

/**
 * @author tantrieuf31
 * 
 *  Main HTTP Server Router 
 *
 */
public class MainHttpRouter extends BaseHttpRouter {

	private static final String ADS_TXT = "/ads.txt";
	private static final String ADS_TXT_CONTENT = WorkerConfigs.load().getCustomConfig("ADS_TXT_CONTENT");
	private static final String MIME_TYPE_HTML = ContentType.TEXT_HTML.getMimeType();
	private static final String HTML_DIRECT_RENDER = "/html/";

	private static final String APP_TEMPLATES = "app-templates";

	public static final String ADMIN_ROUTER = "/admin";
	public static final String API_GATEWAY_ROUTER = "/api-gateway";
	public static final String APP_ROUTER = "/app";
	
	public static final String VIEW_ROUTER = "/view";
	public static final String HOME_ROUTER = "/";

	public MainHttpRouter(RoutingContext context) {
		super(context);
		boolean enableCaching = WorkerConfigs.load().getCustomConfig("enableUsedCacheHandlebars").trim()
				.equals("true");
		if (enableCaching) {
			HandlebarsTemplateUtil.enableUsedCache();
		} else {
			HandlebarsTemplateUtil.disableUsedCache();
		}
	}

	@Override
	public boolean handle() throws Exception {
		HttpServerRequest req = context.request();
		HttpServerResponse resp = context.response();

		MultiMap outHeaders = resp.headers();
		outHeaders.set(CONNECTION, HttpTrackingUtil.HEADER_CONNECTION_CLOSE);
		outHeaders.set(POWERED_BY, SERVER_VERSION);

		// CORS Header
		MultiMap reqHeaders = req.headers();
		String origin = StringUtil.safeString(reqHeaders.get(BaseApiHandler.ORIGIN), "*");

		// User Info
		String userSession = StringUtil.safeString(reqHeaders.get(BaseApiRouter.HEADER_SESSION));

		// ---------------------------------------------------------------------------------------------------
		String url = req.absoluteURI();
		String path = req.path();
		MultiMap params = req.params();

		// allow set host from query params or get default from Http-Host
		String host = StringUtil.safeString(params.get("host"), req.host().replace("www.", ""));

		String userAgent = req.getHeader(HttpHeaderNames.USER_AGENT);
		DeviceInfo device = DeviceInfoUtil.getDeviceInfo(userAgent);

		System.out.println("Full URL " + url);
		System.out.println("==>>>> host: " + host + " path: " + path);

		// HOME page
		if (path.equals(HOME_ROUTER) ) {
			outHeaders.set(CONTENT_TYPE, MIME_TYPE_HTML);
			BaseHttpRouter.setCorsHeaders(outHeaders, origin);

			boolean isSearchEngineBot = SPIDER.equals(device.deviceName);
			// detect template folder name from domain
			String tplFolderName = AppMetadataService.getWebTemplateFolder(host);
			if (tplFolderName.isEmpty()) {
				resp.setStatusCode(HttpStatus.SC_NOT_FOUND);
				resp.end(TemplateUtil._404);
				return false;
			}
			// then handle app template for end-user
			handleWebPageRequest(params, isSearchEngineBot, host, tplFolderName, "index", resp, userSession);
		}

		// Progressive Web App in Mobile Hibrid App
		else if (path.startsWith(APP_ROUTER)) {
			outHeaders.set(CONTENT_TYPE, MIME_TYPE_HTML);
			BaseHttpRouter.setCorsHeaders(outHeaders, origin);

			// handler as SPA app for end-user
			// String appId = req.getParam("appid");
			String[] toks = path.split(HOME_ROUTER);
			int length = toks.length;
			if (length > 1) {
				String appId = toks[length - 1];
				handleWebPageRequest(params, false, host, appId, "index", resp, userSession);
			}
		}

		// Files handler with CDN (Images, CSS, JS, JSON,...)
		else if (path.startsWith(PublicFileHttpRouter.PUBLIC_FILE_ROUTER)) {
			PublicFileHttpRouter.handle(resp, outHeaders, path, params);
		}

		// HTML view ajax loader
		else if (path.startsWith(VIEW_ROUTER)) {
			BaseHttpRouter.setCorsHeaders(outHeaders, origin);
			viewRoutingHandler(req, resp, path, host);
		}

		// API gateway to protected data with ACL
		else if (path.equals(API_GATEWAY_ROUTER)) {
			outHeaders.set(CONTENT_TYPE, ContentType.APPLICATION_JSON.getMimeType());
			BaseHttpRouter.setCorsHeaders(outHeaders, origin);
			String json = SecuredApiProxyHandler.process(context, req);
			resp.end(json);
		}

		// Admin app
		else if (path.equals(ADMIN_ROUTER)) {
			outHeaders.set(CONTENT_TYPE, MIME_TYPE_HTML);
			BaseHttpRouter.setCorsHeaders(outHeaders, origin);
			String tplFolder = AppMetadataService.DEFAULT_ADMIN_TEMPLATE_FOLDER;
			handleWebPageRequest(params, false, host, tplFolder, "index", resp, userSession);
		}

		// HTML render public data as website for SEO
		else if (path.startsWith(HTML_DIRECT_RENDER)) {
			// for SEO or Facebook BOT
			outHeaders.set(CONTENT_TYPE, MIME_TYPE_HTML);
			WebData model = WebDataServiceUtil.build(path, host, params, userSession);
			String html = WebData.renderHtml(model);
			resp.setStatusCode(model.getHttpStatusCode());
			resp.end(html);
		}

		// Ads.TXT
		else if (path.equalsIgnoreCase(ADS_TXT)) {
			resp.setStatusCode(HttpStatus.SC_OK);
			resp.end(ADS_TXT_CONTENT);
		}

		// Favicon
		else if (path.equalsIgnoreCase("/favicon.ico")) {
			resp.end("");
		}

		// ---------------------------------------------------------------------------------------------------
		else if (path.equalsIgnoreCase(PING)) {
			outHeaders.set(CONTENT_TYPE, MIME_TYPE_HTML);
			resp.end(PONG);
		} else {
			// JSON data API handler for Leo Content Hub 
			AdminApiRouter adminApiRouter = new AdminApiRouter(context);
			adminApiRouter.enableAutoRedirectToHomeIf404();
			boolean rs = adminApiRouter.handle();
			System.out.println("Admin Handler " + rs);
		}
		return true;
	}

	//////////////////////////////////////////////////////////////////////////////////////
	// utilities //
	

	void viewRoutingHandler(HttpServerRequest req, HttpServerResponse resp, String path, String networkDomain) {
		try {
			boolean isAdminReq = StringUtil.safeString(req.params().get("admin")).equals("1");
			if (isAdminReq) {
				networkDomain = AppMetadataService.ADMIN_LEO_PLATFORM;
			}
			String tplFolder = AppMetadataService.getWebTemplateFolder(networkDomain);
			String relPath = "./resources/" + APP_TEMPLATES + HOME_ROUTER + tplFolder;
			String pathname = path.replace(VIEW_ROUTER, relPath).replaceAll("%20", " ");
			System.out.println("VIEW_ROUTER.pathname " + pathname);
			File file = new File(pathname);
			if (file.isFile()) {
				resp.sendFile(pathname);
			} else {
				resp.setStatusCode(HttpStatus.SC_NOT_FOUND);
				resp.end(TemplateUtil._404);
			}
		} catch (Exception e) {
			resp.setStatusCode(HttpStatus.SC_INTERNAL_SERVER_ERROR);
			resp.end(TemplateUtil._500);
		}
	}

	void handleWebPageRequest(MultiMap params, boolean isSearchEngineBot, String host, String tplFolderName,
			String tplName, HttpServerResponse resp, String userSession) {
		WebData model = WebDataServiceUtil.buildModel(host, tplFolderName, tplName, params, userSession);

		String html = WebData.renderHtml(model);
		resp.setStatusCode(model.getHttpStatusCode());
		if (isSearchEngineBot) {
			// TODO, run headless Google Chrome to get full HTML, then caching
			// into REDIS
			String fullHtml = html;
			resp.end(fullHtml);
		} else {
			resp.end(html);
		}
	}

}