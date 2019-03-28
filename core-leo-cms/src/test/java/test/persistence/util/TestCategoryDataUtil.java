package test.persistence.util;

import java.util.List;

import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import leotech.cms.dao.CategoryDaoUtil;
import leotech.cms.model.Category;

public class TestCategoryDataUtil {
    static String saveId = "";

    @BeforeTest
    public void setup() {
	System.out.println("setup");
    }

    @AfterTest
    public void clean() {
	System.out.println("clean");
    }

    @Test(priority = 1)
    public void saveOne() {
	Category cat = new Category("test", 10001);
	saveId = CategoryDaoUtil.save(cat);
	System.out.println("CategoryDaoUtil.save " + saveId);
	Assert.assertTrue(saveId != null);
    }

    @Test(priority = 2)
    public void getById() {
	Category cat = CategoryDaoUtil.getByKey(saveId);
	Assert.assertNotNull(cat);
	Assert.assertTrue(cat.getNetworkId() == 10001);
	System.out.println(cat.getName());
    }

    @Test(priority = 3)
    public void saveList() {
	for (int i = 1; i <= 5; i++) {
	    Category page = new Category("category-" + i, 10001);
	    String p = CategoryDaoUtil.save(page);
	    System.out.println("CategoryDaoUtil.save " + p);
	    Assert.assertTrue(p != null);
	}
    }

    @Test(priority = 4)
    public void listByNetwork() {
	List<Category> cats = CategoryDaoUtil.listAllByNetwork(10001);
	Assert.assertTrue(cats.size() > 0);
	for (Category cat : cats) {
	    System.out.println("cats.first " + cat.getName() + " key " + cat.getKey());
	}
    }
}
