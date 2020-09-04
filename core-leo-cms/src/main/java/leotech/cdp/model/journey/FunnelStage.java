package leotech.cdp.model.journey;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;
import rfx.core.util.StringUtil;

/**
 * @author mac
 *
 */
public class FunnelStage extends CdpPersistentObject {

	public static final String COLLECTION_NAME = getCollectionName(FunnelStage.class);
	static ArangoCollection dbCollection;

	@DocumentField(Type.KEY)
	@Expose
	protected String id;

	@Expose
	int orderIndex;

	@Expose
	String name;

	@Expose
	String type;

	static List<FunnelStage> eventRetailFunnelStages = new ArrayList<FunnelStage>();
	static List<FunnelStage> customerRetailFunnelStages = new ArrayList<FunnelStage>();

	static {
		
		//Behavioral Event Funnel
		eventRetailFunnelStages.add(new FunnelStage(1, "Content View", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(2, "Product View", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(3, "Customer Login", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(4, "Purchase Intent", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(5, "First Purchase", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(6, "Product Experience", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(7, "Repeat Purchase", "event_retail"));
		
		//Marketing Funnel
		customerRetailFunnelStages.add(new FunnelStage(1, "Visitor", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(2, "Engaged Visitor", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(3, "Customer Lead", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(4, "Prospective Customer", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(5, "First-time Customer", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(7, "Customer Advocate", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(6, "Repeat Customer", "customer_retail"));
		
	}

	public static List<FunnelStage> getEventRetailFunnelStages() {
		return eventRetailFunnelStages;
	}

	public static List<FunnelStage> getCustomerRetailFunnelStages() {
		return customerRetailFunnelStages;
	}

	public FunnelStage() {
		// TODO Auto-generated constructor stub
	}

	public FunnelStage(int orderIndex, String name, String type) {
		super();
		this.orderIndex = orderIndex;
		this.name = name;
		this.type = type;
		this.id = id(orderIndex + name + type);
	}

	public int getOrderIndex() {
		return orderIndex;
	}
	public void setOrderIndex(int orderIndex) {
		this.orderIndex = orderIndex;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Override
	public ArangoCollection getCollection() {
		if (dbCollection == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			dbCollection = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			dbCollection.ensurePersistentIndex(Arrays.asList("type"), new PersistentIndexOptions().unique(false));

		}
		return dbCollection;
	}

	@Override
	public boolean isReadyForSave() {
		// TODO Auto-generated method stub
		return StringUtil.isNotEmpty(id) && StringUtil.isNotEmpty(name);
	}

}
