package leotech.system.util.database;

import java.util.HashMap;
import java.util.Map;

import com.arangodb.ArangoCursor;
import com.arangodb.ArangoDB;
import com.arangodb.ArangoDatabase;

import leotech.core.config.DbConfigs;
import rfx.core.util.StringUtil;
import rfx.core.util.Utils;

public class ArangoDbUtil {

    private static DbConfigs dbConfigs = null;

    private static long connectionTtl = 5 * 60 * 1000;
    static final int MAX_CONNECTIONS = 120;

    private static final String defaultArangoDbConfig = "defaultDbConfigs";

    static ArangoDB arangoDB = null;
    static ArangoDatabase arangoDatabase = null;
    static Map<String, ArangoDatabase> arangoDatabaseInstances = new HashMap<>();

    static void initDbConfigs() {
	if (dbConfigs == null) {
	    if (StringUtil.isNotEmpty(defaultArangoDbConfig)) {
		dbConfigs = DbConfigs.load(defaultArangoDbConfig.trim());
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
	if(dbConfigs != null) {
	    ArangoDbUtil.dbConfigs = dbConfigs;    
	}	
    }

    public static ArangoDatabase getArangoDatabase() {
	initDbConfigs();
	if (arangoDatabase == null) {
	    ArangoDB arangoDB = new ArangoDB.Builder().host(dbConfigs.getHost(), dbConfigs.getPort()).user(dbConfigs.getUsername()).password(dbConfigs.getPassword())
		    .chunksize(50000).connectionTtl(connectionTtl).maxConnections(MAX_CONNECTIONS).build();
	    arangoDatabase = arangoDB.db(dbConfigs.getDatabase());
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
    
    public static String contentFindKeyAql(String collectionName) {
  	return "FOR e in " + collectionName + " FILTER e.id == @id RETURN e._key";
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
    
    public static boolean isExistedDocument(String name) {
	String aql = "RETURN LENGTH(FOR d IN tab FILTER d.name == 'abc' LIMIT 1 RETURN true) > 0";
	return true;
    }

}
