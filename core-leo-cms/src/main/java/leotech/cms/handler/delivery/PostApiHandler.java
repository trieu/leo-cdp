package leotech.cms.handler.delivery;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.analytics.GoogleTrackingUtil;
import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.Post;
import leotech.cms.model.User;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.JsonDataPayload;
import rfx.core.util.StringUtil;

public class PostApiHandler extends BaseSecuredDataApi {

    static final String URI_GET_POSTS_BY_CONTENT_CLASS = "/post/by-content-class";
    static final String URI_GET_RECENT_POSTS_FROM_PAGE = "/post/recent-from-page";
    static final String URI_GET_POST_INFO = "/post/get-info";
    static final String URI_GET_POSTS_LIST = "/post/get-list";
    static final String URI_GET_POSTS_LIST_BY = "/post/get-list-by";

    @Override
    public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
	return JsonErrorPayload.NO_HANDLER_FOUND;
    }

    @Override
    public JsonDataPayload httpGetApiHandler(String userSession, String uri, MultiMap params) throws Exception {
	boolean includeProtected = false;
	boolean includePrivate = false;
	boolean allowPublicAccess = true;

	User loginUser = getUserFromSession(userSession);
	if (loginUser != null) {
	    includeProtected = true;
	    if (loginUser.getRole() == User.ROLE_ADMIN || loginUser.getRole() == User.ROLE_SUPER_ADMIN) {
		includePrivate = true;
	    }
	}
	System.out.println("##PostApiHandler.loginUser " + loginUser);
	if (allowPublicAccess || includeProtected) {
	    if (uri.equalsIgnoreCase(URI_GET_POSTS_LIST)) {
		String categoryKey = StringUtil.safeString(params.get("categoryKey"));
		String pageId = StringUtil.safeString(params.get("pageId"));
		List<Post> list = PostDaoUtil.listAllByCategoryOrPage(categoryKey, pageId);
		return JsonDataPayload.ok(uri, list, true);
	    } 
	    
	    else if (uri.equalsIgnoreCase(URI_GET_POSTS_LIST_BY)) {
		String ids = StringUtil.safeString(params.get("ids"));	
		String[] list;
		if (!ids.isEmpty()) {
		    list = ids.split(",");
		} else {
		    list = new String[] {};
		}
		List<Post> posts = new ArrayList<>(list.length);
		for (String id : list) {
		    Post post = PostDaoUtil.getById(id);
		    post.compactDataForList(true);
		    posts.add(post);
		}		
		return JsonDataPayload.ok(uri, posts, true);
	    } 
	    
	    else if (uri.equalsIgnoreCase(URI_GET_POSTS_BY_CONTENT_CLASS)) {
		String contentClass = StringUtil.safeString(params.get("q"));		
		String keywordStr = StringUtil.safeString(params.get("keywords"), "");
		
		//filtering all posts must contain all keywords from query
		boolean operatorAnd = StringUtil.safeString(params.get("operator"), "or").equals("and");
		String[] keywords;
		if (!keywordStr.isEmpty()) {
		    keywords = keywordStr.split(",");
		} else {
		    keywords = new String[] {};
		}
		List<Post> list = PostDaoUtil.listAllByContentClassAndKeywords(null,contentClass,keywords, includeProtected, includePrivate,operatorAnd, 0 , 1000);
		
		//TODO tracking 
		//tracking with Google Analytics
		String userIp = StringUtil.safeString(params.get("__userIp"));
		String userAgent = StringUtil.safeString(params.get("__userAgent"));		 
		String trackingTitle = "landing-page: "+contentClass + "-"+keywordStr;
		GoogleTrackingUtil.pageView(trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);
		GoogleTrackingUtil.event("user-tracking", "username:"+loginUser.getUserLogin() , trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);
		
		return JsonDataPayload.ok(uri, list, true);
	    } 
	    
	    else if (uri.equalsIgnoreCase(URI_GET_RECENT_POSTS_FROM_PAGE)) {
		String pageId = StringUtil.safeString(params.get("q"));
		List<Post> list = PostDaoUtil.listAllByPage(pageId);
		return JsonDataPayload.ok(uri, list, true);
	    } 
	    
	    else if (uri.equalsIgnoreCase(URI_GET_POST_INFO)) {
		String postId = StringUtil.safeString(params.get("postId"));
		String slug = StringUtil.safeString(params.get("slug"));
		Post post = null;
		if (!postId.isEmpty() || !slug.isEmpty()) {
		    if( postId.isEmpty()) {			
			post = PostDaoUtil.getBySlug(slug);
		    } else {
			post = PostDaoUtil.getById(postId);
		    }
		    		    
		    if (post != null) {
			
			//tracking with Google Analytics
			String userIp = StringUtil.safeString(params.get("__userIp"));
			String userAgent = StringUtil.safeString(params.get("__userAgent"));
			String trackingTitle = "content-post: "+ post.getContentClass() + "-" +post.getTitle();
			GoogleTrackingUtil.pageView(trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);
			GoogleTrackingUtil.event("user-tracking", "username:"+loginUser.getUserLogin() , trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);
			
			return JsonDataPayload.ok(uri, Arrays.asList(post), true);
		    } else {
			//TODO tracking
			
			return JsonDataPayload.fail("Not found post", 404);
		    }
		} else {
		    return JsonDataPayload.fail("missing param postId or slug", 500);
		}
	    }
	} else {
	    return JsonErrorPayload.NO_AUTHENTICATION;
	}
	return JsonErrorPayload.NO_HANDLER_FOUND;
    }

}
