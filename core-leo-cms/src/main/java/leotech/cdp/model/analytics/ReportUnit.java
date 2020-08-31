package leotech.cdp.model.analytics;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;


/**
 * Reporting Unit for dashboard and time series analytics
 * 
 * @author tantrieu31
 * @since 2020
 *
 */
public class ReportUnit extends CdpPersistentObject implements Comparable<ReportUnit> {

	public static final String COLLECTION_NAME = getCollectionName(ReportUnit.class);
	static ArangoCollection instance;
	
	@Override
	public ArangoCollection getCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup

		}
		return instance;
	}
	
	@DocumentField(Type.KEY)
	@Expose
	String id;
	
	@Expose
	int timestamp;
	
	@Expose
	String metricName = "";
	
	@Expose
	String eventKey = "";
	
	@Expose
	Map<String, String> eventKeyData;
	
	@Expose
	long metricValue = 0;
	
	@Expose
	Date createdAt;
	
	@Expose
	Date updatedAt;
	
	@Expose
	int timeUnit = 0;
	
	@Expose
	// Total Customer Statistics, Total Event Statistics or Daily Event Funnel, Daily Customer Funnel
	String groupName;
	
	int partitionId;

	public ReportUnit() {
		// TODO Auto-generated constructor stub
	}
	
	

	public ReportUnit(String metricName, long metricValue) {
		super();
		this.metricName = metricName;
		this.metricValue = metricValue;
		this.timestamp = 0;
		this.createdAt = new Date();
		this.eventKeyData = new HashMap<String, String>();
	}



	public Map<String, String> getEventKeyData() {
		return eventKeyData;
	}



	public void setEventKeyData(Map<String, String> eventKeyData) {
		this.eventKeyData = eventKeyData;
	}



	public Date getCreatedAt() {
		return createdAt;
	}



	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}



	public Date getUpdatedAt() {
		return updatedAt;
	}



	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}



	public int getTimeUnit() {
		return timeUnit;
	}



	public void setTimeUnit(int timeUnit) {
		this.timeUnit = timeUnit;
	}



	public String getId() {
		return id;
	}



	public int getPartitionId() {
		return partitionId;
	}



	public int getTimestamp() {
		return timestamp;
	}



	public void setTimestamp(int timestamp) {
		this.timestamp = timestamp;
	}



	public String getMetricName() {
		return metricName;
	}



	public void setMetricName(String metricName) {
		this.metricName = metricName;
	}



	public String getEventKey() {
		return eventKey;
	}



	public void setEventKey(String eventKey) {
		this.eventKey = eventKey;
	}



	public long getMetricValue() {
		return metricValue;
	}



	public void setMetricValue(long metricValue) {
		this.metricValue = metricValue;
	}



	@Override
	public boolean isReadyForSave() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public int compareTo(ReportUnit o) {
		// TODO Auto-generated method stub
		return 0;
	}

}
