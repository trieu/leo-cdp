package leotech.system.util.database;

import java.util.HashMap;
import java.util.Map;

import com.arangodb.ArangoCursor;
import com.arangodb.ArangoDB;
import com.arangodb.ArangoDatabase;

import leotech.core.config.DbConfigs;
import rfx.core.configs.WorkerConfigs;
import rfx.core.util.StringUtil;
import rfx.core.util.Utils;

public class ArangoDbUtil {

    private static final WorkerConfigs WORKER_CONFIGS = WorkerConfigs.load();
    private static final DbConfigs DB_CONFIG;
    static {
	String defaultArangoDbConfig = WORKER_CONFIGS.getCustomConfig("defaultArangoDbConfig");

	if (StringUtil.isNotEmpty(defaultArangoDbConfig)) {
	    DB_CONFIG = DbConfigs.load(defaultArangoDbConfig.trim());
	    if (DB_CONFIG == null) {
		Utils.exitSystemAfterTimeout(2000);
		throw new IllegalArgumentException("defaultArangoDbConfig in workers.xml is not valid");
	    }
	} else {
	    Utils.exitSystemAfterTimeout(2000);
	    throw new IllegalArgumentException("defaultArangoDbConfig in workers.xml is not valid");
	}
    }

    private static final String PASSWORD = DB_CONFIG.getPassword();
    private static final String USERNAME = DB_CONFIG.getUsername();
    private static final String DB_NAME = DB_CONFIG.getDatabase();
    private static final String HOST = DB_CONFIG.getHost();
    private static final int PORT = DB_CONFIG.getPort();
    private static final long connectionTtl = 5 * 60 * 1000;
    static final int MAX_CONNECTIONS = 120;

    static ArangoDB arangoDB = null;
    static ArangoDatabase arangoDatabase = null;
    static Map<String, ArangoDatabase> arangoDatabaseInstances = new HashMap<>();

    public static ArangoDatabase getArangoDatabase() {
	if (arangoDatabase == null) {
	    ArangoDB arangoDB = new ArangoDB.Builder().host(HOST, PORT).user(USERNAME).password(PASSWORD).chunksize(50000).connectionTtl(connectionTtl)
		    .maxConnections(MAX_CONNECTIONS).build();
	    arangoDatabase = arangoDB.db(DB_NAME);
	}
	return arangoDatabase;
    }

    public static ArangoDatabase getArangoDatabase(String dbConfigKey) {
	ArangoDatabase db = arangoDatabaseInstances.get(dbConfigKey);
	if (db == null) {
	    DbConfigs dbConfig = DbConfigs.load(dbConfigKey);
	    String dbName = dbConfig.getDatabase();
	    String host = dbConfig.getHost();
	    int port = dbConfig.getPort();
	    String username = dbConfig.getUsername();
	    String pass = dbConfig.getPassword();
	    ArangoDB arangoDB = buildDbInstance(host, port, username, pass);
	    db = arangoDB.db(dbName);
	    arangoDatabaseInstances.put(dbConfigKey, db);
	}
	return db;
    }

    public static ArangoDB buildDbInstance(String host, int port, String username, String pass) {
	ArangoDB arangoDB = new ArangoDB.Builder().host(host, port).user(username).password(pass).chunksize(50000).connectionTtl(connectionTtl).maxConnections(MAX_CONNECTIONS)
		.build();
	return arangoDB;
    }

    public static String findKey(String aql, String fieldName, Object indexedId) {
	Map<String, Object> bindKeys = new HashMap<>();
	bindKeys.put(fieldName, indexedId);
	ArangoCursor<String> cursor2 = ArangoDbUtil.getArangoDatabase().query(aql, bindKeys, null, String.class);
	while (cursor2.hasNext()) {
	    String key = cursor2.next();
	    return key;
	}
	return null;
    }

}
