package leotech.system.util.database;

import java.util.HashMap;
import java.util.Map;

import com.arangodb.ArangoCursor;
import com.arangodb.ArangoDB;
import com.arangodb.ArangoDatabase;
import com.google.gson.Gson;

import leotech.core.config.DbConfigs;
import rfx.core.util.StringUtil;
import rfx.core.util.Utils;

public class ArangoDbUtil {

	private static final int CHUNK_SIZE = 50000;

	private static DbConfigs dbConfigs = null;

	private static final long CONNECTION_TTL = 5 * 60 * 1000;
	static final int MAX_CONNECTIONS = 500;

	public static final String DEFAULT_DB_CONFIG_KEY = "defaultDbConfigs";

	static ArangoDB arangoDB = null;
	static ArangoDatabase activeArangoDbInstance = null;
	static Map<String, ArangoDatabase> arangoDbInstances = new HashMap<>();

	static void initDbConfigs() {
		if (dbConfigs == null) {
			if (StringUtil.isNotEmpty(DEFAULT_DB_CONFIG_KEY)) {
				dbConfigs = DbConfigs.load(DEFAULT_DB_CONFIG_KEY.trim());
				if (dbConfigs == null) {
					Utils.exitSystemAfterTimeout(2000);
					throw new IllegalArgumentException("defaultArangoDbConfig in workers.xml is not valid");
				}
			} else {
				Utils.exitSystemAfterTimeout(2000);
				throw new IllegalArgumentException("defaultArangoDbConfig in workers.xml is not valid");
			}
		}
	}

	public static void setDbConfigs(DbConfigs dbConfigs) {
		if (dbConfigs != null) {
			ArangoDbUtil.dbConfigs = dbConfigs;
		}
	}

	public static ArangoDatabase getActiveArangoDbInstance() {
		initDbConfigs();
		if (activeArangoDbInstance == null) {
			arangoDB = buildDbInstance(dbConfigs.getHost(), dbConfigs.getPort(), dbConfigs.getUsername(), dbConfigs.getPassword());
			activeArangoDbInstance = arangoDB.db(dbConfigs.getDatabase());
		}
		return activeArangoDbInstance;
	}

	public static ArangoDatabase initActiveArangoDatabase(String dbConfigKey) {
		ArangoDatabase db = arangoDbInstances.get(dbConfigKey);
		if (db == null) {
			DbConfigs dbConfig = DbConfigs.load(dbConfigKey);
			
			System.out.println("DbConfigs.load " + dbConfigKey );
			System.out.println(new Gson().toJson(dbConfig));
			
			String dbName = dbConfig.getDatabase();
			String host = dbConfig.getHost();
			int port = dbConfig.getPort();
			String username = dbConfig.getUsername();
			String pass = dbConfig.getPassword();
			ArangoDB arangoDB = buildDbInstance(host, port, username, pass);
			db = arangoDB.db(dbName);
			
			arangoDbInstances.put(dbConfigKey, db);
			
			// if active instance is NULL then set default ArangoDB instance for current active system
			if(activeArangoDbInstance == null) {
				activeArangoDbInstance = db;
			}
			
		}
		return db;
	}

	public static ArangoDB buildDbInstance(String host, int port, String username, String pass) {
		ArangoDB arangoDB = new ArangoDB.Builder().host(host, port).user(username).password(pass).chunksize(CHUNK_SIZE)
				.connectionTtl(CONNECTION_TTL).maxConnections(MAX_CONNECTIONS).build();
		return arangoDB;
	}

	public static String contentFindKeyAql(String collectionName) {
		return "FOR e in " + collectionName + " FILTER e.id == @id RETURN e._key";
	}

	public static String findKey(String aql, String fieldName, Object indexedId) {
		Map<String, Object> bindKeys = new HashMap<>();
		bindKeys.put(fieldName, indexedId);
		ArangoCursor<String> cursor2 = ArangoDbUtil.getActiveArangoDbInstance().query(aql, bindKeys, null, String.class);
		while (cursor2.hasNext()) {
			String key = cursor2.next();
			return key;
		}
		return null;
	}

	public static boolean isExistedDocument(String collectionName, String id) {
		String aql = "RETURN LENGTH(FOR d IN " + collectionName + " FILTER d._key == @id LIMIT 1 RETURN true) > 0";
		System.out.println("isExistedDocument " + aql);
		Map<String, Object> bindKeys = new HashMap<>(1);
		bindKeys.put("id", id);
		ArangoCursor<Boolean> cursor = ArangoDbUtil.getActiveArangoDbInstance().query(aql, bindKeys, null, Boolean.class);
		while (cursor.hasNext()) {
			return cursor.next();
		}
		return false;
	}

}
