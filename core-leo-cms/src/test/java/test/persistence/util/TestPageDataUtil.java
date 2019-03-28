package test.persistence.util;

import java.util.List;

import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import leotech.cms.dao.PageDaoUtil;
import leotech.cms.model.Page;


public class TestPageDataUtil {

    static String pageId = null;
    static String ownerId = "root";
    static String categoryId = "test";

    @BeforeTest
    public void setup() {
	System.out.println("setup");
    }

    @AfterTest
    public void clean() {
	System.out.println("clean");
    }

    @Test(priority=1)
    public void saveOne() {
	Page page = new Page("Viet Nam Market", 10001, categoryId, ownerId);
	pageId = PageDaoUtil.save(page);
	System.out.println("PageDaoUtil.save " + pageId);
	Assert.assertTrue(pageId != null);
    }

    @Test(priority=2)
    public void getById() {
	Page page = PageDaoUtil.getById(pageId);
	Assert.assertNotNull(page);
	Assert.assertTrue(page.getNetworkId() == 10001);
	System.out.println(page.getTitle());
    }

    @Test(priority=3)
    public void saveList() {
	for (int i = 1; i <= 100; i++) {
	    Page page = new Page("page" + i, 100011, categoryId, ownerId);
	    page.setCategoryKey("6984204");
	    String p = PageDaoUtil.save(page);
	    System.out.println("PageDaoUtil.save " + p);
	    Assert.assertTrue(p != null);
	}
    }

    @Test(priority=4)
    public void listByNetwork() {
	List<Page> pages = PageDaoUtil.listByNetwork(10001, 0, 100);
	 System.out.println("pages.first " + pages.get(0).getTitle());
	 System.out.println("pages.last " + pages.get(99).getTitle());
	Assert.assertTrue(pages.size() == 100);
    }

}
