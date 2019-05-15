package test.persistence.util;

import java.util.List;

import leotech.cms.service.PostDataService;
import leotech.core.config.DbConfigs;
import leotech.crawler.model.CrawledYouTubeVideo;
import leotech.crawler.util.YouTubeVideoCrawler;
import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.Utils;

public class TestYoutubeCrawler {

    public static void main(String[] args) {
	ArangoDbUtil.setDbConfigs(DbConfigs.load("dbConfigsXemGiDay"));
	
	List<CrawledYouTubeVideo> list = YouTubeVideoCrawler.query("Bruno Mars Marry You", 10, 10);
	String onwerId = "28660";
	String pageId = "10000-b15cc36abd199bd4386c8c7e372dbb0c743282a2";
	String categoryKey = "81758";
	for (CrawledYouTubeVideo video : list) {
	    String savedId = PostDataService.savePostInfo(video, onwerId, pageId, categoryKey);
	    System.out.println(savedId + " - " + video);
	}
	
	Utils.exitSystemAfterTimeout(1000);
    }
}
