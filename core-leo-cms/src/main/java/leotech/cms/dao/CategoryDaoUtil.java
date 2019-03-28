package leotech.cms.dao;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cms.model.Category;
import leotech.cms.model.User;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class CategoryDaoUtil {

    private static final String AQL_FIND_KEY_BY_SLUG = AqlTemplate.get("AQL_FIND_KEY_BY_SLUG");
    static final String AQL_GET_CATEGORY_BY_KEY = AqlTemplate.get("AQL_GET_CATEGORY_BY_KEY");
    static final String AQL_GET_ALL_CATEGORIES_BY_NETWORK = AqlTemplate.get("AQL_GET_ALL_CATEGORIES_BY_NETWORK");

    public static String save(Category category) {
	if (category.isReadyForSave()) {
	    ArangoCollection col = category.getCollection();
	    if (col != null) {
		String _key = ArangoDbUtil.findKey(AQL_FIND_KEY_BY_SLUG, "slug", category.getSlug());
		// System.out.println("AQL_FIND_KEY_BY_SLUG _key " + _key);
		if (_key == null) {
		    _key = col.insertDocument(category).getKey();
		} else {
		    category.setModificationTime(System.currentTimeMillis());
		    col.updateDocument(_key, category);
		}
		category.setKey(_key);
		return _key;
	    }
	}
	return null;
    }

    public static Category getByKey(String key) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(1);
	bindVars.put("_key", key);
	Category cat = new ArangoDbQuery<Category>(db, AQL_GET_CATEGORY_BY_KEY, bindVars, Category.class).getResultsAsObject();
	return cat;
    }
    
    public static String deleteByKey(String key) {
  	ArangoCollection col = new Category().getCollection();
  	if (col != null) {
  	    col.deleteDocument(key);
  	    return key;
  	}
  	return "";
      }

    public static List<Category> listAllByNetwork(long networkId) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(1);
	bindVars.put("networkId", networkId);
	List<Category> list = new ArangoDbQuery<Category>(db, AQL_GET_ALL_CATEGORIES_BY_NETWORK, bindVars, Category.class).getResultsAsList();

	Collections.sort(list, new Comparator<Category>() {
	    @Override
	    public int compare(Category o1, Category o2) {
		if (o1.getNavigationOrder() > o2.getNavigationOrder()) {
		    return 1;
		} else if (o1.getNavigationOrder() < o2.getNavigationOrder()) {
		    return -1;
		}
		return 0;
	    }
	});
	return list;
    }
}
