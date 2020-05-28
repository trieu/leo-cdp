package leotech.cms.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.vertx.core.json.JsonObject;
import leotech.cms.dao.CategoryDaoUtil;
import leotech.cms.model.Category;
import leotech.system.model.AppMetadata;

public class CategoryDataService {

    // TODO add shared redis cache here

    public static String save(JsonObject paramJson, boolean createNew) {
	String catKey = paramJson.getString("key", "");
	String name = paramJson.getString("name", "");

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
	    catKey = CategoryDaoUtil.save(new Category(name, AppMetadata.DEFAULT_ID));
	} else {
	    Category c = CategoryDaoUtil.getByKey(catKey);
	    c.setName(name);
	    catKey = CategoryDaoUtil.save(c);
	}

	return catKey;
    }

    public static Category getCategory(String key) {
	return CategoryDaoUtil.getByKey(key);
    }

    public static List<Category> getCategoriesByNetwork(long networkId) {
	return CategoryDaoUtil.listAllByNetwork(networkId);
    }
}
