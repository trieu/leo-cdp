package test.persistence.util;

import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.Post;
import rfx.core.util.Utils;

public class SetupBlogpostData {

    public static void main(String[] args) {
	for (int i = 1; i <= 30; i++) {
	    String title = "blog-post " + i;

	    String mediaInfo = "Enim labore aliqua consequat ut quis ad occaecat aliquip incididunt. Sunt nulla eu enim irure\n"
		    + " enim nostrud aliqua consectetur ad consectetur sunt ullamco officia. Ex officia laborum et consequat duis.";
	    String ownerId = "cms_admin";
	    Post p = new Post(title, mediaInfo, MediaNetwork.DEFAULT_ID, ownerId);
	    String pageId = "10000-3306fd34cfd8552c651eec0e09cb5b8a94608bea";
	    p.setPageId(pageId);
	    p.setContentClass("blogpost");
	    p.setHeadlineImageUrl("https://i.ytimg.com/vi/FAJbEQJpIKA/maxresdefault.jpg");
	    p.setHeadlineVideoUrl("https://www.youtube.com/watch?v=Bks_979nx5E");
	    p.setKeyword("sample_post");
	   

	    String id = PostDaoUtil.save(p);
	    System.out.println(" is saved Ok with post.id " + id);
	}

	Utils.exitSystemAfterTimeout(5000);
    }
}
