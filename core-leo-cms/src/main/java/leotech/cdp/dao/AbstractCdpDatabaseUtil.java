package leotech.cdp.dao;

import com.arangodb.ArangoDatabase;

import leotech.system.util.database.ArangoDbUtil;

public abstract class AbstractCdpDatabaseUtil {

	private static final String LEO_CDP_DB_CONFIGS = "leoCdpDbConfigs";

	public static final ArangoDatabase getCdpDbInstance() {
		ArangoDatabase db = ArangoDbUtil.initActiveArangoDatabase(LEO_CDP_DB_CONFIGS);
		return db;
	}
	
}
