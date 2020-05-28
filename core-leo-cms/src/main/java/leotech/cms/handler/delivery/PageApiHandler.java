package leotech.cms.handler.delivery;

import java.util.ArrayList;
import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.dao.PageDaoUtil;
import leotech.cms.model.Page;
import leotech.cms.model.renderable.PageDataModel;
import leotech.cms.model.renderable.PageNavigator;
import leotech.cms.model.renderable.WebData;
import leotech.cms.service.PageDataService;
import leotech.core.api.BaseSecuredDataApi;
import leotech.system.model.AppMetadata;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.User;
import rfx.core.util.StringUtil;

public class PageApiHandler extends BaseSecuredDataApi {

    static final String API_PAGE_LIST_BY_CATEGORY = "/page/list-by-category";
    static final String API_PAGE_LIST_BY_KEYWORD = "/page/list-by-keyword";

    public static final String HTML_PAGE = "/html/page/";
    public static final String SINGLE_PAGE = "single-page";
    public static final String LIST_PAGE = "list-page";

    @Override
    public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {
	User loginUser = getUserFromSession(userSession);
	if (loginUser == null) {
	    return JsonErrorPayload.NO_AUTHENTICATION;
	} else {
	    if (uri.equalsIgnoreCase(API_PAGE_LIST_BY_CATEGORY)) {
		String catId = paramJson.getString("categoryId", "");
		if (catId.isEmpty()) {
		    return JsonDataPayload.fail("categoryId is empty", 500);
		} else {
		    List<Page> pages = PageDaoUtil.listByCategory(catId);
		    return JsonDataPayload.ok(uri, pages);
		}
	    }
	    return JsonErrorPayload.NO_HANDLER_FOUND;
	}

    }

    @Override
    public JsonDataPayload httpGetApiHandler(String userSession, String uri, MultiMap params) throws Exception {
	User loginUser = getUserFromSession(userSession);
	if (loginUser == null) {
	    return JsonErrorPayload.NO_AUTHENTICATION;
	} else {
	    if (uri.equalsIgnoreCase(API_PAGE_LIST_BY_CATEGORY)) {
		String catId = StringUtil.safeString(params.get("categoryId"), "");
		if (catId.isEmpty()) {
		    return JsonDataPayload.fail("categoryId is empty", 500);
		} else {
		    List<Page> pages = PageDaoUtil.listByCategory(catId);
		    return JsonDataPayload.ok(uri, pages);
		}
	    }
	    return JsonErrorPayload.NO_HANDLER_FOUND;
	}
    }

    public static WebData buildPageDataModel(String path, AppMetadata network, String objectId, int startIndex,
	    int numberResult) {
	WebData model;
	String networkDomain = network.getDomain();
	String templateFolder = network.getWebTemplateFolder();
	if (StringUtil.isNotEmpty(objectId)) {
	    Page page = PageDataService.getPageWithPosts(objectId, startIndex, numberResult);
	    if (page != null) {
		String title = network.getDomain() + " - " + page.getTitle();
		System.out.println(page.getPostsOfPage().size() + "=>>>>>>>>>>>>> ### getPageWithPosts " + numberResult);
		
		model = new PageDataModel(networkDomain, templateFolder, SINGLE_PAGE, title, page);
		model.setBaseStaticUrl(network.getBaseStaticUrl());
   		model.setPageDescription(page.getDescription());
   		model.setPageKeywords(page.getKeywords());

		int nextStartIndex = startIndex + numberResult;
		if (page.getPostsOfPage().size() < numberResult) {
		    nextStartIndex = 0;
		}
		model.setCustomData("nextStartIndex", nextStartIndex);
		model.setCustomData("currentPath", path);

	    } else {
		model = WebData.page404(networkDomain, templateFolder);
	    }

	} else {
	    String title = network.getName() + " - Top Pages";
	    List<Page> pages = PageDataService.getPagesByNetwork(network.getAppId(), startIndex, numberResult);
	    model = new PageDataModel(networkDomain, templateFolder, LIST_PAGE, title, pages);
	    model.setBaseStaticUrl(network.getBaseStaticUrl());
		
	    int nextStartIndex = startIndex + numberResult;
	    if (pages.size() < numberResult) {
		nextStartIndex = 0;
	    }
	    model.setCustomData("nextStartIndex", nextStartIndex);
	}
	return model;
    }

    public static void setPageNavigators(WebData model, String category) {
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

}
