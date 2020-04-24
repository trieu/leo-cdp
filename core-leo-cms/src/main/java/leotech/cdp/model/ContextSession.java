package leotech.cdp.model;

import java.util.Arrays;
import java.util.Date;
import java.util.UUID;

import org.apache.commons.lang3.time.DateUtils;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.PersistentIndexOptions;
import com.arangodb.model.TtlIndexOptions;

import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.DateTimeUtil;
import rfx.core.util.StringUtil;

/**
 * @author Trieu Nguyen
 *
 */
public class ContextSession extends CdpPersistentObject {

    private static final int HOURS_OF_A_WEEK = 168;

    public static final String COLLECTION_NAME = COLLECTION_PREFIX + ContextSession.class.getSimpleName().toLowerCase();
    static ArangoCollection instance;

    @Override
    public ArangoCollection getCollection() {
	if (instance == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getArangoDatabase();

	    instance = arangoDatabase.collection(COLLECTION_NAME);

	    // ensure indexing key fields for fast lookup
	    
	    instance.ensurePersistentIndex(Arrays.asList("userDeviceId"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("locationCode"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("appId"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("host"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("refTouchpointId"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("visitorId"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("profileId"), new PersistentIndexOptions().unique(false));
	    instance.ensureTtlIndex(Arrays.asList("autoDeleteAt"), new TtlIndexOptions().expireAfter(0));
	    
	}
	return instance;
    }

    @Override
    public boolean isReadyForSave() {
	return StringUtil.isNotEmpty(ip) && StringUtil.isNotEmpty(sessionKey)&& StringUtil.isNotEmpty(refTouchpointId);
    }

    @DocumentField(Type.KEY)
    String sessionKey;

    String userDeviceId;
    String ip;
    String locationCode;
    String host;
    String appId;
    String refTouchpointId;

    String visitorId;
    String profileId;

    String fingerprintId;
    Date createAt;
    Date autoDeleteAt;

    public ContextSession(String locationCode,String userDeviceId, String ip, String host, String appId, String touchpointId, String visitorId,
	    String profileId, String fingerprintId, int hoursToDelete) {
	super();
	init(locationCode,userDeviceId, ip, host, appId, touchpointId, visitorId, profileId, fingerprintId, hoursToDelete);
    }

    public ContextSession(String locationCode,String userDeviceId, String ip, String host, String appId, String touchpointId, String visitorId,
	    String profileId, String fingerprintId) {
	super();
	init(locationCode,userDeviceId, ip, host, appId, touchpointId, visitorId, profileId, fingerprintId, HOURS_OF_A_WEEK);
    }

    private void init(String locationCode,String userDeviceId, String ip, String host, String appId, String refTouchpointId, String visitorId,
	    String profileId, String fingerprintId, int hoursToDelete) {
	this.locationCode = locationCode;
	this.userDeviceId = userDeviceId;
	this.ip = ip;
	this.host = host;
	this.appId = appId;
	this.refTouchpointId = refTouchpointId;
	this.visitorId = visitorId;
	this.profileId = profileId;
	this.fingerprintId = fingerprintId;

	Date d = new Date();
	this.createAt = d;
	if (hoursToDelete > HOURS_OF_A_WEEK) {
	    this.autoDeleteAt = DateUtils.addHours(d, hoursToDelete);
	} else {
	    this.autoDeleteAt = DateUtils.addHours(d, HOURS_OF_A_WEEK);
	}

	String nowMinuteStr = DateTimeUtil.formatDateHourMinute(d);
	String userId = StringUtil.isEmpty(profileId) ? visitorId : profileId;
	String keyHint = locationCode + userDeviceId + ip + host + appId + userId + fingerprintId + nowMinuteStr;
	this.sessionKey = UUID.nameUUIDFromBytes(keyHint.getBytes()).toString();
    }

    public String getUserDeviceId() {
	return userDeviceId;
    }

    public void setUserDeviceId(String userDeviceId) {
	this.userDeviceId = userDeviceId;
    }

    public String getIp() {
	return ip;
    }

    public void setIp(String ip) {
	this.ip = ip;
    }

    public String getHost() {
	return host;
    }

    public void setHost(String host) {
	this.host = host;
    }

    public String getAppId() {
	return appId;
    }

    public void setAppId(String appId) {
	this.appId = appId;
    }

    public String getRefTouchpointId() {
        return refTouchpointId;
    }

    public void setRefTouchpointId(String refTouchpointId) {
        this.refTouchpointId = refTouchpointId;
    }

    public String getVisitorId() {
	return visitorId;
    }

    public void setVisitorId(String visitorId) {
	this.visitorId = visitorId;
    }

    public String getProfileId() {
	return profileId;
    }

    public void setProfileId(String profileId) {
	this.profileId = profileId;
    }

    public String getFingerprintId() {
	return fingerprintId;
    }

    public void setFingerprintId(String fingerprintId) {
	this.fingerprintId = fingerprintId;
    }

    public Date getCreateAt() {
	return createAt;
    }

    public void setCreateAt(Date createAt) {
	this.createAt = createAt;
    }

    public Date getAutoDeleteAt() {
	return autoDeleteAt;
    }

    public void setAutoDeleteAt(Date autoDeleteAt) {
	this.autoDeleteAt = autoDeleteAt;
    }

    public String getSessionKey() {
	return sessionKey;
    }

}
