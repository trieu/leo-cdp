package leotech.system.util.database;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import com.arangodb.ArangoDatabase;
import com.arangodb.model.CollectionCreateOptions;

import leotech.cms.dao.CategoryDaoUtil;
import leotech.cms.dao.PageDaoUtil;
import leotech.cms.dao.UserDaoUtil;
import leotech.cms.model.Category;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.Page;
import leotech.cms.model.User;
import leotech.starter.HttpWorker;

public class SetupNewDatabase {

    static final List<String> coreLeoCmsCollectionNames = new ArrayList<>();

    static {
	coreLeoCmsCollectionNames.add("systemconfigs");
	coreLeoCmsCollectionNames.add("medianetwork");
	coreLeoCmsCollectionNames.add("category");
	coreLeoCmsCollectionNames.add("page");
	coreLeoCmsCollectionNames.add("post");
	coreLeoCmsCollectionNames.add("user");
	coreLeoCmsCollectionNames.add("filemetadata");
	
    }

    public static void createNewCollections(List<String> list) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	CollectionCreateOptions options = new CollectionCreateOptions();

	for (String colName : list) {
	    db.createCollection(colName, options);
	}
    }

    public static void setupCoreLeoCmsCollections() {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Collection<String> dbCOllections = db.getCollections().stream().map(col -> {
	    return col.getName();
	}).collect(Collectors.toList());
	List<String> cols = new ArrayList<>();
	boolean importDefaultData = true;
	for (String name : coreLeoCmsCollectionNames) {
	    boolean isExisted = dbCOllections.contains(name);
	    if (!isExisted) {
		cols.add(name);
		if (name.equalsIgnoreCase("user")) {
		    importDefaultData = true;
		}
	    }
	}

	// setup collections
	createNewCollections(cols);

	// default data importing
	if (importDefaultData) {
	    User user = new User("cms_admin", "123456abc", "cms_admin", "cms_admin@", MediaNetwork.DEFAULT_ID);
	    UserDaoUtil.createNew(user);
	    boolean ok = UserDaoUtil.activateAsSuperAdmin(user.getUserLogin());
	    if (ok) {
		System.out.println("activateAsSuperAdmin OK");
		String categoryKey = CategoryDaoUtil.save(new Category("Document", MediaNetwork.DEFAULT_ID));
		if (categoryKey != null) {
		    Page page = new Page("Introduction to Leo CMS", MediaNetwork.DEFAULT_ID, categoryKey, user.getKey());
		    page.setMediaInfo("TODO");
		    PageDaoUtil.save(page);
		}
	    }
	}

    }
    
    public static void main(String[] args) {
	HttpWorker.start("mainHttpWorkerXemGiDay");
	SetupNewDatabase.setupCoreLeoCmsCollections();
    }

}
