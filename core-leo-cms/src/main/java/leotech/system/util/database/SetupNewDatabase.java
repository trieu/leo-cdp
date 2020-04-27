package leotech.system.util.database;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import com.arangodb.ArangoDatabase;
import com.arangodb.model.CollectionCreateOptions;

import leotech.cdp.model.Campaign;
import leotech.cdp.model.ContextSession;
import leotech.cdp.model.ConversionEvent;
import leotech.cdp.model.Creative;
import leotech.cdp.model.DataObserver;
import leotech.cdp.model.EventTrigger;
import leotech.cdp.model.Profile;
import leotech.cdp.model.ReportUnit;
import leotech.cdp.model.ScheduledJob;
import leotech.cdp.model.Segment;
import leotech.cdp.model.Touchpoint;
import leotech.cdp.model.TrackingEvent;
import leotech.cdp.model.UserDevice;
import leotech.cms.dao.CategoryDaoUtil;
import leotech.cms.dao.PageDaoUtil;
import leotech.cms.dao.UserDaoUtil;
import leotech.cms.model.Category;
import leotech.cms.model.FileMetadata;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.Page;
import leotech.cms.model.Post;
import leotech.cms.model.User;
import rfx.core.util.Utils;

public class SetupNewDatabase {

    static final List<String> leoPlatformCollectionNames = new ArrayList<>();

    static {
	
	// CMS - content management system
	leoPlatformCollectionNames.add("systemconfigs");
	leoPlatformCollectionNames.add(MediaNetwork.COLLECTION_NAME);
	leoPlatformCollectionNames.add(Category.COLLECTION_NAME);
	leoPlatformCollectionNames.add(Page.COLLECTION_NAME);
	leoPlatformCollectionNames.add(Post.COLLECTION_NAME);
	leoPlatformCollectionNames.add(User.COLLECTION_NAME);
	leoPlatformCollectionNames.add(FileMetadata.COLLECTION_NAME);
	
	// CDP - customer data platform
	leoPlatformCollectionNames.add(ContextSession.COLLECTION_NAME);
	leoPlatformCollectionNames.add(Touchpoint.COLLECTION_NAME);
	leoPlatformCollectionNames.add(DataObserver.COLLECTION_NAME);
	leoPlatformCollectionNames.add(Profile.COLLECTION_NAME);
	leoPlatformCollectionNames.add(TrackingEvent.COLLECTION_NAME);
	leoPlatformCollectionNames.add(ConversionEvent.COLLECTION_NAME);
	leoPlatformCollectionNames.add(UserDevice.COLLECTION_NAME);
	leoPlatformCollectionNames.add(ReportUnit.COLLECTION_NAME);
	
	// CAS - campaign activation system
	leoPlatformCollectionNames.add(Segment.COLLECTION_NAME);
	leoPlatformCollectionNames.add(EventTrigger.COLLECTION_NAME);
	leoPlatformCollectionNames.add(ScheduledJob.COLLECTION_NAME);
	leoPlatformCollectionNames.add(Campaign.COLLECTION_NAME);
	leoPlatformCollectionNames.add(Creative.COLLECTION_NAME);
	
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
	for (String name : leoPlatformCollectionNames) {
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
	    User firstUser = UserDaoUtil.getByUserLogin("cms_admin");
	    if (firstUser == null) {
		firstUser = new User("cms_admin", "123456abc", "cms_admin", "cms_admin@", MediaNetwork.DEFAULT_ID);
		UserDaoUtil.createNew(firstUser);
	    }
	    boolean ok = UserDaoUtil.activateAsSuperAdmin(firstUser.getUserLogin());
	    if (ok) {
		System.out.println("activateAsSuperAdmin OK");
		String categoryKey = CategoryDaoUtil.save(new Category("Document", MediaNetwork.DEFAULT_ID));
		if (categoryKey != null) {
		    Page page = new Page("Introduction to Leo CMS", MediaNetwork.DEFAULT_ID, categoryKey,
			    firstUser.getKey());
		    page.setMediaInfo("TODO");
		    PageDaoUtil.save(page);
		}
	    }
	}

    }

    public static void main(String[] args) {

	SetupNewDatabase.setupCoreLeoCmsCollections();
	Utils.exitSystemAfterTimeout(6000);
    }

}
