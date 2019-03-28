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
import leotech.cms.model.renderable.WebPageDataModel;
import leotech.cms.service.MediaNetworkDataService;
import leotech.cms.service.WebPageDataModelService;
import leotech.core.api.BaseApiHandler;
import leotech.core.api.BaseHttpRouter;
import leotech.core.api.SecuredApiProxyHandler;
import leotech.system.model.DeviceInfo;
import leotech.system.template.HandlebarsTemplateUtil;
import leotech.system.template.TemplateUtil;
import leotech.system.util.DeviceInfoUtil;
import leotech.system.util.HttpTrackingUtil;
import rfx.core.configs.WorkerConfigs;
import rfx.core.util.StringUtil;

/**
 * @author trieu
 * 
 *         Main Ad Delivery Handler for Display, Instream and Outstream
 *
 */
public class MainHttpRouter extends BaseHttpRouter {

    private static final String ADS_TXT = "/ads.txt";
    private static final String MIME_TYPE_HTML = ContentType.TEXT_HTML.getMimeType();
    private static final String HTML_DIRECT_RENDER = "/html/";

    static final int CACHING_EXPIRED_TIME = 3600 * 24 * 7;// 7 days
    private static final String MAX_AGE_CACHING_PUBLIC = "max-age=" + CACHING_EXPIRED_TIME + ", public";

    private static final String APP_TEMPLATES = "app-templates";

    public static final String ADMIN_ROUTER = "/admin";
    public static final String API_GATEWAY_ROUTER = "/api-gateway";
    public static final String APP_ROUTER = "/app";
    public static final String PUBLIC_FILE_ROUTER = "/public";
    public static final String VIEW_ROUTER = "/view";
    public static final String HOME_ROUTER = "/";
    static final String ADS_TXT_CONTENT = WorkerConfigs.load().getCustomConfig("ADS_TXT_CONTENT");

    public MainHttpRouter(RoutingContext context) {
	super(context);
	
	boolean enableCaching = WorkerConfigs.load().getCustomConfig("enableUsedCacheHandlebars").trim().equals("true");
	if(enableCaching) {
	    HandlebarsTemplateUtil.enableUsedCache();    
	} else {
	    HandlebarsTemplateUtil.disableUsedCache();    
	}	
    }

    @Override
    public void handle() throws Exception {
	HttpServerRequest req = context.request();
	HttpServerResponse resp = context.response();

	MultiMap outHeaders = resp.headers();
	outHeaders.set(CONNECTION, HttpTrackingUtil.HEADER_CONNECTION_CLOSE);
	outHeaders.set(POWERED_BY, SERVER_VERSION);

	// CORS Header
	String origin = StringUtil.safeString(req.headers().get(BaseApiHandler.ORIGIN), "*");
	

	// ---------------------------------------------------------------------------------------------------
	String url = req.absoluteURI();
	String path = req.path();
	String host = req.host().replace("www.", "");
	MultiMap params = req.params();
		
	String userAgent = req.getHeader(HttpHeaderNames.USER_AGENT);
	DeviceInfo device = DeviceInfoUtil.getDeviceInfo(userAgent);
	
	System.out.println("Full URL "+ url);
	System.out.println("==>>>> host: " + host + " path: " + path);

	if (path.equals(HOME_ROUTER)) {
	    outHeaders.set(CONTENT_TYPE, MIME_TYPE_HTML);
	    BaseHttpRouter.setCorsHeaders(outHeaders, origin);

	    
	    boolean isSpiderBot = SPIDER.equals(device.deviceName);
	    renderWebPage(params, isSpiderBot, resp, host);
	}
	// Progressive Web App in Mobile Hibrid App
	else if (path.startsWith(APP_ROUTER)) {
	    outHeaders.set(CONTENT_TYPE, MIME_TYPE_HTML);
	    BaseHttpRouter.setCorsHeaders(outHeaders, origin);
	    
	    appRoutingHandler(params, resp, path, host);
	}
	// public files (Images, CSS, JS, JSON,...)
	else if (path.startsWith(PUBLIC_FILE_ROUTER)) {
	    publicFileHandler(resp, outHeaders, path, params);
	}
	// small HTML view loader
	else if (path.startsWith(VIEW_ROUTER)) {
	    BaseHttpRouter.setCorsHeaders(outHeaders, origin);
	    viewRoutingHandler(req, resp, path, host);
	}
	// secured API gateway to protected data with ACL
	else if (path.equals(API_GATEWAY_ROUTER)) {
	    outHeaders.set(CONTENT_TYPE, ContentType.APPLICATION_JSON.getMimeType());
	    BaseHttpRouter.setCorsHeaders(outHeaders, origin);
	    String json = SecuredApiProxyHandler.process(context, req);
	    resp.end(json);
	}
	// admin app
	else if (path.equals(ADMIN_ROUTER)) {
	    outHeaders.set(CONTENT_TYPE, MIME_TYPE_HTML);
	    BaseHttpRouter.setCorsHeaders(outHeaders, origin);	    
	    String tplFolder = MediaNetworkDataService.DEFAULT_ADMIN_TEMPLATE_FOLDER;
	    handleWebPageRequest(params,false, host, tplFolder, "index", resp);
	}
	// render public data as normal HTML website for SEO
	else if (path.startsWith(HTML_DIRECT_RENDER)) {
	    // for SEO or Facebook BOT
	    outHeaders.set(CONTENT_TYPE, MIME_TYPE_HTML);
	    WebPageDataModel model = WebPageDataModelService.buildModel(path, host, params);
	    String html = WebPageDataModel.renderHtml(model);
	    resp.setStatusCode(model.getHttpStatusCode());
	    resp.end(html);
	}
	
	//Ads.TXT
	else if(path.equalsIgnoreCase(ADS_TXT)) {	    
	    resp.setStatusCode(HttpStatus.SC_OK);
	    resp.end(ADS_TXT_CONTENT);
	}

	// ---------------------------------------------------------------------------------------------------
	else if (path.equalsIgnoreCase(PING)) {
	    outHeaders.set(CONTENT_TYPE, MIME_TYPE_HTML);
	    resp.end(PONG);
	} else {
	    // JSON data API handler for administrator web app
	    new AdminApiRouter(context).handle();
	}
    }

    //////////////////////////////////////////////////////////////////////////////////////
    // utils //

    void renderWebPage(MultiMap params,boolean isSearchEngineBot, HttpServerResponse resp, String networkDomain) {
	// detect template folder name from domain
	String tplFolderName = MediaNetworkDataService.getWebTemplateFolder(networkDomain);
	if (tplFolderName.isEmpty()) {
	    resp.setStatusCode(HttpStatus.SC_NOT_FOUND);
	    resp.end(TemplateUtil._404);
	    return;
	}
	// then handle app template for end-user
	handleWebPageRequest(params,isSearchEngineBot, networkDomain, tplFolderName, "index", resp);
    }

    void appRoutingHandler(MultiMap params,HttpServerResponse resp, String path, String host) {
	// handler as SPA app for end-user
	// String appId = req.getParam("appid");
	String[] toks = path.split(HOME_ROUTER);
	int length = toks.length;
	if (length > 1) {
	    String appId = toks[length - 1];
	    handleWebPageRequest(params, false, host, appId, "index", resp);
	}
    }

    void publicFileHandler(HttpServerResponse resp, MultiMap outHeaders, String path, MultiMap params) {
	try {
	    String pathname = path.replace(PUBLIC_FILE_ROUTER, "./public").replaceAll("%20", " ");

	    File file = new File(pathname);
	    if (file.isFile()) {
		outHeaders.set(HttpHeaderNames.CACHE_CONTROL, MAX_AGE_CACHING_PUBLIC);
		if (params.get("download") != null) {
		    outHeaders.set(HttpHeaderNames.CONTENT_TYPE, ContentType.APPLICATION_OCTET_STREAM.getMimeType());
		    String name = file.getName();
		    outHeaders.set(HttpHeaderNames.CONTENT_DISPOSITION, "attachment; filename=\"" + name + "\"");
		}
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

    void viewRoutingHandler(HttpServerRequest req, HttpServerResponse resp, String path, String networkDomain) {
	try {
	    boolean isAdminReq = StringUtil.safeString(req.params().get("admin")).equals("1");
	    if (isAdminReq) {
		networkDomain = MediaNetworkDataService.ADMIN_LEOCLOUDCMS_COM;
	    }
	    String tplFolder = MediaNetworkDataService.getWebTemplateFolder(networkDomain);
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

    void handleWebPageRequest(MultiMap params, boolean isSearchEngineBot, String host, String tplFolderName, String tplName, HttpServerResponse resp) {
	WebPageDataModel model = WebPageDataModelService.buildModel(host, tplFolderName, tplName, params);

	String html = WebPageDataModel.renderHtml(model);
	resp.setStatusCode(model.getHttpStatusCode());
	if (isSearchEngineBot) {
	    // TODO, run headless Google Chrome to get full HTML, then caching into REDIS
	    String fullHtml = html;
	    resp.end(fullHtml);
	} else {
	    resp.end(html);
	}
    }

}