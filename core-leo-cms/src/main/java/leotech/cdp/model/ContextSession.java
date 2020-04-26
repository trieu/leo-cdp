package leotech.cdp.model;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.UUID;

import org.joda.time.DateTime;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.PersistentIndexOptions;
import com.arangodb.model.TtlIndexOptions;
import com.devskiller.friendly_id.FriendlyId;

import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.StringUtil;

/**
 * @author Trieu Nguyen
 *
 */
public class ContextSession extends CdpPersistentObject {

    public static final String DATE_HOUR_FORMAT_PATTERN = "yyyy-MM-dd-HH";
    static final DateFormat DATEHOUR_FORMAT = new SimpleDateFormat(DATE_HOUR_FORMAT_PATTERN);
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
	    instance.ensurePersistentIndex(Arrays.asList("refTouchpointId"),
		    new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("visitorId"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("profileId"), new PersistentIndexOptions().unique(false));
	    instance.ensureTtlIndex(Arrays.asList("autoDeleteAt"), new TtlIndexOptions().expireAfter(0));

	}
	return instance;
    }

    @Override
    public boolean isReadyForSave() {
	return StringUtil.isNotEmpty(ip) && StringUtil.isNotEmpty(sessionKey) && StringUtil.isNotEmpty(refTouchpointId);
    }

    /**
     * @param Date
     * @return date string in format "yyyy-MM-dd-HH"
     */
    public static String getSessionDateTimeKey(DateTime dt) {
	String tk = DATEHOUR_FORMAT.format(dt.toDate());
	int m = dt.getMinuteOfHour();
	if (m < 30) {
	    tk += "-00";
	} else {
	    tk += "-30";
	}
	return tk;
    }

    @DocumentField(Type.KEY)
    String sessionKey;

    String dateTimeKey;
    String userDeviceId;
    String ip;
    String locationCode;
    String mediaHost;
    String appId;
    String refTouchpointId;

    String visitorId;
    String profileId;

    String fingerprintId;
    Date createAt;
    Date autoDeleteAt;

    public ContextSession(DateTime dateTime,String dateTimeKey,String locationCode, String userDeviceId, String ip, String host, String appId,
	    String touchpointId, String visitorId, String profileId, String fingerprintId, int hoursToDelete) {
	super();
	init(dateTime,dateTimeKey,locationCode, userDeviceId, ip, host, appId, touchpointId, visitorId, profileId, fingerprintId,
		hoursToDelete);
    }

    public ContextSession(DateTime dateTime,String dateTimeKey,String locationCode, String userDeviceId, String ip, String host, String appId,
	    String touchpointId, String visitorId, String profileId, String fingerprintId) {
	super();
	init(dateTime,dateTimeKey,locationCode, userDeviceId, ip, host, appId, touchpointId, visitorId, profileId, fingerprintId, 0);
    }

    private void init(DateTime dateTime,String dateTimeKey, String locationCode, String userDeviceId, String ip, String mediaHost, String appId,
	    String refTouchpointId, String visitorId, String profileId, String fingerprintId, int hoursToDelete) {
	this.locationCode = locationCode;
	this.userDeviceId = userDeviceId;
	this.ip = ip;
	this.mediaHost = mediaHost;
	this.appId = appId;
	this.refTouchpointId = refTouchpointId;
	this.visitorId = visitorId;
	this.profileId = profileId;
	this.fingerprintId = fingerprintId;

	
	this.createAt = dateTime.toDate();
	this.dateTimeKey = dateTimeKey;
	
	String userId = StringUtil.isEmpty(profileId) ? visitorId : profileId;
	String keyHint = locationCode + userDeviceId + ip + mediaHost + appId + userId + fingerprintId + dateTime.getMillis();
	this.sessionKey = FriendlyId.toFriendlyId(UUID.nameUUIDFromBytes(keyHint.getBytes()));
	
	if (hoursToDelete > HOURS_OF_A_WEEK) {
	    this.autoDeleteAt = dateTime.plusHours(hoursToDelete).toDate();
	} else {
	    this.autoDeleteAt = dateTime.plusHours(HOURS_OF_A_WEEK).toDate();
	}
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

    public String getMediaHost() {
	return mediaHost;
    }

    public void setMediaHost(String mediaHost) {
	this.mediaHost = mediaHost;
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

    public String getDateTimeKey() {
	return dateTimeKey;
    }

    public String getLocationCode() {
	return locationCode;
    }

}
