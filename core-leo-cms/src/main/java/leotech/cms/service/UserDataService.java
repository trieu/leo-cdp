package leotech.cms.service;

import java.util.HashMap;
import java.util.Map;

import io.vertx.core.json.JsonObject;
import leotech.cms.dao.UserDaoUtil;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.User;

public class UserDataService {
    
    // TODO add shared redis cache here

    public static String saveUserInfo(JsonObject paramJson, boolean createNew) {
	String userId = "";
	String userLogin = paramJson.getString("userLogin", "");
	String displayName = paramJson.getString("displayName", "");
	String userPass = paramJson.getString("userPass", "");
	String userEmail = paramJson.getString("userEmail", "");
	int status = paramJson.getInteger("status");
	int role = paramJson.getInteger("role");

	// customData
	JsonObject jsonCustomData = paramJson.getJsonObject("customData", new JsonObject());
	Map<String, String> customData = new HashMap<>(jsonCustomData.size());
	jsonCustomData.forEach(e -> {
	    String key = e.getKey();
	    String val = e.getValue().toString();
	    if (!key.isEmpty()) {
		customData.put(key, val);
	    }
	});

	if (createNew) {
	    User user = new User(userLogin, userPass, displayName, userEmail, MediaNetwork.DEFAULT_ID);
	    user.setRole(role);
	    user.setStatus(status);
	    user.setCustomData(customData);
	    userId = UserDaoUtil.createNew(user);
	} else {
	    User u = UserDaoUtil.getByUserLogin(userLogin);
	    u.setUserEmail(userEmail);
	    u.setDisplayName(displayName);
	    if (!userPass.isEmpty()) {
		u.setUserPass(userPass);
	    }
	    u.setStatus(status);
	    u.setRole(role);
	    u.setCustomData(customData);

	    userId = UserDaoUtil.update(u);
	}

	return userId;
    }
    
    public static User getByUserId(String id) {
	return UserDaoUtil.getByUserId(id);
    }
    
}
