package leotech.cms.handler.delivery;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.Post;
import leotech.cms.model.User;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.JsonDataPayload;
import rfx.core.util.StringUtil;

public class PostApiHandler extends BaseSecuredDataApi {

    static final String API_LIST_RECENT_POSTS_BY_CONTENT_CLASS = "/post/by-content-class";
    static final String API_LIST_RECENT_POSTS_OF_PAGE = "/post/recent-from-page";
    static final String API_GET_INFO = "/post/get-info";
    static final String API_GET_LIST = "/post/get-list";
    static final String API_GET_LIST_BY = "/post/get-list-by";

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
	    if (uri.equalsIgnoreCase(API_GET_LIST)) {
		String categoryKey = StringUtil.safeString(params.get("categoryKey"));
		String pageId = StringUtil.safeString(params.get("pageId"));
		List<Post> list = PostDaoUtil.listAllByCategoryOrPage(categoryKey, pageId);
		return JsonDataPayload.ok(uri, list, true);
	    } 
	    
	    else if (uri.equalsIgnoreCase(API_GET_LIST_BY)) {
		//FIXME 
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
	    
	    else if (uri.equalsIgnoreCase(API_LIST_RECENT_POSTS_BY_CONTENT_CLASS)) {
		String contentClass = StringUtil.safeString(params.get("q"));		
		String k = StringUtil.safeString(params.get("keywords"), "");
		
		//filtering all posts must contain all keywords from query
		boolean operatorAnd = StringUtil.safeString(params.get("operator"), "or").equals("and");
		String[] keywords;
		if (!k.isEmpty()) {
		    keywords = k.split(",");
		} else {
		    keywords = new String[] {};
		}
		List<Post> list = PostDaoUtil.listAllByContentClassAndKeywords(contentClass,keywords, includeProtected, includePrivate,operatorAnd, 0 , 1000);
		return JsonDataPayload.ok(uri, list, true);
	    } 
	    
	    else if (uri.equalsIgnoreCase(API_LIST_RECENT_POSTS_OF_PAGE)) {
		String pageId = StringUtil.safeString(params.get("q"));
		List<Post> list = PostDaoUtil.listAllByPage(pageId);
		return JsonDataPayload.ok(uri, list, true);
	    } 
	    
	    else if (uri.equalsIgnoreCase(API_GET_INFO)) {
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
			return JsonDataPayload.ok(uri, Arrays.asList(post), true);
		    } else {
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
