package leotech.cdp.model;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.system.util.database.ArangoDbUtil;

public class JourneyMap extends CdpPersistentObject{

    public static final String COLLECTION_NAME = COLLECTION_PREFIX + JourneyMap.class.getSimpleName().toLowerCase();
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

}
