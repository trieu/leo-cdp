package test.persistence.util;

import java.util.List;

import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.Post;
import leotech.crawler.model.CrawledYouTubeVideo;
import leotech.crawler.util.YouTubeVideoCrawler;

public class RunPostDataUtil {
    public static void main(String[] args) {

	testSaveFromYouTubeCrawler();

	System.exit(1);
    }

    static void testSaveSinglePost() {
	Post p = new Post("Secret Garden Songs", "https://www.youtube.com/embed/PaoPzDW2m2A", 1, "root");

	String id = PostDaoUtil.save(p);
	System.out.println("savepost.id " + id);
    }

    static void testSaveFromYouTubeCrawler() {
	List<CrawledYouTubeVideo> list = YouTubeVideoCrawler.query("Two Steps From Hell");
	for (CrawledYouTubeVideo video : list) {
	    
	    Post p = new Post(video.getTitle(), video.getUrl(), 2, "root");
	    p.setContentClass("YoutubeVideo");
	    
	    String id = PostDaoUtil.save(p);
	    System.out.println(video.getTitle() + " is saved Ok with post.id " + id);
	}
    }
    
    static void testListPosts() {
	List<Post> posts = PostDaoUtil.listByNetwork(1, 0, 10);
	for (Post post : posts) {
	    System.out.println(post.getTitle());
	}
    }
}
