package leotech.cms.handler.delivery;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cdp.utils.ThirdPartyTrackingUtil;
import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.Post;
import leotech.cms.model.renderable.PostDataModel;
import leotech.cms.model.renderable.WebData;
import leotech.cms.service.PostDataService;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.AppMetadata;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.User;
import rfx.core.util.StringUtil;

public class PostApiHandler extends BaseSecuredDataApi {

	static final String URI_GET_POSTS_BY_CONTENT_CLASS = "/post/by-content-class";
	static final String URI_GET_RECENT_POSTS_FROM_PAGE = "/post/recent-from-page";
	static final String URI_GET_POST_INFO = "/post/get-info";
	static final String URI_GET_POSTS_LIST = "/post/get-list";
	static final String URI_GET_POSTS_LIST_BY = "/post/get-list-by";

	public static final String HTML_POST = "/html/post/";
	public static final String SINGLE_POST = "single-post";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson)
			throws Exception {
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
					list = new String[]{};
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
				List<String> contentClasses = Arrays.asList(contentClass);
				
				String keywordStr = StringUtil.safeString(params.get("keywords"), "");

				// filtering all posts must contain all keywords from query
				boolean operatorAnd = StringUtil.safeString(params.get("operator"), "or").equals("and");
				String[] keywords;
				if (!keywordStr.isEmpty()) {
					keywords = keywordStr.split(",");
				} else {
					keywords = new String[]{};
				}
				List<Post> list = PostDaoUtil.listAllByContentClassAndKeywords(null, contentClasses, keywords,
						includeProtected, includePrivate, operatorAnd, 0, 1000);

				// TODO tracking
				// tracking with Google Analytics
				String userIp = StringUtil.safeString(params.get("__userIp"));
				String userAgent = StringUtil.safeString(params.get("__userAgent"));
				String trackingTitle = "landing-page: " + contentClass + "-" + keywordStr;
				ThirdPartyTrackingUtil.pageView(trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);
				ThirdPartyTrackingUtil.event("user-tracking", "username:" + loginUser.getUserLogin(), trackingTitle,
						uri, loginUser.getUserLogin(), userIp, userAgent);

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
					if (postId.isEmpty()) {
						post = PostDaoUtil.getBySlug(slug);
					} else {
						post = PostDaoUtil.getById(postId);
					}

					if (post != null) {

						// tracking with Google Analytics
						String userIp = StringUtil.safeString(params.get("__userIp"));
						String userAgent = StringUtil.safeString(params.get("__userAgent"));
						String trackingTitle = "content-post: " + post.getContentClass() + "-" + post.getTitle();
						ThirdPartyTrackingUtil.pageView(trackingTitle, uri, loginUser.getUserLogin(), userIp,
								userAgent);
						ThirdPartyTrackingUtil.event("user-tracking", "username:" + loginUser.getUserLogin(),
								trackingTitle, uri, loginUser.getUserLogin(), userIp, userAgent);

						return JsonDataPayload.ok(uri, Arrays.asList(post), true);
					} else {
						// TODO tracking

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

	public static WebData buildPostDataModel(String userSession, AppMetadata network, String slug, int startIndex,
			int numberResult) {
		PostDataModel model = null;
		String networkDomain = network.getDomain();
		String templateFolder = network.getWebTemplateFolder();
		if (StringUtil.isNotEmpty(slug)) {
			// CrawledYouTubeVideo video =
			// CrawledYouTubeVideoDaoUtil.getByVideoID(objectId);
			// Post post = new Post(video.getTitle(), video.getUrl(), 0, "");
			Post post = PostDataService.getBySlug(slug);
			if (post != null) {

				List<String> contextPageIds = post.getPageIds();

				String postId = post.getId();
				String title = network.getDomain() + " - " + post.getTitle();
				String des = post.getDescription();
				String pageImage = post.getHeadlineImageUrl();
				String siteName = network.getName();

				// build model from database object
				model = new PostDataModel(networkDomain, templateFolder, SINGLE_POST, title, post);
				model.setBaseStaticUrl(network.getBaseStaticUrl());
				model.setPageDescription(des);
				model.setPageImage(pageImage);
				model.setPageName(siteName);
				model.setPageKeywords(post.getKeywords());
				String pageUrl = model.getBaseStaticUrl() + HTML_POST + slug;
				model.setPageUrl(pageUrl);
				model.setContextPageId(contextPageIds.size() > 0 ? contextPageIds.get(0) : "");

				// TODO implement recommendation engine here
				List<Post> simlilarPosts = PostDataService.getSimilarPosts(contextPageIds, postId);
				model.setRecommendedPosts(simlilarPosts);
				User user = BaseSecuredDataApi.getUserFromSession(userSession);
				if (user != null) {
					model.setAdminRole(BaseSecuredDataApi.isAdminRole(user));
					model.setSessionUserId(user.getKey());
				}
			} else {
				return WebData.page404(networkDomain, templateFolder);
			}
		}
		return model;
	}

}
