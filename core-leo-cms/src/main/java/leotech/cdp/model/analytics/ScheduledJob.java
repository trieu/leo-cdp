package leotech.cdp.model.analytics;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.CdpPersistentObject;

/**
 * @author Trieu Nguyen
 *
 */
public class ScheduledJob extends CdpPersistentObject {

	public static final String COLLECTION_NAME = getCollectionName(ScheduledJob.class);
	static ArangoCollection instance;

	@Override
	public ArangoCollection getDbCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

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
