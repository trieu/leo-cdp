package leotech.cms.handler.admin;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.Post;
import leotech.cms.service.PostDataService;
import leotech.core.api.BaseSecuredDataApi;
import leotech.query.util.SearchPostUtil;
import leotech.system.model.AppMetadata;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.SystemUser;
import rfx.core.util.StringUtil;

public class CmsAdminPostApiHandler extends BaseSecuredDataApi {

	// for Admin CMS, only for ROLE_ADMIN and ROLE_SUPER_ADMIN
	static final String API_LIST_ALL = "/post/list-all";
	static final String API_LIST_RECENT_POSTS_OF_PAGE = "/post/recent-from-page";
	static final String API_SAVE = "/post/save";
	static final String API_GET_INFO = "/post/get-info";
	static final String API_GET_BY_CONTENT_CLASS_AND_KEYWORDS = "/post/by-content-class-and-keywords";
	static final String API_DELETE = "/post/delete";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson)
			throws Exception {
		SystemUser loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAuthorized(loginUser, Post.class)) {
				if (uri.equalsIgnoreCase(API_LIST_ALL)) {
					int startIndex = paramJson.getInteger("startIndex", 0);
					int numberResult = paramJson.getInteger("numberResult", 1000);
					List<Post> list = PostDaoUtil.listByNetwork(AppMetadata.DEFAULT_ID, startIndex, numberResult);
					return JsonDataPayload.ok(uri, list, loginUser, Post.class);
				} 
				else if (uri.equalsIgnoreCase(API_LIST_RECENT_POSTS_OF_PAGE)) {
					String pageId = StringUtil.safeString(paramJson.getString("pageId"));
					List<Post> list = PostDaoUtil.listAllByPage(pageId);
					return JsonDataPayload.ok(uri, list, loginUser, Post.class);
				}
				else if (uri.equalsIgnoreCase(API_SAVE)) {
					String key = null;
					try {
						key = PostDataService.savePost(paramJson, loginUser);
					} catch (Throwable e) {
						return JsonDataPayload.fail(e, 500);
					}
					if (key != null) {
						return JsonDataPayload.ok(uri, key, loginUser, Post.class);
					} else {
						return JsonErrorPayload.UNKNOWN_EXCEPTION;
					}
				} 
				else if (uri.equalsIgnoreCase(API_GET_INFO)) {
					String postId = paramJson.getString("postId", "");
					Post post;
					if (postId.isEmpty()) {
						post = new Post(); // as new object schema for create
					} else {
						post = PostDaoUtil.getById(postId);
					}
					return JsonDataPayload.ok(uri, post, loginUser, Post.class);
				} 
				else if (uri.equalsIgnoreCase(API_DELETE)) {
					String postId = paramJson.getString("postId", "");
					if (!postId.isEmpty()) {
						boolean ok = PostDataService.deletePost(postId);
						return JsonDataPayload.ok(uri, ok, loginUser, Post.class);
					} else {
						return JsonDataPayload.fail("Missing postId", 500);
					}
				}
			}
			return JsonErrorPayload.NO_AUTHORIZATION;

		} else {
			return JsonErrorPayload.NO_AUTHENTICATION;
		}
	}

	@Override
	public JsonDataPayload httpGetApiHandler(String userSession, String uri, MultiMap params) throws Exception {
		SystemUser loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (uri.equalsIgnoreCase(API_GET_BY_CONTENT_CLASS_AND_KEYWORDS)) {
				String contentClass = StringUtil.safeString(params.get("contentClass"));
				String k = StringUtil.safeString(params.get("keywords"), "");
				String[] keywords;
				if (!k.isEmpty()) {
					keywords = k.split(",");
				} else {
					keywords = new String[]{};
				}
				// FIXME
				List<String> contentClasses = Arrays.asList(contentClass);
				List<Post> list = PostDaoUtil.listAllByContentClassAndKeywords(null, contentClasses, keywords, true,
						false, false, 0, 1000);
				return JsonDataPayload.ok(uri, list, loginUser, Post.class);
			} 
			else if (uri.equalsIgnoreCase("/post/search")) {
				String k = StringUtil.safeString(params.get("keywords"), "");
				String[] keywords;
				if (!k.isEmpty()) {
					keywords = k.split(",");
				} else {
					keywords = new String[]{};
				}
				// FIXME check authorization
				List<Post> results = SearchPostUtil.searchPost(keywords, 1, 100);
				return JsonDataPayload.ok(uri, results, loginUser, Post.class);
			}
		} else {
			if (uri.equalsIgnoreCase("/post/keywords-for-search")) {
				List<String> list = PostDaoUtil.getAllKeywords();
				List<Map<String, String>> keywords = list.stream().map(e -> {
					Map<String, String> map = new HashMap<>(1);
					map.put("name", e);
					return map;
				}).collect(Collectors.toList());
				JsonDataPayload payload = JsonDataPayload.ok(uri, keywords, loginUser, Post.class);
				payload.setReturnOnlyData(true);
				return payload;
			}
		}
		return JsonErrorPayload.NO_AUTHENTICATION;
	}

}
