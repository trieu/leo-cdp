package leotech.cdp.model.activation;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;
import leotech.cdp.model.business.ProductItem;
import leotech.cdp.model.journey.EventTrigger;
import rfx.core.util.StringUtil;

public class Campaign extends CdpPersistentObject implements Comparable<Campaign> {
	
	public static final int CAMPAIGN_TYPE_RETARGETING = 1; 
	
	public static final String COLLECTION_NAME = getCollectionName(Campaign.class);
	static ArangoCollection dbCollection;
	
	@Expose
	String id;
	
	@Expose
	String tagName;
	
	@Expose
	String name;
	
	@Expose
	int type = 0;
	
	@Expose
	List<String> segmentIds;
	
	@Expose
	List<String> profileIds;
	
	@Expose
	String templateHeader;
	
	@Expose
	String templateBody;
	
	@Expose
	int status;
	
	@Expose
	Date scheduledDate = new Date();// init data as now
	
	@Expose
	EventTrigger eventTrigger; 
	
	@Expose
	double cost;
	
	@Expose
	double revenue;
	
	@Expose
	Map<String, ProductItem> mapSkuToProducts = new HashMap<String, ProductItem>();

	public double getRatioRevenuePerCost() {
		if(cost > 0 && revenue > 0) {
			double ratio = revenue / cost;
			return ratio;
		}
		return -1;
	}

	@Override
	public ArangoCollection getDbCollection() {
		if (dbCollection == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			dbCollection = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			dbCollection.ensurePersistentIndex(Arrays.asList("tagName"), new PersistentIndexOptions().unique(true));
		}
		return dbCollection;
	}

	@Override
	public boolean isReadyForSave() {
		// TODO Auto-generated method stub
		return StringUtil.isNotEmpty(name) &&  StringUtil.isNotEmpty(tagName) && type > 0;
	}
	
	

	public Campaign(String name, int type) {
		super();
		this.name = name;
		this.type = type;
		this.id = id(name + type);
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTagName() {
		return tagName;
	}

	public void setTagName(String tagName) {
		this.tagName = tagName;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public List<String> getSegmentIds() {
		return segmentIds;
	}

	public void setSegmentIds(List<String> segmentIds) {
		this.segmentIds = segmentIds;
	}

	public List<String> getProfileIds() {
		return profileIds;
	}

	public void setProfileIds(List<String> profileIds) {
		this.profileIds = profileIds;
	}

	public String getTemplateHeader() {
		return templateHeader;
	}

	public void setTemplateHeader(String templateHeader) {
		this.templateHeader = templateHeader;
	}

	public String getTemplateBody() {
		return templateBody;
	}

	public void setTemplateBody(String templateBody) {
		this.templateBody = templateBody;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public Date getScheduledDate() {
		return scheduledDate;
	}

	public void setScheduledDate(Date scheduledDate) {
		this.scheduledDate = scheduledDate;
	}

	public EventTrigger getEventTrigger() {
		return eventTrigger;
	}

	public void setEventTrigger(EventTrigger eventTrigger) {
		this.eventTrigger = eventTrigger;
	}

	public double getCost() {
		return cost;
	}

	public void setCost(double cost) {
		this.cost = cost;
	}

	public double getRevenue() {
		return revenue;
	}

	public void setRevenue(double revenue) {
		this.revenue = revenue;
	}

	public Map<String, ProductItem> getMapSkuToProducts() {
		return mapSkuToProducts;
	}

	public void setMapSkuToProducts(Map<String, ProductItem> mapSkuToProducts) {
		this.mapSkuToProducts = mapSkuToProducts;
	}
	
	public ProductItem getProductItemBySku(String productSku) {
		return mapSkuToProducts.get(productSku);
	}

	@Override
	public int compareTo(Campaign o) {
		if(this.scheduledDate != null && o.getScheduledDate() != null) {
			return this.scheduledDate.compareTo(o.getScheduledDate());
		}
		return -1;
	}

}
