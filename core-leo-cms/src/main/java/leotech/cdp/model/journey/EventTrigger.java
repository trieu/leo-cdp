package leotech.cdp.model.journey;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.CdpPersistentObject;
import leotech.system.util.database.ArangoDbUtil;

/**
 * @author Trieu Nguyen (Thomas)
 * 
 *         A trigger event is any occurence that creates an opening for a
 *         marketing or sales opportunity. Sales and marketing automation
 *         workflows use trigger events to enable small organizations to scale
 *         customer interactions.
 *
 */
public class EventTrigger extends EventMetaData {

	public static final String COLLECTION_NAME = getCollectionName(EventTrigger.class);
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
