package leotech.cdp.model.journey;

import java.util.Arrays;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.model.PersistentIndexOptions;

import rfx.core.util.StringUtil;

public class BehavioralEventMetric extends EventMetric {
	
	public static final String COLLECTION_NAME = getCollectionName(BehavioralEventMetric.class);
	static ArangoCollection dbCollection;
	
	String eventFunnelStageId;
	
	String customerFunnelStageId;
	
	
	public BehavioralEventMetric(String eventName, String eventLabel, int score, int dataType, String eventFunnelStageId, String customerFunnelStageId) {
		super(eventName, eventLabel, score, dataType);
		this.eventFunnelStageId = eventFunnelStageId;
		this.customerFunnelStageId = customerFunnelStageId;
	}

	@Override
	public ArangoCollection getDbCollection() {
		if (dbCollection == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			dbCollection = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			dbCollection.ensurePersistentIndex(Arrays.asList("eventName"),
					new PersistentIndexOptions().unique(true));
			dbCollection.ensurePersistentIndex(Arrays.asList("dataType"),
					new PersistentIndexOptions().unique(false));

		}
		return dbCollection;
	}

	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(eventName);
	}

	public String getEventFunnelStageId() {
		return eventFunnelStageId;
	}

	public void setEventFunnelStageId(String eventFunnelStageId) {
		this.eventFunnelStageId = eventFunnelStageId;
	}

	public String getCustomerFunnelStageId() {
		return customerFunnelStageId;
	}

	public void setCustomerFunnelStageId(String customerFunnelStageId) {
		this.customerFunnelStageId = customerFunnelStageId;
	}
	
	
}
