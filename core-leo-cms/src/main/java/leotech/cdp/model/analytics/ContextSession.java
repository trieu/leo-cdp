package leotech.cdp.model.analytics;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

import org.joda.time.DateTime;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.PersistentIndexOptions;
import com.arangodb.model.TtlIndexOptions;

import leotech.cdp.model.CdpPersistentObject;
import leotech.cdp.model.customer.ProfileType;
import rfx.core.util.StringUtil;

/**
 * @author Trieu Nguyen
 *
 */
public class ContextSession extends CdpPersistentObject {

	public static final String DATE_HOUR_FORMAT_PATTERN = "yyyy-MM-dd-HH";
	static final DateFormat DATEHOUR_FORMAT = new SimpleDateFormat(DATE_HOUR_FORMAT_PATTERN);
	private static final int HOURS_OF_A_WEEK = 168;

	public static final String COLLECTION_NAME = getCollectionName(ContextSession.class);
	static ArangoCollection instance;

	@Override
	public ArangoCollection getCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup

			instance.ensurePersistentIndex(Arrays.asList("userDeviceId"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("locationCode"),
					new PersistentIndexOptions().unique(false));
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
		return StringUtil.isNotEmpty(ip) && StringUtil.isNotEmpty(sessionKey)
				&& StringUtil.isNotEmpty(refTouchpointId);
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
	String refMediaHost;
	String appId;
	String refTouchpointId;
	String srcTouchpointId;
	String observerId;
	String profileId;
	String visitorId;
	int profileType = ProfileType.TYPE_ANONYMOUS;
	
	Date createAt;
	Date updatedAt;
	
	Date autoDeleteAt;
	String environment;

	public ContextSession(String observerId, DateTime dateTime, String dateTimeKey, String locationCode,
			String userDeviceId, String ip, String refMediaHost, String appId, String refTouchpointId,
			String srcTouchpointId, String profileId, int profileType, String visitorId, int hoursToDelete,
			String environment) {
		super();
		init(observerId, dateTime, dateTimeKey, locationCode, userDeviceId, ip, refMediaHost, appId, refTouchpointId,
				srcTouchpointId, profileId, profileType, visitorId, hoursToDelete, environment);
	}

	public ContextSession(String observerId, DateTime dateTime, String dateTimeKey, String locationCode,
			String userDeviceId, String ip, String refMediaHost,  String appId, String refTouchpointId,
			String srcTouchpointId, String profileId, int profileType, String visitorId, String environment) {
		super();
		init(observerId, dateTime, dateTimeKey, locationCode, userDeviceId, ip, refMediaHost, appId, refTouchpointId,
				srcTouchpointId, profileId, profileType, visitorId,  0, environment);
	}

	private void init(String observerId, DateTime dateTime, String dateTimeKey, String locationCode,
			String userDeviceId, String ip, String refMediaHost, String appId, String refTouchpointId,
			String srcTouchpointId, String profileId, int profileType, String visitorId, int hoursToDelete, String environment) {
		this.observerId = observerId;
		this.locationCode = locationCode;
		this.userDeviceId = userDeviceId;
		this.ip = ip;
		this.refMediaHost = refMediaHost;
		this.appId = appId;
		this.refTouchpointId = refTouchpointId;
		this.srcTouchpointId = srcTouchpointId;
		
		this.profileId = profileId;
		this.profileType =  profileType;
		this.visitorId = visitorId;
		
		this.environment = environment;

		this.createAt = dateTime.toDate();
		this.dateTimeKey = dateTimeKey;

		String mns = dateTime.getMinuteOfHour() < 30 ? "0" : "1";
		String keyHint =  environment + locationCode + userDeviceId + ip + appId + profileId + mns;
		this.sessionKey = id(keyHint);

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
		return refMediaHost;
	}

	public void setMediaHost(String mediaHost) {
		this.refMediaHost = mediaHost;
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

	public String getSrcTouchpointId() {
		return srcTouchpointId;
	}

	public void setSrcTouchpointId(String srcTouchpointId) {
		this.srcTouchpointId = srcTouchpointId;
	}

	
	public String getProfileId() {
		return profileId;
	}

	public void setProfileId(String profileId) {
		this.profileId = profileId;
	}

	
	public String getVisitorId() {
		return visitorId;
	}

	public void setVisitorId(String visitorId) {
		this.visitorId = visitorId;
	}

	public int getProfileType() {
		return profileType;
	}

	public void setProfileType(int profileType) {
		this.profileType = profileType;
	}

	public Date getCreateAt() {
		return createAt;
	}

	public void setCreateAt(Date createAt) {
		this.createAt = createAt;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getEnvironment() {
		return environment;
	}

	public void setEnvironment(String environment) {
		this.environment = environment;
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
	
	public void setLocationCode(String locationCode) {
		this.locationCode = locationCode;
	}

	public String getObserverId() {
		return observerId;
	}

	public void setObserverId(String observerId) {
		this.observerId = observerId;
	}


}
