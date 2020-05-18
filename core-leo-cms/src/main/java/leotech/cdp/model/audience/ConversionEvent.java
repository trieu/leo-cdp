package leotech.cdp.model.audience;

import java.util.Arrays;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.system.util.database.ArangoDbUtil;

public class ConversionEvent extends TrackingEvent {

    public static final String COLLECTION_NAME = COLLECTION_PREFIX
	    + ConversionEvent.class.getSimpleName().toLowerCase();
    static ArangoCollection instance;

    @Override
    public ArangoCollection getCollection() {
	if (instance == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getActiveArangoDbInstance();

	    instance = arangoDatabase.collection(COLLECTION_NAME);

	    // ensure indexing key fields for fast lookup
	    instance.ensurePersistentIndex(Arrays.asList("refProfileId"), new PersistentIndexOptions().unique(false));
	}
	return instance;
    }
    

    @Expose
    int timeSpent;
    
    @Expose
    String srcEventKey;

    @Expose
    String transactionCode = "";

    @Expose
    double transactionValue = 0;

    @Expose
    String currencyCode = "";

    @Expose
    int satisfactionScore = 0;

    @Expose
    int fraudScore = 0;

    public ConversionEvent() {
	// TODO Auto-generated constructor stub
    }
    

    public ConversionEvent(String observerId, String sessionKey, String metricName, long metricValue, String refProfileId, int refProfileType,
	    String srcTouchpointId, String refTouchpointId, String browserName,  String deviceId,
	    String deviceOS, String deviceName,String deviceType, String sourceIP,int timeSpent, String srcEventKey) {
	super(observerId, sessionKey, metricName, metricValue, refProfileId, refProfileType, srcTouchpointId, refTouchpointId, browserName,  deviceId, deviceOS, deviceName, deviceType, sourceIP);
	this.timeSpent = timeSpent;
	this.srcEventKey = srcEventKey;
    }
    
    public ConversionEvent(String observerId, String sessionKey, String metricName, long metricValue, String refProfileId, int refProfileType,
	    String srcTouchpointId, String refTouchpointId, String browserName,  String deviceId,
	    String deviceOS, String deviceName,String deviceType, String sourceIP, String srcEventKey) {
	super(observerId, sessionKey, metricName, metricValue, refProfileId, refProfileType, srcTouchpointId, refTouchpointId, browserName, deviceId, deviceOS, deviceName,deviceType, sourceIP);
	this.srcEventKey = srcEventKey;
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

    public int getSatisfactionScore() {
	return satisfactionScore;
    }

    public void setSatisfactionScore(int satisfactionScore) {
	this.satisfactionScore = satisfactionScore;
    }

    public int getFraudScore() {
	return fraudScore;
    }

    public void setFraudScore(int fraudScore) {
	this.fraudScore = fraudScore;
    }

}
