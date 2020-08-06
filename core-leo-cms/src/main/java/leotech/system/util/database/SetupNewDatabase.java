package leotech.system.util.database;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import com.arangodb.ArangoDBException;
import com.arangodb.ArangoDatabase;
import com.arangodb.model.CollectionCreateOptions;

import leotech.cdp.model.DataObserver;
import leotech.cdp.model.business.ProductItem;
import leotech.cdp.model.business.ReportUnit;
import leotech.cdp.model.business.ScheduledJob;
import leotech.cdp.model.customer.ContextSession;
import leotech.cdp.model.customer.Profile;
import leotech.cdp.model.customer.Segment;
import leotech.cdp.model.customer.TrackingEvent;
import leotech.cdp.model.customer.UserDevice;
import leotech.cdp.model.marketing.Campaign;
import leotech.cdp.model.marketing.Creative;
import leotech.cdp.model.marketing.EventTrigger;
import leotech.cdp.model.marketing.Touchpoint;
import leotech.cms.dao.CategoryDaoUtil;
import leotech.cms.dao.PageDaoUtil;
import leotech.cms.dao.UserDaoUtil;
import leotech.cms.model.Category;
import leotech.cms.model.FileMetadata;
import leotech.cms.model.Page;
import leotech.cms.model.Post;
import leotech.system.model.AppMetadata;
import leotech.system.model.LeoPackage;
import leotech.system.model.User;
import rfx.core.util.Utils;

public class SetupNewDatabase {

	static final List<String> coreSystemCollections = new ArrayList<>(20);
	static final List<String> businessDataHubCollections = new ArrayList<>(20);
	static final List<String> contentDataHubCollections = new ArrayList<>(20);
	static final List<String> audienceDataHubCollections = new ArrayList<>(20);
	static final List<String> aiModelHubCollections = new ArrayList<>(20);
	static final List<String> activationHubCollections = new ArrayList<>(20);

	static {

		// Business Data Hub
		businessDataHubCollections.add(ProductItem.COLLECTION_NAME);
		businessDataHubCollections.add(Touchpoint.COLLECTION_NAME);
		businessDataHubCollections.add(DataObserver.COLLECTION_NAME);

		// Content Data Hub
		contentDataHubCollections.add(AppMetadata.COLLECTION_NAME);
		contentDataHubCollections.add(Category.COLLECTION_NAME);
		contentDataHubCollections.add(Page.COLLECTION_NAME);
		contentDataHubCollections.add(Post.COLLECTION_NAME);
		contentDataHubCollections.add(FileMetadata.COLLECTION_NAME);

		// Customer Data Hub
		audienceDataHubCollections.add(ContextSession.COLLECTION_NAME);
		audienceDataHubCollections.add(Profile.COLLECTION_NAME);
		audienceDataHubCollections.add(TrackingEvent.COLLECTION_NAME);
		audienceDataHubCollections.add(UserDevice.COLLECTION_NAME);
		audienceDataHubCollections.add(ReportUnit.COLLECTION_NAME);
		audienceDataHubCollections.add(Segment.COLLECTION_NAME);

		// Personalization AI Hub
		// TODO

		// Campaign Activation
		activationHubCollections.add(EventTrigger.COLLECTION_NAME);
		activationHubCollections.add(ScheduledJob.COLLECTION_NAME);
		activationHubCollections.add(Campaign.COLLECTION_NAME);
		activationHubCollections.add(Creative.COLLECTION_NAME);

		// System
		coreSystemCollections.add(User.COLLECTION_NAME);
		coreSystemCollections.add("systemconfigs");

	}

	public static void createNewCollections(ArangoDatabase dbInstance, List<String> list) {
		CollectionCreateOptions options = new CollectionCreateOptions();
		for (String colName : list) {
			try {
				dbInstance.createCollection(colName, options);
				System.out.println("=> Successfully createCollection " + colName);
			} catch (ArangoDBException e) {
				System.err.println("=> Failed to createCollection " + colName);
				e.printStackTrace();
			}
		}
	}

	/**
	 * 
	 * keep this method for clustering
	 * 
	 * @param dbKey
	 */
	static void setupBigDataCollections(String dbKey) {
		ArangoDatabase dbInstance = ArangoDbUtil.initActiveArangoDatabase(dbKey);
		Collection<String> currentDbCollections = dbInstance.getCollections().stream().map(col -> {
			return col.getName();
		}).collect(Collectors.toList());

		List<String> cols = new ArrayList<>(audienceDataHubCollections.size());
		for (String colName : audienceDataHubCollections) {
			boolean isExisted = currentDbCollections.contains(colName);
			if (!isExisted) {
				cols.add(colName);
			}
		}
		createNewCollections(dbInstance, cols);
	}

	static void setupDataCollections(String dbKey) {
		ArangoDatabase dbInstance = ArangoDbUtil.initActiveArangoDatabase(dbKey);
		Collection<String> currentDbCollections = dbInstance.getCollections().stream().map(col -> {
			return col.getName();
		}).collect(Collectors.toList());

		List<String> colsNeedToCreate = new ArrayList<>(100);

		for (String colName : businessDataHubCollections) {
			boolean isExisted = currentDbCollections.contains(colName);
			if (!isExisted) {
				colsNeedToCreate.add(colName);
			}
		}

		for (String colName : contentDataHubCollections) {
			boolean isExisted = currentDbCollections.contains(colName);
			if (!isExisted) {
				colsNeedToCreate.add(colName);
			}
		}

		for (String colName : aiModelHubCollections) {
			boolean isExisted = currentDbCollections.contains(colName);
			if (!isExisted) {
				colsNeedToCreate.add(colName);
			}
		}

		for (String colName : activationHubCollections) {
			boolean isExisted = currentDbCollections.contains(colName);
			if (!isExisted) {
				colsNeedToCreate.add(colName);
			}
		}

		createNewCollections(dbInstance, colsNeedToCreate);
	}

	public static boolean setupDefaultSystemConfigs(String dbKey) {
		ArangoDatabase dbInstance = ArangoDbUtil.initActiveArangoDatabase(dbKey);
		Collection<String> currentDbCollections = dbInstance.getCollections().stream().map(col -> {
			return col.getName();
		}).collect(Collectors.toList());

		// just create collections when user collection is not existed in the
		// database
		List<String> cols = new ArrayList<>(coreSystemCollections.size());
		boolean importDefaultData = false;
		for (String colName : coreSystemCollections) {
			boolean isExisted = currentDbCollections.contains(colName);
			if (!isExisted) {
				cols.add(colName);

				// if collection "user" is not existed, we can make sure this is
				// a new system setup
				if (colName.equalsIgnoreCase(User.COLLECTION_NAME)) {
					importDefaultData = true;
				}
			}
		}

		// setup core system collections
		createNewCollections(dbInstance, cols);

		return importDefaultData;
	}

	static void importingDefaultData() {
		// default data importing

		User firstUser = UserDaoUtil.getByUserLogin("admin");

		// make sure do not override existing data
		if (firstUser == null) {
			firstUser = new User("admin", "123456abc", "admin", "admin@example.com", AppMetadata.DEFAULT_ID);
			UserDaoUtil.createNew(firstUser);
		}
		boolean ok = UserDaoUtil.activateAsSuperAdmin(firstUser.getUserLogin());
		if (ok) {
			System.out.println("==> Activate default user account for login OK");
			String categoryKey = CategoryDaoUtil.save(new Category("Website Contents", AppMetadata.DEFAULT_ID));
			if (categoryKey != null) {
				Page page = new Page("Welcome to Leo CDP", AppMetadata.DEFAULT_ID, categoryKey, firstUser.getKey());
				page.setMediaInfo("Customer Data Platform for Smart Business, developed by USPA.tech");
				PageDaoUtil.save(page);
			}
		}
	}

	public static void createDbCollections(String leoPackage, String arangoDbConfigKey) {
		boolean importDefaultData = false;
		if (LeoPackage.LEO_CDP_FREE_VERSION.equals(leoPackage)
				|| LeoPackage.LEO_CDP_PROFESSIONAL_VERSION.equals(leoPackage)) {
			importDefaultData = setupDefaultSystemConfigs(arangoDbConfigKey);
			setupDataCollections(arangoDbConfigKey);
			setupBigDataCollections(arangoDbConfigKey);

		}
		// TODO for enterprise
		
		if (importDefaultData) {
			importingDefaultData();
		}
		
		Utils.exitSystemAfterTimeout(5432);
	}

	public static void main(String[] args) {
		if (args.length == 2) {
			String leoPackage = args[0];
			String arangoDbConfigKey = args[1];
			createDbCollections(leoPackage, arangoDbConfigKey);
		} else {
			System.err.println("missing db key param [0] leoPackage [1] arangoDbConfigKey");
		}

	}

}
