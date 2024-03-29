package leotech.cms.handler.admin;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import leotech.cms.model.bot.ContentBot;
import leotech.crawler.model.ArticleData;
import leotech.crawler.model.CrawledYouTubeVideo;
import leotech.crawler.util.ArticleDataCrawler;
import leotech.crawler.util.YouTubeVideoCrawler;
import leotech.system.common.SecuredWebDataHandler;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.SystemUser;
import rfx.core.util.StringUtil;

public class LeoAssistantBotHandler extends SecuredWebDataHandler {

	static final String API_VIDEO_CRAWLER = "/bot/video-crawler";
	static final String API_ARTICLE_CRAWLER = "/bot/article-crawler";

	@Override
	public JsonDataPayload httpPostApiHandler(String userSession, String uri, JsonObject paramJson)
			throws Exception {

		return JsonErrorPayload.NO_HANDLER_FOUND;
	}

	@Override
	public JsonDataPayload httpGetApiHandler(String userSession, String uri, MultiMap params) throws Exception {

		SystemUser loginUser = getUserFromSession(userSession);
		if (loginUser != null) {
			if (isAuthorized(loginUser, ContentBot.class)) {
				if (uri.equalsIgnoreCase(API_VIDEO_CRAWLER)) {
					String keyword = StringUtil.safeString(params.get("keyword"));
					int maxResultsPerQuery = 25;
					int totalResults = 25;
					List<CrawledYouTubeVideo> results = YouTubeVideoCrawler.query(keyword, maxResultsPerQuery,
							totalResults);
					return JsonDataPayload.ok(uri, results, true);
				} else if (uri.equalsIgnoreCase(API_ARTICLE_CRAWLER)) {
					String url = StringUtil.safeString(params.get("url"));
					ArticleData articleData = ArticleDataCrawler.process(url);
					return JsonDataPayload.ok(uri, articleData, true);
				}
			}
		}
		return JsonErrorPayload.NO_AUTHENTICATION;
}

}
