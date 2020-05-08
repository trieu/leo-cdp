package leotech.cms.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import io.vertx.core.MultiMap;
import leotech.cms.dao.PostDaoUtil;
import leotech.cms.handler.delivery.PageApiHandler;
import leotech.cms.handler.delivery.PostApiHandler;
import leotech.cms.model.Category;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.Post;
import leotech.cms.model.renderable.CategoryDataModel;
import leotech.cms.model.renderable.ContentMediaBox;
import leotech.cms.model.renderable.MediaNetworkDataModel;
import leotech.cms.model.renderable.PostDataModel;
import leotech.cms.model.renderable.WebData;
import leotech.cms.query.SearchPostUtil;
import rfx.core.util.StringUtil;

public class WebDataServiceUtil {

	// URL prefix for common
	static final String HOME = "/";
	static final String HTML_USER = "/html/user/";
	static final String HTML_GROUP = "/html/group/";
	static final String HTML_NETWORK = "/html/network/";
	static final String HTML_CATEGORY = "/html/category/";
	static final String HTML_TOPIC = "/html/topic/";

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

	static final String LIST_POST = "list-post";
	static final String SEARCH_POST = "search-post";

	static final int NUMBER_RESULTS = 6;

	public static WebData build(String path, String networkDomain, MultiMap params, String userSession) {
		MediaNetwork network = MediaNetworkDataService.getContentNetwork(networkDomain);
		String publicContentClass = network.getPublicContentClass();
		String contentCategoryId = network.getContentCategoryId();
		String webTemplateFolder = network.getWebTemplateFolder();

		String objectId;
		WebData model = null;

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
		// page/playlist, master node of sorted posts by specific ranking
		// algorithms
		else if (path.startsWith(PageApiHandler.HTML_PAGE)) {
			objectId = path.replace(PageApiHandler.HTML_PAGE, "");
			int startIndex = StringUtil.safeParseInt(params.get("startIndex"), 0);
			int numberResult = StringUtil.safeParseInt(params.get("numberResult"), NUMBER_RESULTS);
			model = PageApiHandler.buildPageDataModel(path, network, objectId, startIndex, numberResult);
		}
		// post: render content for end-user (video, text, slide, images,...)
		else if (path.startsWith(PostApiHandler.HTML_POST)) {
			String slug = path.replace(PostApiHandler.HTML_POST, "");
			int startIndex = StringUtil.safeParseInt(params.get("startIndex"), 0);
			int numberResult = StringUtil.safeParseInt(params.get("numberResult"), NUMBER_RESULTS);
			model = PostApiHandler.buildPostDataModel(userSession, network, slug, startIndex, numberResult);
		}
		// listing posts by filtering keywords
		else if (path.startsWith(HTML_TOP_POSTS_BY_KEYWORDS)) {

			int startIndex = StringUtil.safeParseInt(params.get("startIndex"), 0);
			int numberResult = StringUtil.safeParseInt(params.get("numberResult"), NUMBER_RESULTS);
			String keywordsStr = StringUtil.safeString(params.get("keywords"), "");
			String[] keywords;
			if (!keywordsStr.isEmpty()) {
				keywords = keywordsStr.split(",");
			} else {
				keywords = new String[]{};
			}
			List<Post> posts = PostDaoUtil.listPublicPostsByKeywords(new String[]{contentCategoryId},
					publicContentClass, keywords, startIndex, numberResult);
			String title = " Top posts about \"" + keywordsStr + "\"";
			if (posts != null) {
				model = new PostDataModel(networkDomain, webTemplateFolder, LIST_POST, title, posts);
				int prevStartIndex = startIndex - numberResult;
				int nextStartIndex = startIndex + numberResult;
				if (prevStartIndex < 0) {
					prevStartIndex = 0;
				}
				if (posts.size() < numberResult) {
					nextStartIndex = 0;
				}
				model.setCustomData("prevStartIndex", prevStartIndex);
				model.setCustomData("nextStartIndex", nextStartIndex);
				model.setPageKeywords(keywordsStr);
			}
		}
		// searching posts by keywords
		else if (path.startsWith(HTML_SEARCH)) {

			int startIndex = StringUtil.safeParseInt(params.get("startIndex"), 0);
			int numberResult = StringUtil.safeParseInt(params.get("numberResult"), NUMBER_RESULTS);
			String keywordsStr = StringUtil.safeString(params.get("keywords"), "");
			String[] keywords;
			if (!keywordsStr.isEmpty()) {
				keywords = keywordsStr.split(",");
			} else {
				keywords = new String[]{};
			}
			List<Post> posts = SearchPostUtil.searchPublicPost(keywords, startIndex, numberResult);
			String title = keywordsStr + " - Content Search";
			if (posts != null) {
				model = new PostDataModel(networkDomain, webTemplateFolder, SEARCH_POST, title, posts);
				int prevStartIndex = startIndex - numberResult;
				int nextStartIndex = startIndex + numberResult;
				if (prevStartIndex < 0) {
					prevStartIndex = 0;
				}
				if (posts.size() < numberResult) {
					nextStartIndex = 0;
				}
				model.setCustomData("prevStartIndex", prevStartIndex);
				model.setCustomData("nextStartIndex", nextStartIndex);
				model.setPageKeywords(keywordsStr);
			}
		}

		// not found 404
		if (model == null) {
			model = WebData.page404(networkDomain, webTemplateFolder);
		}

		// set data for Top Page
		PageApiHandler.setPageNavigators(model, contentCategoryId);

		return model;
	}

	public static WebData buildMediaNetworkDataModel(MediaNetwork network, String objectId) {
		WebData model;
		String networkDomain = network.getDomain();
		String templateFolder = network.getWebTemplateFolder();
		if (StringUtil.isNotEmpty(objectId)) {
			model = new MediaNetworkDataModel(networkDomain, templateFolder, SINGLE_NETWORK, network.getName());
		} else {
			model = new MediaNetworkDataModel(networkDomain, templateFolder, LIST_NETWORK, "All networks");
		}
		return model;
	}

	public static WebData buildCategoryDataModel(MediaNetwork network, String objectId) {
		WebData model;
		String networkDomain = network.getDomain();
		String templateFolder = network.getWebTemplateFolder();
		if (StringUtil.isNotEmpty(objectId)) {
			Category category = CategoryDataService.getCategory(objectId);
			if (category != null) {
				String title = network.getName() + "-" + category.getName();
				model = new CategoryDataModel(networkDomain, templateFolder, SINGLE_CATEGORY, title,
						Arrays.asList(category));
			} else {
				model = WebData.page404(networkDomain, templateFolder);
			}
		} else {
			String title = network.getName() + "- All categories";
			List<Category> cats = CategoryDataService.getCategoriesByNetwork(network.getNetworkId());
			model = new CategoryDataModel(networkDomain, templateFolder, LIST_CATEGORY, title, cats);
		}
		return model;
	}

	public static WebData buildModel(String host, String tplFolderName, String tplName, MultiMap params,
			String userSession) {
		MediaNetwork network = MediaNetworkDataService.getContentNetwork(host);
		String categoryId = network.getContentCategoryId();

		WebData model = new WebData(host, tplFolderName, tplName);
		model.setCategoryNavigators(new ArrayList<>(0));

		PageApiHandler.setPageNavigators(model, categoryId);

		List<ContentMediaBox> contentMediaBoxs = new ArrayList<>();
		model.setContentMediaBoxs(contentMediaBoxs);

		int startIndex = StringUtil.safeParseInt(params.get("startIndex"), 0);
		int numberResult = StringUtil.safeParseInt(params.get("numberResult"), NUMBER_RESULTS);

		List<Post> headlines = PostDaoUtil.listPostsByMediaNetwork(network, false, false, startIndex, numberResult);
		int prevStartIndex = startIndex - numberResult;
		int nextStartIndex = startIndex + numberResult;
		if (prevStartIndex < 0) {
			prevStartIndex = 0;
		}
		if (headlines.size() < numberResult) {
			nextStartIndex = 0;
		}
		model.setCustomData("prevStartIndex", prevStartIndex);
		model.setCustomData("nextStartIndex", nextStartIndex);
		model.setHeadlines(headlines);
		return model;
	}

}
