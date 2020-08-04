package leotech.cdp.model.marketing;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import rfx.core.util.StringUtil;

public class BehavioralEventMetric extends EventMetric {
	
	public static final String COLLECTION_NAME = getCollectionName(BehavioralEventMetric.class);
	static ArangoCollection instance;
	
	int eventFunnelStage;
	int customerFunnelStage;

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
		return StringUtil.isNotEmpty(eventName);
	}
}
