package test.persistence.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import leotech.cms.dao.ContentQueryDaoUtil;
import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.Page;
import leotech.cms.model.Post;
import leotech.system.model.JsonDataPayload;
import leotech.system.util.CmsLogUtil;

public class TestSearchAndQueryContent {
    @BeforeTest
    public void setup() {
	System.out.println("setup");
    }

    @AfterTest
    public void clean() {
	System.out.println("clean");
    }

    // @Test(priority = 1)
    public void listPagesByKeywords() {
	String[] keywords = "vietnam, steel market".split(",");
	List<Page> pages = ContentQueryDaoUtil.listPagesByKeywords(keywords, true, false, true);
	for (Page p : pages) {
	    System.out.println(p.getTitle());
	    System.out.println(p.getTitle());
	}
	Assert.assertTrue(pages.size() > 0);
    }

    @Test(priority = 2)
    public void listPostsByCategoriesAndKeywords() {

	String[] defCategoryKeys = new String[] { "1329181", "1329376", "1329482" };
	String[] keywords = new String[] {};
	Map<String, List<Post>> results = ContentQueryDaoUtil.listPostsByCategoriesAndKeywords(defCategoryKeys, keywords, true, true, true);

	Set<String> catSlugs = results.keySet();

	for (String catSlug : catSlugs) {
	    List<Post> posts = results.get(catSlug);
	    for (Post p : posts) {
		// System.out.println(catSlug + " => " + p.getTitle());
	    }
	}

	Assert.assertTrue(results.size() > 0);
    }

    public static void main(String[] args) {
		
	System.out.println(PostDaoUtil.checkLimitOfLicense());
	testQueryPostsForHomepage();
    }

    protected static void testGetAllKeywords() {
	List<String> list = PostDaoUtil.getAllKeywords();
	List<Map<String, String>> keywords = list.stream().map(e -> {
	   Map<String, String> map = new HashMap<>(1);
	   map.put("name", e);
	   return map;
	}).collect(Collectors.toList());
	JsonDataPayload payload = JsonDataPayload.ok("", keywords, false);
	payload.setReturnOnlyData(true);
	System.out.println(payload.toString());
    }

    public static void testQueryPostsForHomepage() {
	CmsLogUtil.setLogLevelToInfo();
	// new TestSearchAndQueryContent().listPostsByCategoriesAndKeywords();
	Map<String, Object> map = PostDaoUtil.getPostsOfDefaultHomepage();
	System.out.println(JsonDataPayload.ok("", map));
	rfx.core.util.Utils.exitSystemAfterTimeout(1000);
    }

}
