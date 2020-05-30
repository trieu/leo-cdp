package leotech.system.util.database;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import com.arangodb.ArangoDBException;
import com.arangodb.ArangoDatabase;
import com.arangodb.model.CollectionCreateOptions;

import leotech.cdp.model.DataObserver;
import leotech.cdp.model.audience.ContextSession;
import leotech.cdp.model.audience.ConversionEvent;
import leotech.cdp.model.audience.Profile;
import leotech.cdp.model.audience.Segment;
import leotech.cdp.model.audience.TrackingEvent;
import leotech.cdp.model.audience.UserDevice;
import leotech.cdp.model.business.Campaign;
import leotech.cdp.model.business.Creative;
import leotech.cdp.model.business.EventTrigger;
import leotech.cdp.model.business.ReportUnit;
import leotech.cdp.model.business.ScheduledJob;
import leotech.cdp.model.business.Touchpoint;
import leotech.cms.dao.CategoryDaoUtil;
import leotech.cms.dao.PageDaoUtil;
import leotech.cms.dao.UserDaoUtil;
import leotech.cms.model.Category;
import leotech.cms.model.FileMetadata;
import leotech.cms.model.Page;
import leotech.cms.model.Post;
import leotech.system.model.AppMetadata;
import leotech.system.model.User;
import rfx.core.util.Utils;

public class SetupNewDatabase {

	static final List<String> leoCMSCollectionNames = new ArrayList<>(20);
	static final List<String> leoCDPCollectionNames = new ArrayList<>(20);
	static final List<String> leoCASCollectionNames = new ArrayList<>(20);

	static {

		// CMS - content management system
		leoCMSCollectionNames.add("systemconfigs");
		leoCMSCollectionNames.add(AppMetadata.COLLECTION_NAME);
		leoCMSCollectionNames.add(Category.COLLECTION_NAME);
		leoCMSCollectionNames.add(Page.COLLECTION_NAME);
		leoCMSCollectionNames.add(Post.COLLECTION_NAME);
		leoCMSCollectionNames.add(User.COLLECTION_NAME);
		leoCMSCollectionNames.add(FileMetadata.COLLECTION_NAME);

		// CDP - customer data platform
		leoCDPCollectionNames.add(ContextSession.COLLECTION_NAME);
		leoCDPCollectionNames.add(Touchpoint.COLLECTION_NAME);
		leoCDPCollectionNames.add(DataObserver.COLLECTION_NAME);
		leoCDPCollectionNames.add(Profile.COLLECTION_NAME);
		leoCDPCollectionNames.add(TrackingEvent.COLLECTION_NAME);
		leoCDPCollectionNames.add(ConversionEvent.COLLECTION_NAME);
		leoCDPCollectionNames.add(UserDevice.COLLECTION_NAME);
		leoCDPCollectionNames.add(ReportUnit.COLLECTION_NAME);

		// CAS - campaign activation system
		leoCASCollectionNames.add(Segment.COLLECTION_NAME);
		leoCASCollectionNames.add(EventTrigger.COLLECTION_NAME);
		leoCASCollectionNames.add(ScheduledJob.COLLECTION_NAME);
		leoCASCollectionNames.add(Campaign.COLLECTION_NAME);
		leoCASCollectionNames.add(Creative.COLLECTION_NAME);

	}

	public static void createNewCollections(ArangoDatabase dbInstance, List<String> list) {
		CollectionCreateOptions options = new CollectionCreateOptions();
		for (String colName : list) {
			try {
				dbInstance.createCollection(colName, options);
			} catch (ArangoDBException e) {
				System.err.println("=> Failed to createCollection " + colName);
				e.printStackTrace();
			}
		}
	}
	
	public static void setupLeoCDPCollections(String dbKey) {
		ArangoDatabase dbInstance = ArangoDbUtil.initActiveArangoDatabase(dbKey);
		Collection<String> dbCollections = dbInstance.getCollections().stream().map(col -> {
			return col.getName();
		}).collect(Collectors.toList());
		
		List<String> cols = new ArrayList<>(leoCDPCollectionNames.size());
		
		for (String name : leoCDPCollectionNames) {
			boolean isExisted = dbCollections.contains(name);
			if (!isExisted) {
				cols.add(name);
			}
		}

		// setup collections
		createNewCollections(dbInstance, cols);
	}
	
	public static void setupLeoCASCollections(String dbKey) {
		ArangoDatabase dbInstance = ArangoDbUtil.initActiveArangoDatabase(dbKey);
		Collection<String> dbCollections = dbInstance.getCollections().stream().map(col -> {
			return col.getName();
		}).collect(Collectors.toList());
		
		List<String> cols = new ArrayList<>(leoCASCollectionNames.size());
		
		for (String name : leoCASCollectionNames) {
			boolean isExisted = dbCollections.contains(name);
			if (!isExisted) {
				cols.add(name);
			}
		}

		// setup collections
		createNewCollections(dbInstance, cols);
	}

	public static void setupLeoCMSCollections(String dbKey) {
		ArangoDatabase dbInstance = ArangoDbUtil.initActiveArangoDatabase(dbKey);
		Collection<String> dbCollections = dbInstance.getCollections().stream().map(col -> {
			return col.getName();
		}).collect(Collectors.toList());
		
		List<String> cols = new ArrayList<>(leoCMSCollectionNames.size());
		boolean importDefaultData = true;
		for (String name : leoCMSCollectionNames) {
			boolean isExisted = dbCollections.contains(name);
			if (!isExisted) {
				cols.add(name);
				if (name.equalsIgnoreCase("user")) {
					importDefaultData = true;
				}
			}
		}

		// setup collections
		createNewCollections(dbInstance, cols);

		// default data importing
		if (importDefaultData) {
			User firstUser = UserDaoUtil.getByUserLogin("cms_admin");
			if (firstUser == null) {
				firstUser = new User("cms_admin", "123456abc", "cms_admin", "cms_admin@example.com", AppMetadata.DEFAULT_ID);
				UserDaoUtil.createNew(firstUser);
			}
			boolean ok = UserDaoUtil.activateAsSuperAdmin(firstUser.getUserLogin());
			if (ok) {
				System.out.println("activateAsSuperAdmin OK");
				String categoryKey = CategoryDaoUtil.save(new Category("Website Contents", AppMetadata.DEFAULT_ID));
				if (categoryKey != null) {
					Page page = new Page("Introduction to Leo CDP", AppMetadata.DEFAULT_ID, categoryKey, firstUser.getKey());
					page.setMediaInfo("");
					PageDaoUtil.save(page);
				}
				CategoryDaoUtil.save(new Category("Content Tracking Links", AppMetadata.DEFAULT_ID ));
			}
		}
	}
	

	public static void createDbCollections(String systemType, String dbKey) {
		if("cms".equals(systemType)) {
			SetupNewDatabase.setupLeoCMSCollections(dbKey);
		}
		else if("cdp".equals(systemType)) {
			SetupNewDatabase.setupLeoCDPCollections(dbKey);
		}
		else if("cas".equals(systemType)) {
			SetupNewDatabase.setupLeoCASCollections(dbKey);
		}
		Utils.exitSystemAfterTimeout(4000);
	}
	
	
	public static void main(String[] args) {
		if (args.length == 2) {
			
			String systemType = args[0];
			String dbKey = args[1];
			
			createDbCollections(systemType, dbKey);
		} else {
			System.err.println("missing db key param [0] systemType [1] dbKey");
		}
		
	}

}
