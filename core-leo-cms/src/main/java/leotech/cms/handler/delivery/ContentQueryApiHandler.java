package leotech.cms.handler.delivery;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.analytics.GoogleTrackingUtil;
import leotech.cms.dao.ContentQueryDaoUtil;
import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.ContentClassPostQuery;
import leotech.cms.model.Page;
import leotech.cms.model.Post;
import leotech.cms.model.User;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.JsonDataPayload;
import leotech.system.util.seach.SearchPostUtil;
import rfx.core.util.StringUtil;

public class ContentQueryApiHandler extends BaseSecuredDataApi {
    static final String API_QUERY_POST_BY_CONTENT_CLASS_AND_KEYWORDS = "/query/posts-by-contentclass-and-keywords";
    static final String API_QUERY_POST_BY_CATEGORY_AND_KEYWORDS = "/query/post-by-categories-and-keywords";
    static final String API_QUERY_PAGE_BY_KEYWORDS = "/query/page-by-keywords";
    static final String API_QUERY_DEFAULT_POSTS = "/query/default";
    static final String API_SEACRH_POSTS = "/search/post";

    @Override
    public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
	// NO HTTP POST for QUERY OR SEARCH a list of filterd posts
	return JsonErrorPayload.NO_HANDLER_FOUND;
    }

    @Override
    public JsonDataPayload httpGetApiHandler(String userSession, String uri, MultiMap params) throws Exception {

	// Geo-location
	// GeoLocation loc = GeoLocationUtil.processCookieGeoLocation(req, resp);
	// String locationId = String.valueOf(loc.getGeoNameId());
	// DeviceInfo dv = DeviceInfoUtil.getDeviceInfo(useragent);

	boolean includeProtected = false;
	boolean includePrivate = false;

	User loginUser = getUserFromSession(userSession);
	if (loginUser != null) {
	    includeProtected = true;
	}

	String keywordsStr = StringUtil.safeString(params.get("keywords"), "");
	String[] keywords;
	if (!keywordsStr.isEmpty()) {
	    keywords = keywordsStr.split(",");
	} else {
	    keywords = new String[] {};
	}

	switch (uri) {
	// query for posts by filtering (get all related posts by keywords)
	case API_QUERY_DEFAULT_POSTS: {
	   
	    List<ContentClassPostQuery> ccpQueries = new ArrayList<>();
	    ccpQueries.add(new ContentClassPostQuery("market_news", "news", "1329181"));
	    ccpQueries.add(new ContentClassPostQuery("product_list", "product", "1329376"));
	    ccpQueries.add(new ContentClassPostQuery("project_list", "project", "1329482"));
	    Map<String, Object> results = PostDaoUtil.getPostsOfDefaultHomepage(ccpQueries);

	    // tracking with Google Analytics
	    String userIp = StringUtil.safeString(params.get("__userIp"));
	    String userAgent = StringUtil.safeString(params.get("__userAgent"));
	    String trackingTitle = "homepage";
	    GoogleTrackingUtil.pageView(trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);
	    GoogleTrackingUtil.event("user-tracking", "username:" + loginUser.getUserLogin(), trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);

	    return JsonDataPayload.ok(uri, results);
	}
	// query for posts by filtering (get all related posts by keywords)
	case API_QUERY_POST_BY_CONTENT_CLASS_AND_KEYWORDS: {
	    if (keywords.length == 0) {
		return JsonDataPayload.fail("keywords is empty", 500);
	    } else {
		String contentClass = StringUtil.safeString(params.get("contentClass"), "");
		Map<String, List<Post>> results = ContentQueryDaoUtil.listPostsByContentClassAndKeywords(contentClass, keywords, includeProtected, includePrivate, true);

		// tracking with Google Analytics
		String userIp = StringUtil.safeString(params.get("__userIp"));
		String userAgent = StringUtil.safeString(params.get("__userAgent"));
		String trackingTitle = "landing-page:contentClass:" + contentClass;
		GoogleTrackingUtil.pageView(trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);
		GoogleTrackingUtil.event("user-tracking", "username:" + loginUser.getUserLogin(), trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);

		return JsonDataPayload.ok(uri, results);
	    }
	}
	// query for posts by filtering (get all related posts by keywords at some
	// specific categories)
	case API_QUERY_POST_BY_CATEGORY_AND_KEYWORDS: {
	    String categoryStr = StringUtil.safeString(params.get("categories"), "");
	    String[] categoryKeys = categoryStr.split(",");
	    if (categoryKeys.length == 0) {
		return JsonDataPayload.fail("categoryKeys is empty", 500);
	    } else {
		Map<String, List<Post>> results = ContentQueryDaoUtil.listPostsByCategoriesAndKeywords(categoryKeys, keywords, includeProtected, includePrivate, true);

		// tracking with Google Analytics
		String userIp = StringUtil.safeString(params.get("__userIp"));
		String userAgent = StringUtil.safeString(params.get("__userAgent"));
		String trackingTitle = "landing-page:categories:" + categoryStr;
		GoogleTrackingUtil.pageView(trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);
		GoogleTrackingUtil.event("user-tracking", "username:" + loginUser.getUserLogin(), trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);

		return JsonDataPayload.ok(uri, results);
	    }
	}

	// query for pages by filtering
	case API_QUERY_PAGE_BY_KEYWORDS: {

	    if (keywords.length == 0) {
		return JsonDataPayload.fail("keywords is empty", 500);
	    } else {
		List<Page> results = ContentQueryDaoUtil.listPagesByKeywords(keywords, includeProtected, includePrivate, true);
		return JsonDataPayload.ok(uri, results);
	    }
	}

	case API_SEACRH_POSTS: {
	    if (keywords.length == 0) {
		return JsonDataPayload.fail("keywords is empty", 500);
	    } else {
		// List<Post> results = ContentQueryDaoUtil.searchPost(keywords,
		// includeProtected, includePrivate, true);
		List<Post> results = SearchPostUtil.searchPost(keywords, includeProtected, includePrivate, true);

		// tracking with Google Analytics
		String userIp = StringUtil.safeString(params.get("__userIp"));
		String userAgent = StringUtil.safeString(params.get("__userAgent"));
		String trackingTitle = "search-page:keywords:" + keywordsStr;
		GoogleTrackingUtil.pageView(trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);
		GoogleTrackingUtil.event("user-tracking", "username:" + loginUser.getUserLogin(), trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);

		return JsonDataPayload.ok(uri, results);
	    }
	}
	default: {
	    return JsonErrorPayload.NO_HANDLER_FOUND;
	}
	}
    }

}
