package test.persistence.util;

import java.util.HashMap;
import java.util.List;

import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.Post;
import leotech.cms.model.common.ContentType;
import leotech.system.model.AppMetadata;
import rfx.core.util.StringUtil;

public class TestPostDataUtil {
    static String postId = null;
    static String pageId = null;
    static String ownerId = "admin";

    @BeforeTest
    public void setup() {
	System.out.println("setup");
	pageId = "10000-5d88679c7945f3297d57321109b713d2ac1723ed";
    }

    @AfterTest
    public void clean() {
	System.out.println("clean");
    }

    @Test(priority = 1)
    public void saveNewPost() {
	Post post = new Post("Viet Nam Market", "this is content of post", AppMetadata.DEFAULT_ID, ownerId);
	postId = PostDaoUtil.save(post);
	System.out.println("PostDaoUtil.save " + postId);
	Assert.assertTrue(postId != null);
    }

    @Test(priority = 2)
    public void getById() {
	Post post = PostDaoUtil.getById(postId);
	Assert.assertNotNull(post);
	Assert.assertTrue(post.getNetworkId() == AppMetadata.DEFAULT_ID);
	System.out.println(post.getTitle());
    }

    @Test(priority = 3)
    public void updatePost() {
	Post post = new Post(postId, "Viet Nam Market", "this is updated content of post", AppMetadata.DEFAULT_ID, ownerId);
	post.setPageId(pageId);
	String updatePostId = PostDaoUtil.save(post);
	System.out.println("PostDaoUtil.save " + postId);
	Assert.assertTrue(postId.equals(updatePostId));
    }

    @Test(priority = 4)
    public void listByPage() {

	List<Post> posts = PostDaoUtil.listByPage(pageId, 0, 5);
	for (Post post2 : posts) {
	    System.out.println("PostDaoUtil.listByPage " + post2.getTitle());
	}
	Assert.assertTrue(posts.size() > 0);
    }

    @Test(priority = 5)
    public void addDocumentsPostForPage() {
	List<Post> posts = PostDaoUtil.listByPage(pageId, 0, 50);
	if (posts.size() < 50) {
	    for (int i = 1; i <= 50; i++) {
		Post post = new Post("Document" + i, "/public/uploaded-files/377f14d50d98c550c5569c91582e8c48362e7c40.pdf", AppMetadata.DEFAULT_ID, ownerId);
		post.setPageId(pageId);
		post.setKeyword("document");
		post.setKeyword("test");
		HashMap<String, String> images = new HashMap<String, String>();
		images.put("https://i.gadgets360cdn.com/large/pdf_pixabay_1493877090501.jpg","");
		post.setHeadlineImages(images);
		post.setDescription("dest test");
		post.setPrivacyStatus(1);
		post.setType(ContentType.OFFICE_DOCUMENT);
		String postId = PostDaoUtil.save(post);
		System.out.println("PostDaoUtil.save " + postId);
		Assert.assertTrue(StringUtil.isNotEmpty(postId));
	    }
	}
    }

}
