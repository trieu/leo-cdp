package leotech.cdp.model.journey;

import java.util.Arrays;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.model.PersistentIndexOptions;

import leotech.cdp.service.FunnelDataService;
import rfx.core.util.StringUtil;

public class BehavioralEventMetric extends EventMetaData {
	
	public static final String COLLECTION_NAME = getCollectionName(BehavioralEventMetric.class);
	static ArangoCollection dbCollection;
	
	String eventStageId;
	
	String customerFunnelStageId;
	
	
	public BehavioralEventMetric(String eventName, String eventLabel, int score, int dataType, String eventStageId, String customerFunnelStageId) {
		super(eventName, eventLabel, score, dataType);
		this.eventStageId = eventStageId;
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

	public String getEventStageId() {
		return eventStageId;
	}
	
	public DataFlowStage getEventStage() {
		return FunnelDataService.getFunnelStageById(eventStageId);
	}

	public void setEventStageId(String eventStageId) {
		this.eventStageId = eventStageId;
	}

	public String getCustomerFunnelStageId() {
		return customerFunnelStageId;
	}
	
	public DataFlowStage getCustomerFunnelStage() {
		return FunnelDataService.getFunnelStageById(customerFunnelStageId);
	}

	public void setCustomerFunnelStageId(String customerFunnelStageId) {
		this.customerFunnelStageId = customerFunnelStageId;
	}
	
}
