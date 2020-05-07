package leotech.cdp.model;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.system.util.database.ArangoDbUtil;

/**
 * @author Trieu Nguyen
 *
 */
public class ScheduledJob extends CdpPersistentObject{

    public static final String COLLECTION_NAME = COLLECTION_PREFIX + ScheduledJob.class.getSimpleName().toLowerCase();
    static ArangoCollection instance;

    @Override
    public ArangoCollection getCollection() {
	if (instance == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getActiveArangoDbInstance();

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

}
