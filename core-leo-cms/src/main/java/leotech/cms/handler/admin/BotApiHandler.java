package leotech.cms.handler.admin;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.model.User;
import leotech.core.api.BaseSecuredDataApi;
import leotech.crawler.model.CrawledYouTubeVideo;
import leotech.crawler.util.ArticleDataCrawler;
import leotech.crawler.util.YouTubeVideoCrawler;
import leotech.system.model.JsonDataPayload;
import rfx.core.util.StringUtil;

public class BotApiHandler extends BaseSecuredDataApi {

    static final String API_VIDEO_CRAWLER = "/bot/video-crawler";
    static final String API_ARTICLE_CRAWLER = "/bot/article-crawler";

    @Override
    public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson) throws Exception {

	return JsonErrorPayload.NO_HANDLER_FOUND;
    }

    @Override
    public JsonDataPayload httpGetApiHandler(String userSession, String uri, MultiMap params) throws Exception {

	User user = getUserFromSession(userSession);
	//if (user != null) 
	{
	    if (uri.equalsIgnoreCase(API_VIDEO_CRAWLER)) {
		String keyword = StringUtil.safeString(params.get("keyword"));
		int maxResultsPerQuery = 25;
		int totalResults = 25;
		List<CrawledYouTubeVideo> results = YouTubeVideoCrawler.query(keyword, maxResultsPerQuery , totalResults);
		return JsonDataPayload.ok(uri, results, true);
	    } else if (uri.equalsIgnoreCase(API_ARTICLE_CRAWLER)) {
		String url = StringUtil.safeString(params.get("url"));
		String extractedHtml = ArticleDataCrawler.process(url);
		return JsonDataPayload.ok(uri, extractedHtml, true);
	    }
	}
	return JsonErrorPayload.NO_AUTHENTICATION;
    }

}
