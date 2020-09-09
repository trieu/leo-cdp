package leotech.cdp.model.analytics;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;
import rfx.core.util.DateTimeUtil;
import rfx.core.util.StringUtil;

/**
 *  tracking data event, is collected by Leo Observer, the Truth of Universe is recorded here
 * 
 * @author Trieu Nguyen
 * @since 2020
 *
 */
public class TrackingEvent extends CdpPersistentObject {
	public static final int STATE_RAW_DATA = 0;
	public static final int STATE_PROCESSED = 1;
	public static final int STATE_ARCHIVED = -1;

	public static final String COLLECTION_NAME = getCollectionName(TrackingEvent.class);
	static ArangoCollection instance;

	@Override
	public ArangoCollection getDbCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			instance.ensurePersistentIndex(Arrays.asList("refChannelId", "timestamp"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("refJourneyId", "timestamp"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("refProfileId", "timestamp"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("sessionKey", "timestamp"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("observerId", "timestamp"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("collectionId", "timestamp"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("srcTouchpointId", "timestamp"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("refTouchpointId", "timestamp"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("refPostId", "timestamp"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("refMessageId", "timestamp"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("refItemId", "timestamp"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("refServiceId", "timestamp"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("refCampaignId", "timestamp"),
					new PersistentIndexOptions().unique(false));
		}
		return instance;
	}

	@DocumentField(Type.KEY)
	@Expose
	protected String id;

	@Expose
	protected Date createdAt;

	@Expose
	protected int timestamp;

	@Expose
	protected String sessionKey;

	@Expose
	protected boolean isActiveTracked = true;
	
	@Expose
	protected boolean isConversion = false;

	@Expose
	protected String observerId;

	@Expose
	protected String collectionId;

	@Expose
	protected String metricName;

	@Expose
	protected long metricValue = 0;

	@Expose
	protected String refProfileId;

	@Expose
	protected int refProfileType;

	@Expose
	protected String srcTouchpointId;

	@Expose
	protected String refTouchpointId;

	@Expose
	protected String refChannelId;

	@Expose
	protected String refCampaignId;

	@Expose
	protected String refPostId;

	@Expose
	protected String refMessageId;

	@Expose
	protected String refServiceId;

	@Expose
	protected String refItemId;

	@Expose
	protected String refJourneyId;

	@Expose
	protected int refJourneyStage = 0;

	@Expose
	protected String browserName;

	@Expose
	protected String deviceId;

	@Expose
	protected String deviceOS;

	@Expose
	protected String deviceType;

	@Expose
	protected String deviceName;

	@Expose
	protected String sourceIP;

	@Expose
	protected String feedbackText;
	
	// attr for ConversionEvent 
	@Expose
	protected int timeSpent;

	@Expose
	protected String srcEventKey;

	@Expose
	protected String transactionCode = "";

	@Expose
	protected double transactionValue = 0;

	@Expose
	protected String currencyCode = "";

	@Expose
	protected int feedbackScore = 0;

	@Expose
	protected int fraudScore = 0;
	
	protected String environment;

	@Expose
	protected Map<String, String> eventData;

	@Expose
	protected int partitionId = 0;
	
	@Expose
	int state = STATE_RAW_DATA; 
	
	// names of class or actor for processing data
	@Expose
	protected List<String> processors;

	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(this.id) && StringUtil.isNotEmpty(this.metricName) && StringUtil.isNotEmpty(this.observerId)
				&& StringUtil.isNotEmpty(this.srcTouchpointId) && this.timestamp > 0;
	}

	public TrackingEvent() {
		this.observerId = "";
		this.browserName = "";
		this.deviceName = "";
		this.deviceOS = "";
		this.deviceId = "";
	}

	/**
	 * passive tracking by a data crawler from social media 
	 * (e.g: Facebook, YouTube,...)
	 * 
	 * @param observerId
	 * @param metricName
	 * @param metricValue
	 * @param srcTouchpointId
	 */
	public TrackingEvent(String observerId, String metricName, long metricValue, String srcTouchpointId) {
		super();
		
		this.observerId = observerId;
		this.metricName = metricName;
		this.metricValue = metricValue;
		this.srcTouchpointId = srcTouchpointId;
		this.isActiveTracked = false;
		
		this.timestamp = DateTimeUtil.currentUnixTimestamp();
		this.createdAt = new Date(1000L * this.timestamp);
		
		createId(observerId, metricName, metricValue, srcTouchpointId);
	}

	protected void createId(String observerId, String metricName, long metricValue, String srcTouchpointId) {
		String keyHint = observerId + metricName + metricValue + srcTouchpointId + System.currentTimeMillis();
		this.id = id(keyHint);
	}

	/**
	 * 
	 * direct tracking from JavaScript or Mobile SDK
	 * 
	 * @param observerId
	 * @param sessionKey
	 * @param metricName
	 * @param metricValue
	 * @param refProfileId
	 * @param refProfileType
	 * @param srcTouchpointId
	 * @param refTouchpointId
	 * @param browserName
	 * @param webCookies
	 * @param deviceId
	 * @param deviceOS
	 * @param deviceName
	 * @param sourceIP
	 */
	public TrackingEvent(String observerId, String sessionKey, String metricName, long metricValue,
			String refProfileId, int refProfileType, String srcTouchpointId, String refTouchpointId,
			String browserName, String deviceId, String deviceOS, String deviceName, String deviceType,
			String sourceIP, Date createdAt) {
		super();
		this.observerId = observerId;
		this.sessionKey = sessionKey;
		this.metricName = metricName;
		this.metricValue = metricValue;
		this.refProfileId = refProfileId;
		this.refProfileType = refProfileType;
		this.srcTouchpointId = srcTouchpointId;
		this.refTouchpointId = refTouchpointId;
		this.browserName = browserName;

		this.deviceId = deviceId;
		this.deviceOS = deviceOS;
		this.deviceName = deviceName;
		this.deviceType = deviceType;
		this.sourceIP = sourceIP;
		this.createdAt = createdAt;
		this.timestamp = (int) (createdAt.getTime()/1000);
		
		createId(observerId, metricName, metricValue, srcTouchpointId);
	}

	/////////////////////

	public Date getCreatedAt() {
		return createdAt;
	}

	public boolean isActiveTracked() {
		return isActiveTracked;
	}

	public void setActiveTracked(boolean isActiveTracked) {
		this.isActiveTracked = isActiveTracked;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getSessionKey() {
		return sessionKey;
	}

	public void setSessionKey(String sessionKey) {
		this.sessionKey = sessionKey;
	}

	public String getObserverId() {
		return observerId;
	}

	public void setObserverId(String observerId) {
		this.observerId = observerId;
	}

	public String getCollectionId() {
		return collectionId;
	}

	public void setCollectionId(String collectionId) {
		this.collectionId = collectionId;
	}

	public String getMetricName() {
		return metricName;
	}

	public void setMetricName(String metricName) {
		this.metricName = metricName;
	}

	public long getMetricValue() {
		return metricValue;
	}

	public void setMetricValue(long metricValue) {
		this.metricValue = metricValue;
	}

	public String getRefProfileId() {
		return refProfileId;
	}

	public void setRefProfileId(String refProfileId) {
		this.refProfileId = refProfileId;
	}

	public int getRefProfileType() {
		return refProfileType;
	}

	public void setRefProfileType(int refProfileType) {
		this.refProfileType = refProfileType;
	}

	public String getSrcTouchpointId() {
		return srcTouchpointId;
	}

	public void setSrcTouchpointId(String srcTouchpointId) {
		this.srcTouchpointId = srcTouchpointId;
	}

	public String getRefTouchpointId() {
		return refTouchpointId;
	}

	public void setRefTouchpointId(String refTouchpointId) {
		this.refTouchpointId = refTouchpointId;
	}

	public String getRefChannelId() {
		return refChannelId;
	}

	public void setRefChannelId(String refChannelId) {
		this.refChannelId = refChannelId;
	}

	public String getRefCampaignId() {
		return refCampaignId;
	}

	public void setRefCampaignId(String refCampaignId) {
		this.refCampaignId = refCampaignId;
	}

	public String getRefPostId() {
		return refPostId;
	}

	public void setRefPostId(String refPostId) {
		this.refPostId = refPostId;
	}

	public String getRefMessageId() {
		return refMessageId;
	}

	public void setRefMessageId(String refMessageId) {
		this.refMessageId = refMessageId;
	}

	public String getRefServiceId() {
		return refServiceId;
	}

	public void setRefServiceId(String refServiceId) {
		this.refServiceId = refServiceId;
	}

	public String getRefItemId() {
		return refItemId;
	}

	public void setRefItemId(String refItemId) {
		this.refItemId = refItemId;
	}

	public String getRefJourneyId() {
		return refJourneyId;
	}

	public void setRefJourneyId(String refJourneyId) {
		this.refJourneyId = refJourneyId;
	}

	public int getRefJourneyStage() {
		return refJourneyStage;
	}

	public void setRefJourneyStage(int refJourneyStage) {
		this.refJourneyStage = refJourneyStage;
	}

	public int getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(int timestamp) {
		this.timestamp = timestamp;
	}

	public String getBrowserName() {
		return browserName;
	}

	public void setBrowserName(String browserName) {
		this.browserName = browserName;
	}

	public String getDeviceType() {
		return deviceType;
	}

	public void setDeviceType(String deviceType) {
		this.deviceType = deviceType;
	}

	public String getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(String deviceId) {
		this.deviceId = deviceId;
	}

	public String getDeviceOS() {
		return deviceOS;
	}

	public void setDeviceOS(String deviceOS) {
		this.deviceOS = deviceOS;
	}

	public String getDeviceName() {
		return deviceName;
	}

	public void setDeviceName(String deviceName) {
		this.deviceName = deviceName;
	}

	public String getSourceIP() {
		return sourceIP;
	}

	public void setSourceIP(String sourceIP) {
		this.sourceIP = sourceIP;
	}

	public int getPartitionId() {
		return partitionId;
	}

	public void setPartitionId(int partitionId) {
		this.partitionId = partitionId;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getEnvironment() {
		return environment;
	}

	public void setEnvironment(String environment) {
		this.environment = environment;
	}

	public String getFeedbackText() {
		return feedbackText;
	}

	public void setFeedbackText(String feedbackText) {
		this.feedbackText = feedbackText;
	}

	public Map<String, String> getEventData() {
		if (eventData == null) {
			eventData = new HashMap<String, String>(5);
		}
		return eventData;
	}

	public void setEventData(Map<String, String> eventData) {
		if(eventData != null) {
			this.eventData = eventData;
		}
	}
	
	public int getTimeSpent() {
		return timeSpent;
	}

	public void setTimeSpent(int timeSpent) {
		this.timeSpent = timeSpent;
	}

	public String getTransactionCode() {
		return transactionCode;
	}

	public void setTransactionCode(String transactionCode) {
		this.transactionCode = transactionCode;
	}

	public double getTransactionValue() {
		return transactionValue;
	}

	public void setTransactionValue(double transactionValue) {
		this.transactionValue = transactionValue;
	}

	public String getCurrencyCode() {
		return currencyCode;
	}

	public void setCurrencyCode(String currencyCode) {
		this.currencyCode = currencyCode;
	}

	public String getSrcEventKey() {
		return srcEventKey;
	}

	public void setSrcEventKey(String srcEventKey) {
		this.srcEventKey = srcEventKey;
	}

	public int getFeedbackScore() {
		return feedbackScore;
	}

	public void setFeedbackScore(int feedbackScore) {
		this.feedbackScore = feedbackScore;
	}

	public int getFraudScore() {
		return fraudScore;
	}

	public void setFraudScore(int fraudScore) {
		this.fraudScore = fraudScore;
	}

	public boolean isConversion() {
		return isConversion;
	}

	public void setConversion(boolean isConversion) {
		this.isConversion = isConversion;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public List<String> getProcessors() {
		if(this.processors == null) {
			this.processors = new ArrayList<String>(0);
		}
		return processors;
	}

	public void setProcessors(List<String> processors) {
		this.processors = processors;
	}

}
