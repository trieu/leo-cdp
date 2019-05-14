package leotech.cms.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import io.vertx.core.MultiMap;
import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.Category;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.Page;
import leotech.cms.model.Post;
import leotech.cms.model.User;
import leotech.cms.model.renderable.CategoryDataModel;
import leotech.cms.model.renderable.ContentMediaBox;
import leotech.cms.model.renderable.MediaNetworkDataModel;
import leotech.cms.model.renderable.PageDataModel;
import leotech.cms.model.renderable.PageNavigator;
import leotech.cms.model.renderable.PostDataModel;
import leotech.cms.model.renderable.WebDataModel;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.util.seach.SearchPostUtil;
import rfx.core.util.StringUtil;

public class WebDataModelService {

    // URL prefix for common
    static final String HOME = "/";
    static final String HTML_USER = "/html/user/";
    static final String HTML_GROUP = "/html/group/";
    static final String HTML_NETWORK = "/html/network/";
    static final String HTML_CATEGORY = "/html/category/";
    static final String HTML_TOPIC = "/html/topic/";
    static final String HTML_PAGE = "/html/page/";
    static final String HTML_POST = "/html/post/";

    // handler for listing content by speacial filters
    static final String HTML_SEARCH = "/html/search";
    static final String HTML_MY_FAVORITES_LIST = "/html/my-favorites-list";
    static final String HTML_MOST_TRENDING = "/html/most-trending";
    static final String HTML_TOP_POSTS_BY_KEYWORDS = "/html/top-posts-by-keywords";

    // template name
    static final String LIST_NETWORK = "list-network";
    static final String SINGLE_NETWORK = "single-network";
    static final String SINGLE_CATEGORY = "single-category";
    static final String LIST_CATEGORY = "list-category";
    static final String LIST_PAGE = "list-page";
    static final String SINGLE_PAGE = "single-page";
    static final String LIST_POST = "list-post";
    static final String SEARCH_POST = "search-post";
    static final String SINGLE_POST = "single-post";

    public static WebDataModel buildWebDataModel(String path, String networkDomain, MultiMap params, String userSession) {
	MediaNetwork network = MediaNetworkDataService.getContentNetwork(networkDomain);
	String publicContentClass = network.getPublicContentClass();
	String contentCategoryId = network.getContentCategoryId();
	String webTemplateFolder = network.getWebTemplateFolder();

	String objectId;
	WebDataModel model = null;

	// media network
	if (path.startsWith(HTML_NETWORK)) {
	    objectId = path.replace(HTML_NETWORK, "");
	    model = buildMediaNetworkDataModel(network, objectId);
	}
	// media category:
	// https://www.iab.com/guidelines/iab-quality-assurance-guidelines-qag-taxonomy/
	else if (path.startsWith(HTML_CATEGORY)) {
	    objectId = path.replace(HTML_CATEGORY, "");
	    model = buildCategoryDataModel(network, objectId);
	}
	// page/playlist, master node of sorted posts by specific ranking algorithms
	else if (path.startsWith(HTML_PAGE)) {
	    objectId = path.replace(HTML_PAGE, "");
	    int startIndex = StringUtil.safeParseInt(params.get("startIndex"), 0);
	    int numberResult = StringUtil.safeParseInt(params.get("numberResult"), 6);
	    model = buildPageDataModel(path, network, objectId, startIndex, numberResult);
	}
	// post: renderable content for end-user (video, text, slide, images,...)
	else if (path.startsWith(HTML_POST)) {
	    String slug = path.replace(HTML_POST, "");
	    int startIndex = StringUtil.safeParseInt(params.get("startIndex"), 0);
	    int numberResult = StringUtil.safeParseInt(params.get("numberResult"), 9);
	    model = buildPostDataModel(userSession, network, slug, startIndex, numberResult);
	}
	// listing posts by filtering keywords
	else if (path.startsWith(HTML_TOP_POSTS_BY_KEYWORDS)) {

	    int startIndex = StringUtil.safeParseInt(params.get("startIndex"), 0);
	    int numberResult = StringUtil.safeParseInt(params.get("numberResult"), 9);
	    String keywordsStr = StringUtil.safeString(params.get("keywords"), "");
	    String[] keywords;
	    if (!keywordsStr.isEmpty()) {
		keywords = keywordsStr.split(",");
	    } else {
		keywords = new String[] {};
	    }
	    List<Post> posts = PostDaoUtil.listPublicPostsByKeywords(new String[] { contentCategoryId }, publicContentClass, keywords, startIndex, numberResult);
	    String title = " Top posts about \"" + keywordsStr + "\"";
	    if (posts != null) {
		model = new PostDataModel(networkDomain, webTemplateFolder, LIST_POST, title, posts);
		int nextStartIndex = startIndex + numberResult;
		if (posts.size() < numberResult) {
		    nextStartIndex = 0;
		}
		model.setCustomData("nextStartIndex", nextStartIndex);
		model.setPageKeywords(keywordsStr);
	    }
	}
	// searching posts by keywords
	else if (path.startsWith(HTML_SEARCH)) {

	    int startIndex = StringUtil.safeParseInt(params.get("startIndex"), 0);
	    int numberResult = StringUtil.safeParseInt(params.get("numberResult"), 6);
	    String keywordsStr = StringUtil.safeString(params.get("keywords"), "");
	    String[] keywords;
	    if (!keywordsStr.isEmpty()) {
		keywords = keywordsStr.split(",");
	    } else {
		keywords = new String[] {};
	    }
	    List<Post> posts = SearchPostUtil.searchPublicPost(keywords, startIndex, numberResult);
	    String title = keywordsStr + " - Content Search";
	    if (posts != null) {
		model = new PostDataModel(networkDomain, webTemplateFolder, SEARCH_POST, title, posts);
		int nextStartIndex = startIndex + numberResult;
		if (posts.size() < numberResult) {
		    nextStartIndex = 0;
		}
		model.setCustomData("nextStartIndex", nextStartIndex);
		model.setPageKeywords(keywordsStr);
	    }
	}

	// not found 404
	if (model == null) {
	    model = WebDataModel.page404(networkDomain, webTemplateFolder);
	}

	// set data for Top Page
	setPageNavigators(model, contentCategoryId);

	return model;
    }

    public static void setPageNavigators(WebDataModel model, String category) {
	List<PageNavigator> pageNavigators = new ArrayList<>();
	List<Page> topPages = PageDataService.listByCategoryWithPublicPrivacy(category);
	for (Page page : topPages) {
	    String id = page.getId();
	    String uri = HTML_PAGE + page.getSlug();
	    // TODO ranking by use profile here
	    long rankingScore = page.getRankingScore();
	    pageNavigators.add(new PageNavigator(id, uri, page.getTitle(), rankingScore));
	}
	model.setTopPageNavigators(pageNavigators);
    }

    public static WebDataModel buildMediaNetworkDataModel(MediaNetwork network, String objectId) {
	WebDataModel model;
	String networkDomain = network.getDomain();
	String templateFolder = network.getWebTemplateFolder();
	if (StringUtil.isNotEmpty(objectId)) {
	    model = new MediaNetworkDataModel(networkDomain, templateFolder, SINGLE_NETWORK, network.getName());
	} else {
	    model = new MediaNetworkDataModel(networkDomain, templateFolder, LIST_NETWORK, "All networks");
	}
	return model;
    }

    static WebDataModel buildPostDataModel(String userSession, MediaNetwork network, String slug, int startIndex, int numberResult) {
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
		List<String> listKeywords = post.getKeywords();

		String postId = post.getId();
		String title = post.getTitle();
		String des = post.getDescription();
		String pageImage = post.getHeadlineImageUrl();
		String siteName = network.getName();
		String keywords = StringUtil.joinFromList(", ", listKeywords);

		// build model from database object
		model = new PostDataModel(networkDomain, templateFolder, SINGLE_POST, title, post);
		model.setPageDescription(des);
		model.setPageImage(pageImage);
		model.setPageName(siteName);
		model.setPageKeywords(keywords);
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
		return WebDataModel.page404(networkDomain, templateFolder);
	    }
	}
	return model;
    }

    public static WebDataModel buildPageDataModel(String path, MediaNetwork network, String objectId, int startIndex, int numberResult) {
	WebDataModel model;
	String networkDomain = network.getDomain();
	String templateFolder = network.getWebTemplateFolder();
	if (StringUtil.isNotEmpty(objectId)) {
	    Page page = PageDataService.getPageWithPosts(objectId, startIndex, numberResult);
	    if (page != null) {
		String title = page.getTitle() + " - " + page.getTitle();
		System.out.println(page.getPostsOfPage().size() + "=>>>>>>>>>>>>> ### getPageWithPosts " + numberResult);
		model = new PageDataModel(networkDomain, templateFolder, SINGLE_PAGE, title, page);

		int nextStartIndex = startIndex + numberResult;
		if (page.getPostsOfPage().size() < numberResult) {
		    nextStartIndex = 0;
		}
		model.setCustomData("nextStartIndex", nextStartIndex);
		model.setCustomData("currentPath", path);

	    } else {
		model = WebDataModel.page404(networkDomain, templateFolder);
	    }

	} else {
	    String title = network.getName() + " - Top Pages";
	    List<Page> pages = PageDataService.getPagesByNetwork(network.getNetworkId(), startIndex, numberResult);
	    model = new PageDataModel(networkDomain, templateFolder, LIST_PAGE, title, pages);
	    int nextStartIndex = startIndex + numberResult;
	    if (pages.size() < numberResult) {
		nextStartIndex = 0;
	    }
	    model.setCustomData("nextStartIndex", nextStartIndex);
	}
	return model;
    }

    public static WebDataModel buildCategoryDataModel(MediaNetwork network, String objectId) {
	WebDataModel model;
	String networkDomain = network.getDomain();
	String templateFolder = network.getWebTemplateFolder();
	if (StringUtil.isNotEmpty(objectId)) {
	    Category category = CategoryDataService.getCategory(objectId);
	    if (category != null) {
		String title = network.getName() + "-" + category.getName();
		model = new CategoryDataModel(networkDomain, templateFolder, SINGLE_CATEGORY, title, Arrays.asList(category));
	    } else {
		model = WebDataModel.page404(networkDomain, templateFolder);
	    }
	} else {
	    String title = network.getName() + "- All categories";
	    List<Category> cats = CategoryDataService.getCategoriesByNetwork(network.getNetworkId());
	    model = new CategoryDataModel(networkDomain, templateFolder, LIST_CATEGORY, title, cats);
	}
	return model;
    }

    public static WebDataModel buildModel(String host, String tplFolderName, String tplName, MultiMap params, String userSession) {
	MediaNetwork network = MediaNetworkDataService.getContentNetwork(host);
	String categoryId = network.getContentCategoryId();

	WebDataModel model = new WebDataModel(host, tplFolderName, tplName);
	model.setCategoryNavigators(new ArrayList<>(0));

	setPageNavigators(model, categoryId);

	List<ContentMediaBox> contentMediaBoxs = new ArrayList<>();
	model.setContentMediaBoxs(contentMediaBoxs);

	int startIndex = StringUtil.safeParseInt(params.get("startIndex"), 0);
	int numberResult = StringUtil.safeParseInt(params.get("numberResult"), 9);

	List<Post> headlines = PostDaoUtil.listPostsByMediaNetwork(network, false, false, startIndex, numberResult);
	int nextStartIndex = startIndex + numberResult;
	if (headlines.size() < numberResult) {
	    nextStartIndex = 0;
	}
	model.setCustomData("nextStartIndex", nextStartIndex);
	model.setHeadlines(headlines);
	return model;
    }

}
