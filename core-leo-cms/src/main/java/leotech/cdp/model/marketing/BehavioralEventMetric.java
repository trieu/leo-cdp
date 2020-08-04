package leotech.cdp.model.marketing;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

public class BehavioralEventMetric extends EventMetric {
	
	public static final String COLLECTION_NAME = getCollectionName(BehavioralEventMetric.class);
	static ArangoCollection instance;
	
	

	@Override
	public ArangoCollection getCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = cdpDbInstance();

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
