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
import leotech.cms.model.renderable.CategoryDataModel;
import leotech.cms.model.renderable.ContentMediaBox;
import leotech.cms.model.renderable.MediaNetworkDataModel;
import leotech.cms.model.renderable.PageDataModel;
import leotech.cms.model.renderable.PageNavigator;
import leotech.cms.model.renderable.PostDataModel;
import leotech.cms.model.renderable.WebPageDataModel;
import rfx.core.util.StringUtil;

public class WebPageDataModelService {

    // URL prefix for common 
    static final String HOME = "/";
    static final String HTML_USER = "/html/user/";
    static final String HTML_GROUP = "/html/group/";
    static final String HTML_NETWORK = "/html/network/";
    static final String HTML_CATEGORY = "/html/category/";
    static final String HTML_TOPIC = "/html/topic/";
    static final String HTML_PAGE = "/html/page/";
    static final String HTML_POST = "/html/post/";
    
    //handler for listing content by speacial filters
    static final String HTML_SEARCH = "/html/search/";
    static final String HTML_MOST_FAVORITE = "/html/most-favorite/";
    static final String HTML_MOST_TRENDING = "/html/most-trending/";
    static final String HTML_MUSIC_PLAYLIST = "/html/music-playlist/";

    // template name
    static final String LIST_NETWORK = "list-network";
    static final String SINGLE_NETWORK = "single-network";
    static final String SINGLE_CATEGORY = "single-category";
    static final String LIST_CATEGORY = "list-category";
    static final String LIST_PAGE = "list-page";
    static final String SINGLE_PAGE = "single-page";
    static final String LIST_POST = "list-post";
    static final String SINGLE_POST = "single-post";

    public static WebPageDataModel buildModel( String path, String networkDomain, MultiMap params) {
	MediaNetwork network = MediaNetworkDataService.getContentNetwork(networkDomain);
	long networkId = network.getNetworkId();
	String templateFolder = network.getWebTemplateFolder();
	String objectId;
	WebPageDataModel model = null;

	// home page, the genesis network (root network of all networks)
	if (path.equals(HOME)) {
	    model = new WebPageDataModel(networkDomain, templateFolder, "index", "");
	}
	// media network
	else if (path.startsWith(HTML_NETWORK)) {
	    objectId = path.replace(HTML_NETWORK, "");
	    model = buildMediaNetworkDataModel(networkDomain, network, templateFolder, objectId);
	}
	// media category:
	// https://www.iab.com/guidelines/iab-quality-assurance-guidelines-qag-taxonomy/
	else if (path.startsWith(HTML_CATEGORY)) {
	    objectId = path.replace(HTML_CATEGORY, "");
	    model = buildCategoryDataModel(networkDomain, network, networkId, templateFolder, objectId);
	}
	// page/playlist, master node of sorted posts by specific ranking algorithms
	else if (path.startsWith(HTML_PAGE)) {
	    objectId = path.replace(HTML_PAGE, "");
	    int startIndex = StringUtil.safeParseInt(params.get("startIndex"), 0);
	    int numberResult = StringUtil.safeParseInt(params.get("numberResult"), 6);
	    model = buildPageDataModel(path, networkDomain, network, networkId, templateFolder, objectId, startIndex, numberResult);
	}
	// post: renderable content for end-user (video, text, slide, images,...)
	else if (path.startsWith(HTML_POST)) {
	    String slug = path.replace(HTML_POST, "");
	    int startIndex = StringUtil.safeParseInt(params.get("startIndex"), 0);
	    int numberResult = StringUtil.safeParseInt(params.get("numberResult"), 9);
	    model = buildPostDataModel(networkDomain, network, networkId, templateFolder, slug, startIndex, numberResult);
	}
	// not found 404 
	if (model == null) {
	    model = WebPageDataModel.page404(networkDomain, templateFolder);
	}

	// set data for Top Page
	String category = "81758";// TODO
	setPageNavigators(model, category);

	return model;
    }

    public static void setPageNavigators(WebPageDataModel model, String category) {
	List<PageNavigator> pageNavigators = new ArrayList<>();
	List<Page> topPages = PageDataService.listByCategoryWithPublicPrivacy(category);
	for (Page page : topPages) {
	    pageNavigators.add(new PageNavigator("/html/page/" + page.getSlug(), page.getTitle(), page.getRankingScore()));
	}
	model.setTopPageNavigators(pageNavigators);
    }

    public static WebPageDataModel buildMediaNetworkDataModel(String networkDomain, MediaNetwork network, String templateFolder, String objectId) {
	WebPageDataModel model;
	if (StringUtil.isNotEmpty(objectId)) {
	    model = new MediaNetworkDataModel(networkDomain, templateFolder, SINGLE_NETWORK, network.getName());
	} else {
	    model = new MediaNetworkDataModel(networkDomain, templateFolder, LIST_NETWORK, "All networks");
	}
	return model;
    }

    public static WebPageDataModel buildPostDataModel(String networkDomain, MediaNetwork network, long networkId, String templateFolder, String slug, int startIndex,
	    int numberResult) {
	PostDataModel model;
	if (StringUtil.isNotEmpty(slug)) {
	    // CrawledYouTubeVideo video =
	    // CrawledYouTubeVideoDaoUtil.getByVideoID(objectId);
	    // Post post = new Post(video.getTitle(), video.getUrl(), 0, "");
	    Post post = PostDataService.getBySlug(slug);
	    if (post != null) {
		// FIXME refactoring this code, FUCK

		List<String> contextPageIds = post.getPageIds();
		List<String> listKeywords = post.getKeywords();

		String postId = post.getId();
		String title = post.getTitle();
		String des = post.getDescription();
		String pageImage = post.getHeadlineImageUrl();
		String siteName = network.getName();
		String keywords = StringUtil.joinFromList(", ", listKeywords);

		model = new PostDataModel(networkDomain, templateFolder, SINGLE_POST, title, post);
		model.setPageDescription(des);
		model.setPageImage(pageImage);
		model.setPageName(siteName);
		model.setPageKeywords(keywords);
		String pageUrl = model.getBaseStaticUrl() + HTML_POST + slug;
		model.setPageUrl(pageUrl);

		// TODO more abstract here for multipe ranking
		List<Post> simlilarPosts = PostDataService.getSimilarPosts(contextPageIds, postId);
		model.setRecommendedPosts(simlilarPosts);

	    } else {
		return WebPageDataModel.page404(networkDomain, templateFolder);
	    }

	} else {
	    List<Post> posts = PostDaoUtil.listByNetwork(networkId, startIndex, numberResult);
	    String title = network.getName() + " - Top Posts";
	    model = new PostDataModel(networkDomain, templateFolder, LIST_POST, title, posts);
	    int nextStartIndex = startIndex + numberResult;
	    if (posts.size() < numberResult) {
		nextStartIndex = 0;
	    }
	    model.setCustomData("nextStartIndex", nextStartIndex);
	}
	return model;
    }

    public static WebPageDataModel buildPageDataModel(String path, String networkDomain, MediaNetwork network, long networkId, String templateFolder, String objectId,
	    int startIndex, int numberResult) {
	WebPageDataModel model;
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
		model = WebPageDataModel.page404(networkDomain, templateFolder);
	    }

	} else {
	    String title = network.getName() + " - Top Pages";
	    List<Page> pages = PageDataService.getPagesByNetwork(networkId, startIndex, numberResult);
	    model = new PageDataModel(networkDomain, templateFolder, LIST_PAGE, title, pages);
	    int nextStartIndex = startIndex + numberResult;
	    if (pages.size() < numberResult) {
		nextStartIndex = 0;
	    }
	    model.setCustomData("nextStartIndex", nextStartIndex);
	}
	return model;
    }

    public static WebPageDataModel buildCategoryDataModel(String networkDomain, MediaNetwork network, long networkId, String templateFolder, String objectId) {
	WebPageDataModel model;
	if (StringUtil.isNotEmpty(objectId)) {
	    Category category = CategoryDataService.getCategory(objectId);
	    if (category != null) {
		String title = network.getName() + "-" + category.getName();
		model = new CategoryDataModel(networkDomain, templateFolder, SINGLE_CATEGORY, title, Arrays.asList(category));
	    } else {
		model = WebPageDataModel.page404(networkDomain, templateFolder);
	    }
	} else {
	    String title = network.getName() + "- All categories";
	    List<Category> cats = CategoryDataService.getCategoriesByNetwork(networkId);
	    model = new CategoryDataModel(networkDomain, templateFolder, LIST_CATEGORY, title, cats);
	}
	return model;
    }

    public static WebPageDataModel buildModel(String host, String tplFolderName, String tplName, MultiMap params) {

	// TODO mapping from host to category and content class
	String contentClass = "standard";
	String category = "81758";

	WebPageDataModel model = new WebPageDataModel(host, tplFolderName, tplName);
	model.setCategoryNavigators(new ArrayList<>(0));

	setPageNavigators(model, category);

	List<ContentMediaBox> contentMediaBoxs = new ArrayList<>();
	model.setContentMediaBoxs(contentMediaBoxs);

	int startIndex = StringUtil.safeParseInt(params.get("startIndex"), 0);
	int numberResult = StringUtil.safeParseInt(params.get("numberResult"), 9);

	List<Post> headlines = PostDaoUtil.listAllByContentClass(contentClass, false, false, startIndex, numberResult);
	int nextStartIndex = startIndex + numberResult;
	if (headlines.size() < numberResult) {
	    nextStartIndex = 0;
	}
	model.setCustomData("nextStartIndex", nextStartIndex);

	System.out.println("headlines " + headlines.size());

	model.setHeadlines(headlines);

	return model;
    }

}
