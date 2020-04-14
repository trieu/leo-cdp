package leotech.cdp.model;

import java.util.Arrays;
import java.util.Date;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.system.util.database.ArangoDbUtil;

public class TrackingEvent extends CdpPersistentObject {

    public static final String COLLECTION_NAME = COLLECTION_PREFIX + TrackingEvent.class.getSimpleName().toLowerCase();
    static ArangoCollection instance;

    @Override
    public ArangoCollection getCollection() {
	if (instance == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getArangoDatabase();

	    instance = arangoDatabase.collection(COLLECTION_NAME);

	    // ensure indexing key fields for fast lookup
	    instance.ensurePersistentIndex(Arrays.asList("refProfileId"), new PersistentIndexOptions().unique(false));
	   
	}
	return instance;
    }

    @DocumentField(Type.KEY)
    @Expose
    protected String key;

    @Expose
    protected Date createdAt = new Date();

    @Expose
    protected String sessionKey;

    @Expose
    protected String trackerId;

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
    protected int timeSpent;

    @Expose
    protected String browserName;

    @Expose
    protected String webCookies;

    @Expose
    protected String deviceId;

    @Expose
    protected String deviceOS;

    @Expose
    protected String deviceName;

    @Expose
    protected String sourceIP;

    @Expose
    protected String feedbackData;

    @Expose
    protected int partitionId = 0;

    @Override
    public boolean isReadyForSave() {
	// TODO Auto-generated method stub
	return true;
    }
    
    public TrackingEvent() {
	// TODO Auto-generated constructor stub
    }

    /////////////////////

    public Date getCreatedAt() {
	return createdAt;
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

    public String getTrackerId() {
	return trackerId;
    }

    public void setTrackerId(String trackerId) {
	this.trackerId = trackerId;
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

    public int getTimeSpent() {
	return timeSpent;
    }

    public void setTimeSpent(int timeSpent) {
	this.timeSpent = timeSpent;
    }

    public String getBrowserName() {
	return browserName;
    }

    public void setBrowserName(String browserName) {
	this.browserName = browserName;
    }

    public String getWebCookies() {
	return webCookies;
    }

    public void setWebCookies(String webCookies) {
	this.webCookies = webCookies;
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

}
