package leotech.crawler.model;

import java.util.List;

import leotech.cms.model.bot.ContentBot;
import leotech.crawler.dao.CrawledYouTubeVideoDaoUtil;
import leotech.crawler.util.YouTubeVideoCrawler;
import rfx.core.util.StringUtil;

public class YouTubeContentBot extends ContentBot {

	String videoID = "";
	String keyword = "";
	String channelId = null;
	int maxResultsPerQuery = 45;
	int totalResults = 90;

	public YouTubeContentBot(String keyword) {
		super();
		this.keyword = keyword;
	}

	public YouTubeContentBot(String keyword, String channelId) {
		super();
		this.keyword = keyword;
		this.channelId = channelId;
	}

	public YouTubeContentBot(String keyword, String channelId, int maxResultsPerQuery, int totalResults) {
		super();
		this.keyword = keyword;
		this.channelId = channelId;
		this.maxResultsPerQuery = maxResultsPerQuery;
		this.totalResults = totalResults;
	}

	public static void doCrawlingByKeywordAndSaveDb(String keyword, int maxResultsPerQuery, int totalResults,
			String channelId) {
		List<CrawledYouTubeVideo> results = YouTubeVideoCrawler.query(keyword, maxResultsPerQuery, totalResults,
				channelId);
		for (CrawledYouTubeVideo crawledVideo : results) {
			crawledVideo.getSocialStatistics().computeDefaultScore();
			String id = CrawledYouTubeVideoDaoUtil.save(crawledVideo);
			System.out.println("Save ID" + id + " " + crawledVideo.getTitle());
		}
	}

	public static void doCrawlingSingleVideoAndSaveDb(String videoID) {
		CrawledYouTubeVideo crawledVideo = YouTubeVideoCrawler.get(videoID);
		if (crawledVideo != null) {
			crawledVideo.getSocialStatistics().computeDefaultScore();
			CrawledYouTubeVideoDaoUtil.save(crawledVideo);
		}
	}

	@Override
	public void process() {
		if (StringUtil.isNotEmpty(keyword)) {
			doCrawlingByKeywordAndSaveDb(keyword, maxResultsPerQuery, totalResults, channelId);
		} else if (StringUtil.isNotEmpty(videoID)) {
			doCrawlingSingleVideoAndSaveDb(videoID);
		} else {
			System.err.println("keyword is empty or videoID is empty");
		}

	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public String getChannelId() {
		return channelId;
	}

	public void setChannelId(String channelId) {
		this.channelId = channelId;
	}

	public int getMaxResultsPerQuery() {
		return maxResultsPerQuery;
	}

	public void setMaxResultsPerQuery(int maxResultsPerQuery) {
		this.maxResultsPerQuery = maxResultsPerQuery;
	}

	public int getTotalResults() {
		return totalResults;
	}

	public void setTotalResults(int totalResults) {
		this.totalResults = totalResults;
	}

}
