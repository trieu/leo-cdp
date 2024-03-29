package test.persistence.util;

import java.util.List;

import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import leotech.cms.dao.UserDaoUtil;
import leotech.system.model.AppMetadata;
import leotech.system.model.SystemUser;

public class TestUserDataUtil {
    private static final String PASS = "qazxsw";
    private static final String USERLOGIN = "admin";
    static String userId = null;

    @BeforeTest
    public void setup() {
	System.out.println("setup");

    }

    @AfterTest
    public void clean() {
	System.out.println("clean");
	// boolean ok = !UserDaoUtil.deleteByUserLogin(USERLOGIN).isEmpty();
	// System.out.println("SETUP NEW TEST, clear data by deleteByUserLogin OK: " +
	// ok);
    }

     @Test(priority = 1)
    public void saveNewUserAndActivate() {
	SystemUser user = new SystemUser(USERLOGIN, PASS, USERLOGIN, "tantrieuf31@gmail.com",  AppMetadata.DEFAULT_ID);
	userId = UserDaoUtil.createNew(user);
	System.out.println("UserDaoUtil.save " + userId);
	Assert.assertTrue(userId != null);

	boolean ok = UserDaoUtil.activateAsSuperAdmin(user.getUserLogin());
	Assert.assertTrue(ok);	
	
    }

     @Test(priority = 2)
    public void checkLogin() {
	boolean ok = UserDaoUtil.checkLogin(USERLOGIN, PASS);
	System.out.println("UserDaoUtil.checkLogin " + USERLOGIN);
	Assert.assertTrue(ok);
    }
   

    @Test(priority = 3)
    public void saveNew10UsersAndActivate() {
	for (int i = 1; i <= 10; i++) {
	    String displayName = "Name Tester number:" + i;
	    String userLogin = "tester" + i;
	    SystemUser user = new SystemUser(userLogin, "123456", displayName, userLogin + "@example.com", AppMetadata.DEFAULT_ID);
	    userId = UserDaoUtil.createNew(user);
	    System.out.println("UserDaoUtil.save " + userId);
	    Assert.assertTrue(userId != null);

	    boolean ok = UserDaoUtil.activateAsGuest(userLogin);
	    Assert.assertTrue(ok);
	}
    }
    
    @Test(priority = 4)
    public void getAllUsersInNetwork() {
	List<SystemUser> users = UserDaoUtil.listAllUsersInNetwork(AppMetadata.DEFAULT_ID);
	Assert.assertTrue(users.size() >= 10);
	for (SystemUser user : users) {
	    System.out.println("listAllUsersInNetwork.user " + user.getUserLogin());
	}
    }
    
    // @Test(priority = 5)
    public void deactivateUser() {
	boolean ok = UserDaoUtil.deactivate(USERLOGIN);
	System.out.println("UserDaoUtil.deactivate " + USERLOGIN);
	Assert.assertTrue(ok);

	boolean mustBeFalse = !UserDaoUtil.checkLogin(USERLOGIN, "123456");
	Assert.assertTrue(mustBeFalse);
    }

}
