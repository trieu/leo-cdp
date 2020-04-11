package leotech.cdp.model;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.system.util.database.ArangoDbUtil;

/*id = PrimaryKey(str, 36)
timestamp = Required(int, size=32, unsigned=True, index='reportunit_time_key_idx')
metricName = Required(str, 42, index='rp_metric_idx')
eventKey = Optional(str, 1200, index='rp_key_str_idx')
eventKeyData = Optional(Json, index='rp_keyjson_idx')
metricValue = Required(int, size=64, default=0)
reportedAt = Required(datetime)
updatedAt = Required(datetime)
timeUnit = Optional(int, size=8, default=3)
partitionId = Optional(int, size=16, default=1)*/

public class ReportUnit  extends CdpPersistentObject implements Comparable<ReportUnit>{

    public static final String COLLECTION_NAME = COLLECTION_PREFIX + ReportUnit.class.getSimpleName().toLowerCase();
    static ArangoCollection instance;

    @Override
    public ArangoCollection getCollection() {
	if (instance == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getArangoDatabase();

	    instance = arangoDatabase.collection(COLLECTION_NAME);

	    // ensure indexing key fields for fast lookup
	    
	}
	return instance;
    }

    @Override
    public boolean isReadyForSave() {
	// TODO Auto-generated method stub
	return false;
    }

    @Override
    public int compareTo(ReportUnit o) {
	// TODO Auto-generated method stub
	return 0;
    }

}
