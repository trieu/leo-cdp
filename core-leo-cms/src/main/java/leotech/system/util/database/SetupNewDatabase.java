package leotech.system.util.database;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import com.arangodb.ArangoDBException;
import com.arangodb.ArangoDatabase;
import com.arangodb.model.CollectionCreateOptions;

import leotech.cdp.model.DataObserver;
import leotech.cdp.model.activation.Campaign;
import leotech.cdp.model.activation.Creative;
import leotech.cdp.model.analytics.ContextSession;
import leotech.cdp.model.analytics.ReportUnit;
import leotech.cdp.model.analytics.ScheduledJob;
import leotech.cdp.model.analytics.TrackingEvent;
import leotech.cdp.model.business.ProductItem;
import leotech.cdp.model.customer.Profile;
import leotech.cdp.model.customer.Segment;
import leotech.cdp.model.customer.Device;
import leotech.cdp.model.journey.BehavioralEventMetric;
import leotech.cdp.model.journey.EventTrigger;
import leotech.cdp.model.journey.MediaChannel;
import leotech.cdp.model.journey.Touchpoint;
import leotech.cms.dao.CategoryDaoUtil;
import leotech.cms.dao.PageDaoUtil;
import leotech.cms.dao.UserDaoUtil;
import leotech.cms.model.Category;
import leotech.cms.model.FileMetadata;
import leotech.cms.model.Page;
import leotech.cms.model.Post;
import leotech.system.model.AppMetadata;
import leotech.system.model.LeoPackage;
import leotech.system.model.SystemConfigs;
import leotech.system.model.SystemUser;
import rfx.core.util.Utils;

public class SetupNewDatabase {

	static final List<String> systemCollections = new ArrayList<>(20);
	static final List<String> cmsCollections = new ArrayList<>(20);
	static final List<String> cdpCollections = new ArrayList<>(20);
	

	static {

		// Content Management System
		cmsCollections.add(Category.COLLECTION_NAME);
		cmsCollections.add(Page.COLLECTION_NAME);
		cmsCollections.add(Post.COLLECTION_NAME);
		cmsCollections.add(FileMetadata.COLLECTION_NAME);

		// Customer Data Platform
		cdpCollections.add(ContextSession.COLLECTION_NAME);
		cdpCollections.add(Profile.COLLECTION_NAME);
		cdpCollections.add(TrackingEvent.COLLECTION_NAME);
		cdpCollections.add(Device.COLLECTION_NAME);
		cdpCollections.add(ReportUnit.COLLECTION_NAME);
		cdpCollections.add(Segment.COLLECTION_NAME);
		cdpCollections.add(ProductItem.COLLECTION_NAME);
		cdpCollections.add(Touchpoint.COLLECTION_NAME);
		cdpCollections.add(MediaChannel.COLLECTION_NAME);
		cdpCollections.add(DataObserver.COLLECTION_NAME);
		cdpCollections.add(BehavioralEventMetric.COLLECTION_NAME);
		
		// Campaign Activation
		cdpCollections.add(EventTrigger.COLLECTION_NAME);
		cdpCollections.add(ScheduledJob.COLLECTION_NAME);
		cdpCollections.add(Campaign.COLLECTION_NAME);
		cdpCollections.add(Creative.COLLECTION_NAME);

		// System
		systemCollections.add(SystemUser.COLLECTION_NAME);
		systemCollections.add(SystemConfigs.COLLECTION_NAME);

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
	static void setupCdpCollections(String dbKey) {
		ArangoDatabase dbInstance = ArangoDbUtil.initActiveArangoDatabase(dbKey);
		Collection<String> currentDbCollections = dbInstance.getCollections().stream().map(col -> {
			return col.getName();
		}).collect(Collectors.toList());

		List<String> cols = new ArrayList<>(cdpCollections.size());
		for (String colName : cdpCollections) {
			boolean isExisted = currentDbCollections.contains(colName);
			if (!isExisted) {
				cols.add(colName);
			}
		}
		createNewCollections(dbInstance, cols);
	}

	static void setupCmsCollections(String dbKey) {
		ArangoDatabase dbInstance = ArangoDbUtil.initActiveArangoDatabase(dbKey);
		Collection<String> currentDbCollections = dbInstance.getCollections().stream().map(col -> {
			return col.getName();
		}).collect(Collectors.toList());

		List<String> colsNeedToCreate = new ArrayList<>(100);

		for (String colName : cmsCollections) {
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
		List<String> cols = new ArrayList<>(systemCollections.size());
		boolean importDefaultData = false;
		for (String colName : systemCollections) {
			boolean isExisted = currentDbCollections.contains(colName);
			if (!isExisted) {
				cols.add(colName);

				// if collection "user" is not existed, we can make sure this is
				// a new system setup
				if (colName.equalsIgnoreCase(SystemUser.COLLECTION_NAME)) {
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

		SystemUser firstUser = UserDaoUtil.getByUserLogin("admin");

		// make sure do not override existing data
		if (firstUser == null) {
			firstUser = new SystemUser("admin", "123456abc", "admin", "admin@example.com", AppMetadata.DEFAULT_ID);
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
		if (LeoPackage.LEO_CDP_FREE_VERSION.equals(leoPackage)|| LeoPackage.LEO_CDP_PROFESSIONAL_VERSION.equals(leoPackage)) {
			importDefaultData = setupDefaultSystemConfigs(arangoDbConfigKey);
			setupCmsCollections(arangoDbConfigKey);
			setupCdpCollections(arangoDbConfigKey);
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
