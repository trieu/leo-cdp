package test.persistence.bluescope;

import org.testng.Assert;

import leotech.cms.dao.UserDaoUtil;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.User;

public class NewUser {

    public static void main(String[] args) {
	String userLogin = "demo";
	User user = new User(userLogin, "123456", userLogin, "tester@example.com", MediaNetwork.DEFAULT_ID);
	String userId = UserDaoUtil.createNew(user);
	System.out.println("UserDaoUtil.save " + userId);
	Assert.assertTrue(userId != null);

	
	boolean ok = UserDaoUtil.activateAsStandarUser(userLogin);
	System.out.println(ok);
    }
}