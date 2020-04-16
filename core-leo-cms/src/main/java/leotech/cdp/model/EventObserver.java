package leotech.cdp.model;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.google.gson.annotations.Expose;

import leotech.system.util.database.ArangoDbUtil;


public class EventObserver extends CdpPersistentObject{

    public static final String COLLECTION_NAME = COLLECTION_PREFIX + EventObserver.class.getSimpleName().toLowerCase();
    static ArangoCollection instance;

    @Override
    public ArangoCollection getCollection() {
	if (instance == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getArangoDatabase();

	    instance = arangoDatabase.collection(COLLECTION_NAME);

	    // ensure indexing key fields for fast lookup
	    
	}
	return instance;
    }

    @Override
    public boolean isReadyForSave() {
	// TODO Auto-generated method stub
	return false;
    }
    
    @Expose
    String id;
    
    @Expose
    String name;

    @Expose
    int type = 1;//observer in web
    
    @Expose
    int status = 0;
    
    @Expose
    long estimatedTotalEvent = 0;
    
    @Expose
    String observerUri;
    
    @Expose
    String touchpointId;
    
    @Expose
    boolean isCamera;
    
    @Expose
    String deviceId;
    
    @Expose
    String securityAccessIp;
    
    @Expose
    String securityCode;
    
    @Expose
    List<String> javascript3rdTags;
    
    @Expose
    String mobileAppId;
    
    @Expose
    Date createdAt;
    
    @Expose
    Date updatedAt;

    /**
     * @param name
     * @param type
     * @param touchpointId
     */
    public EventObserver(String name, int type, String touchpointId) {
	super();
	String keyHint = name + type + touchpointId;
	this.id = UUID.nameUUIDFromBytes(keyHint.getBytes()).toString();
	this.name = name;
	this.type = type;
	this.touchpointId = touchpointId;
	this.createdAt = new Date();
    }
    
    

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public long getEstimatedTotalEvent() {
        return estimatedTotalEvent;
    }

    public void setEstimatedTotalEvent(long estimatedTotalEvent) {
        this.estimatedTotalEvent = estimatedTotalEvent;
    }

    public String getObserverUri() {
        return observerUri;
    }

    public void setObserverUri(String observerUri) {
        this.observerUri = observerUri;
    }

    public String getTouchpointId() {
        return touchpointId;
    }

    public void setTouchpointId(String touchpointId) {
        this.touchpointId = touchpointId;
    }

    public boolean isCamera() {
        return isCamera;
    }

    public void setCamera(boolean isCamera) {
        this.isCamera = isCamera;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getSecurityAccessIp() {
        return securityAccessIp;
    }

    public void setSecurityAccessIp(String securityAccessIp) {
        this.securityAccessIp = securityAccessIp;
    }

    public String getSecurityCode() {
        return securityCode;
    }

    public void setSecurityCode(String securityCode) {
        this.securityCode = securityCode;
    }

    public List<String> getJavascript3rdTags() {
        return javascript3rdTags;
    }

    public void setJavascript3rdTags(List<String> javascript3rdTags) {
        this.javascript3rdTags = javascript3rdTags;
    }

    public String getMobileAppId() {
        return mobileAppId;
    }

    public void setMobileAppId(String mobileAppId) {
        this.mobileAppId = mobileAppId;
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

    
    

}

