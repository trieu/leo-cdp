package leotech.cdp.model;

import java.util.Arrays;
import java.util.Date;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.DateTimeUtil;
import rfx.core.util.StringUtil;

/**
 * @author Trieu Nguyen
 *
 */
public class TrackingEvent extends CdpPersistentObject {

    public static final String COLLECTION_NAME = COLLECTION_PREFIX + TrackingEvent.class.getSimpleName().toLowerCase();
    static ArangoCollection instance;

    @Override
    public ArangoCollection getCollection() {
	if (instance == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getArangoDatabase();

	    instance = arangoDatabase.collection(COLLECTION_NAME);

	    // ensure indexing key fields for fast lookup
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
    protected String key;

    @Expose
    protected Date createdAt;

    @Expose
    protected int timestamp;

    @Expose
    protected String sessionKey;

    @Expose
    protected boolean isActiveTracked = true;

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
    
    protected String deviceType;
    
    @Expose
    protected String deviceName;

    @Expose
    protected String sourceIP;

    @Expose
    protected String feedbackData;
    
    protected String environment;
    
    @Expose
    protected Map<String,String> extAttributes;

    @Expose
    protected int partitionId = 0;

    @Override
    public boolean isReadyForSave() {
	return StringUtil.isNotEmpty(this.metricName) && StringUtil.isNotEmpty(this.observerId)
		&& StringUtil.isNotEmpty(this.srcTouchpointId) && this.timestamp > 0;
    }

    public TrackingEvent() {
	// TODO Auto-generated constructor stub
    }

    /**
     * passive tracking by a data crawler from social media (e.g: Facebook,
     * YouTube,...)
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
	this.createdAt = new Date();
	this.timestamp = DateTimeUtil.currentUnixTimestamp();
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
    public TrackingEvent(String observerId, String sessionKey, String metricName, long metricValue, String refProfileId,
	    int refProfileType, String srcTouchpointId, String refTouchpointId, String browserName,
	    String deviceId, String deviceOS, String deviceName,String deviceType, String sourceIP) {
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
	this.createdAt = new Date();
	this.timestamp = DateTimeUtil.currentUnixTimestamp();
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

    public Map<String, String> getExtAttributes() {
        return extAttributes;
    }

    public void setExtAttributes(Map<String, String> extAttributes) {
        this.extAttributes = extAttributes;
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

    public String getFeedbackData() {
	return feedbackData;
    }

    public void setFeedbackData(String feedbackData) {
	this.feedbackData = feedbackData;
    }

    public int getPartitionId() {
	return partitionId;
    }

    public void setPartitionId(int partitionId) {
	this.partitionId = partitionId;
    }

    public String getKey() {
	return key;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }
    
    

}
