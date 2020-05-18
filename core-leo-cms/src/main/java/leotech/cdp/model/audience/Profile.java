package leotech.cdp.model.audience;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;
import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.StringUtil;

/**
 * @author Trieu Nguyen (Thomas)
 * 
 *         the entity for storing human profile information
 *
 */
public class Profile extends CdpPersistentObject implements Comparable<Profile> {

	public static class ProfileType {
		public final static int ANONYMOUS = 0;
		public final static int IDENTIFIED = 1;
		public final static int CRM_USER = 2;
		public final static int DMP_USER = 3;
		public final static int KOL_USER = 4;
		public final static int VIP_USER = 5;
	}

	public static final String COLLECTION_NAME = COLLECTION_PREFIX + Profile.class.getSimpleName().toLowerCase();
	static ArangoCollection instance;

	@Override
	public ArangoCollection getCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = ArangoDbUtil.getActiveArangoDbInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			instance.ensurePersistentIndex(Arrays.asList("primaryEmail"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("primaryPhone"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("primaryAvatar"),
					new PersistentIndexOptions().unique(false));
			instance.ensureHashIndex(Arrays.asList("rootProfileId"), new HashIndexOptions());
			instance.ensurePersistentIndex(Arrays.asList("identities[*]"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("usedDeviceIds[*]"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("sessionKeys[*]"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("inSegments[*]"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("top1000Touchpoints[*]"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("inCollections[*]"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("visitorId"),
					new PersistentIndexOptions().unique(false));
			instance.ensureHashIndex(Arrays.asList("personaUri"), new HashIndexOptions());
		}
		return instance;
	}

	@DocumentField(Type.KEY)
	@Expose
	String id;

	@Expose
	int type = ProfileType.ANONYMOUS;

	@Expose
	Set<String> identities = new HashSet<>(100);

	@Expose
	Date createdAt = new Date();

	// the main ID after Identity Resolution process
	@Expose
	String rootProfileId = "";

	@Expose
	Set<String> inCollections = new HashSet<String>(10);

	@Expose
	Set<String> inSegments = new HashSet<String>(20);

	@Expose
	Set<String> inJourneyMaps = new HashSet<String>(20);

	@Expose
	Set<String> top1000Touchpoints = new HashSet<String>(1000);

	@Expose
	int status = 1;

	@Expose
	String lastObserverId = "unknown";

	@Expose
	String lastTouchpointId = "";

	@Expose
	String lastChannelId = "";

	@Expose
	String lastSeenIp = "";

	@Expose
	String lastUsedDeviceId = "";

	@Expose
	String lastWebCookies = "";

	@Expose
	String visitorId = "";

	@Expose
	String firstName = "";
	
	@Expose
	String lastName = "";
	
	@Expose
	String primaryUsername = "";
	
	@Expose
	String primaryEmail = "";

	@Expose
	String primaryPhone = "";

	@Expose
	String primaryAvatar = "";

	@Expose
	int gender = 0;

	@Expose
	int age = 0;

	@Expose
	int genderProbability = 50;

	@Expose
	int ageGroup = 0;

	@Expose
	Set<String> usedDeviceIds = new HashSet<>(10);

	@Expose
	Set<String> workingHistory = new HashSet<>(20);

	@Expose
	Map<String, Integer> referrerChannels = new HashMap<>(20);

	@Expose
	List<String> viewedContents = new ArrayList<String>(100);

	@Expose
	Map<String, String> personalAttributes = new HashMap<>(30);

	@Expose
	Map<String, String> socialMediaProfiles = new HashMap<>(10);

	@Expose
	Map<String, String> personalContacts = new HashMap<>(10);

	@Expose
	Map<String, Integer> weeklyMobileUsage = new HashMap<>(7);

	@Expose
	Map<String, Integer> mediaInterests = new HashMap<>(20);

	@Expose
	Map<String, Integer> personalInterests = new HashMap<>(20);

	@Expose
	Map<String, String> subscribedChannels = new HashMap<>(100);

	@Expose
	Set<String> businessTransactions = new HashSet<String>();

	@Expose
	Set<String> supportHistory = new HashSet<String>();

	@Expose
	int socialCreditScore = 0;

	@Expose
	int satisfactionScore = 0;

	@Expose
	int totalCAC = 0;

	@Expose
	int totalCLV = 0;

	@Expose
	Date updatedAt;

	@Expose
	int mergeCode = 0;

	@Expose
	String personaUri = "";

	@Expose
	int partitionId = 0;
	
	@Expose
	Map<String, Map<String,String>> extData = new HashMap<>();
	
	@Expose
	Map<String, Map<String,String>> predictionMetrics = new HashMap<>();

	@Override
	public int compareTo(Profile o) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public boolean isReadyForSave() {
		return this.id != null && this.lastObserverId != null && this.lastUsedDeviceId != null && this.lastTouchpointId != null && this.identities.size()>0;
	}

	public Profile() {
	}
	
	public Profile(String primaryUsername) {
		this.primaryUsername = primaryUsername;
		if (StringUtil.isNotEmpty(primaryUsername)) {
			this.identities.add(primaryUsername);
		}
	}

	protected void initBaseInformation(int partitionId, String visitorId, int type,
			String observerId, String lastTouchpointId, String lastSeenIp, String usedDeviceId, String email,
			String phone, String fingerprintId) {
		// hash for unique id key

		this.partitionId = partitionId;
		this.type = type;

		this.lastObserverId = observerId;
		this.lastTouchpointId = lastTouchpointId;
		this.top1000Touchpoints.add(lastTouchpointId);
		this.lastSeenIp = lastSeenIp;
		this.lastUsedDeviceId = usedDeviceId;

		System.out.println("initBaseInformation visitorId " + visitorId);
		this.visitorId = visitorId;
		this.primaryEmail = email;
		this.primaryPhone = phone;

		// add 4 primary identity data for indexing
		if (StringUtil.isNotEmpty(visitorId)) {
			this.identities.add(visitorId);
		}
		if (StringUtil.isNotEmpty(email)) {
			this.identities.add(email);
		}
		if (StringUtil.isNotEmpty(phone)) {
			this.identities.add(phone);
		}
		if (StringUtil.isNotEmpty(fingerprintId)) {
			this.identities.add(fingerprintId);
		}

		// add secondary identity usedDeviceIds for indexing
		if (StringUtil.isNotEmpty(usedDeviceId)) {
			this.usedDeviceIds.add(usedDeviceId);
		}

		this.id = buildProfileId(type, visitorId, usedDeviceId, email, phone, fingerprintId, partitionId);
	}

	public final static String buildProfileId(int type, String visitorId, String usedDeviceId, String email,
			String phone, String fingerprintId, int partitionId) {
		if (StringUtil.isNotEmpty(visitorId) || StringUtil.isNotEmpty(usedDeviceId)) {
			String keyHint = type + visitorId + usedDeviceId + email + phone + fingerprintId + partitionId;
			return id(keyHint);
		}
		throw new IllegalArgumentException("visitorId or usedDeviceId must not be empty");
	}

	/**
	 * new IDENTIFIED profile with email
	 * 
	 * @param sessionKey
	 * @param visitorId
	 * @param observerId
	 * @param lastTouchpointId
	 * @param lastSeenIp
	 * @param usedDeviceId
	 * @param email
	 * @return
	 */
	public static Profile newIdentifiedProfile( String observerId, String lastTouchpointId,
			String lastSeenIp, String visitorId, String usedDeviceId, String email, String fingerprintId) {
		Profile p = new Profile();
		p.initBaseInformation(0, visitorId, ProfileType.IDENTIFIED, observerId, lastTouchpointId,
				lastSeenIp, usedDeviceId, email, "", fingerprintId);
		return p;
	}

	/**
	 * new CRM_USER profile with email and phone
	 * 
	 * @param sessionKey
	 * @param visitorId
	 * @param observerId
	 * @param lastTouchpointId
	 * @param lastSeenIp
	 * @param usedDeviceId
	 * @param email
	 * @param phone
	 * @return
	 */
	public static Profile newCrmProfile( String observerId, String lastTouchpointId,
			String lastSeenIp, String visitorId, String usedDeviceId, String email, String phone,
			String fingerprintId) {
		Profile p = new Profile();
		p.initBaseInformation(0, visitorId, ProfileType.CRM_USER, observerId, lastTouchpointId,
				lastSeenIp, usedDeviceId, email, phone, fingerprintId);
		return p;
	}

	/**
	 * new ANONYMOUS profile for web or app tracking
	 * 
	 * @param observerId
	 * @param lastTouchpointId
	 * @param lastSeenIp
	 * @param usedDeviceId
	 */
	public static Profile newAnonymousProfile( String observerId, String lastTouchpointId,
			String lastSeenIp, String visitorId, String usedDeviceId, String fingerprintId) {
		Profile p = new Profile();
		p.initBaseInformation(0,  visitorId, ProfileType.ANONYMOUS, observerId, lastTouchpointId,
				lastSeenIp, usedDeviceId, "", "", fingerprintId);
		return p;
	}

	// -- getter and setter methods --

	public int getType() {
		return type;
	}

	public String getId() {
		return id;
	}

	public void setType(int type) {
		this.type = type;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getRootProfileId() {
		return rootProfileId;
	}

	public void setRootProfileId(String rootProfileId) {
		this.rootProfileId = rootProfileId;
	}

	public Set<String> getInSegments() {
		return inSegments;
	}

	public void setInSegments(Set<String> inSegments) {
		this.inSegments = inSegments;
	}

	public Set<String> getInJourneyMaps() {
		return inJourneyMaps;
	}

	public void setInJourneyMaps(Set<String> inJourneyMaps) {
		this.inJourneyMaps = inJourneyMaps;
	}

	public Set<String> getTop1000Touchpoints() {
		return top1000Touchpoints;
	}

	
	public void engageAtTouchpoint(String atTouchpointId) {
		if(this.top1000Touchpoints.size()<1000) {
			this.top1000Touchpoints.add(atTouchpointId);
		}
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getLastObserverId() {
		return lastObserverId;
	}

	public void setLastObserverId(String observerId) {
		this.lastObserverId = observerId;
	}

	public String getLastTouchpointId() {
		return lastTouchpointId;
	}

	public void setLastTouchpointId(String lastTouchpointId) {
		this.lastTouchpointId = lastTouchpointId;
	}

	public String getLastChannelId() {
		return lastChannelId;
	}

	public void setLastChannelId(String lastChannelId) {
		this.lastChannelId = lastChannelId;
	}

	public String getLastSeenIp() {
		return lastSeenIp;
	}

	public void setLastSeenIp(String lastSeenIp) {
		this.lastSeenIp = lastSeenIp;
	}

	public String getLastUsedDeviceId() {
		return lastUsedDeviceId;
	}

	public void setLastUsedDeviceId(String lastUsedDeviceId) {
		this.lastUsedDeviceId = lastUsedDeviceId;
	}

	public Set<String> getIdentities() {
		return identities;
	}

	public void setIdentities(Set<String> identities) {
		this.identities = identities;
	}

	public void setIdentity(String identity) {
		if (StringUtil.isNotEmpty(identity)) {
			this.identities.add(identity);
		}
	}

	public void setIdentity(String loginId, String loginProvider) {
		if (StringUtil.isNotEmpty(loginId) && StringUtil.isNotEmpty(loginProvider)) {
			this.identities.add(loginId + "#" + loginProvider);
		}
	}

	public String getPrimaryEmail() {
		return primaryEmail;
	}

	public void setPrimaryEmail(String primaryEmail) {
		this.primaryEmail = primaryEmail;
		if (this.type == ProfileType.ANONYMOUS) {
			this.type = ProfileType.IDENTIFIED;
		}
	}

	public String getPrimaryPhone() {
		return primaryPhone;
	}

	public void setPrimaryPhone(String primaryPhone) {
		this.primaryPhone = primaryPhone;
		if (this.type == ProfileType.ANONYMOUS) {
			this.type = ProfileType.IDENTIFIED;
		}
	}

	public String getPrimaryAvatar() {
		return primaryAvatar;
	}

	public void setPrimaryAvatar(String primaryAvatar) {
		this.primaryAvatar = primaryAvatar;
	}

	public int getGenderProbability() {
		return genderProbability;
	}

	public void setGenderProbability(int genderProbability) {
		this.genderProbability = genderProbability;
	}

	public int getAgeGroup() {
		return ageGroup;
	}

	public void setAgeGroup(int ageGroup) {
		this.ageGroup = ageGroup;
	}

	public Set<String> getUsedDeviceIds() {
		return usedDeviceIds;
	}

	public void setUsedDeviceIds(Set<String> usedDeviceIds) {
		this.usedDeviceIds = usedDeviceIds;
	}

	public Map<String, Integer> getMediaInterests() {
		return mediaInterests;
	}

	public void setMediaInterests(Map<String, Integer> mediaInterests) {
		this.mediaInterests = mediaInterests;
	}

	public Map<String, String> getPersonalAttributes() {
		return personalAttributes;
	}

	public void setPersonalAttributes(Map<String, String> personalAttributes) {
		this.personalAttributes = personalAttributes;
	}

	public Map<String, String> getSocialMediaProfiles() {
		return socialMediaProfiles;
	}

	public void setSocialMediaProfiles(Map<String, String> socialMediaProfiles) {
		this.socialMediaProfiles = socialMediaProfiles;
	}

	public Map<String, String> getPersonalContacts() {
		return personalContacts;
	}

	public void setPersonalContacts(Map<String, String> personalContacts) {
		this.personalContacts = personalContacts;
	}

	public Map<String, Integer> getPersonalInterests() {
		return personalInterests;
	}

	public void setPersonalInterests(Map<String, Integer> personalInterests) {
		this.personalInterests = personalInterests;
	}

	public Map<String, String> getSubscribedChannels() {
		return subscribedChannels;
	}

	public void setSubscribedChannels(Map<String, String> subscribedChannels) {
		this.subscribedChannels = subscribedChannels;
	}

	public int getSocialCreditScore() {
		return socialCreditScore;
	}

	public void setSocialCreditScore(int socialCreditScore) {
		this.socialCreditScore = socialCreditScore;
	}

	public int getSatisfactionScore() {
		return satisfactionScore;
	}

	public void setSatisfactionScore(int satisfactionScore) {
		this.satisfactionScore = satisfactionScore;
	}

	public int getTotalCAC() {
		return totalCAC;
	}

	public void setTotalCAC(int totalCAC) {
		this.totalCAC = totalCAC;
	}

	public int getTotalCLV() {
		return totalCLV;
	}

	public void setTotalCLV(int totalCLV) {
		this.totalCLV = totalCLV;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}

	public int getMergeCode() {
		return mergeCode;
	}

	public void setMergeCode(int mergeCode) {
		this.mergeCode = mergeCode;
	}

	public String getPersonaUri() {
		return personaUri;
	}

	public void setPersonaUri(String personaUri) {
		this.personaUri = personaUri;
	}

	public int getPartitionId() {
		return partitionId;
	}

	public void setPartitionId(int partitionId) {
		this.partitionId = partitionId;
	}

	public int getGender() {
		return gender;
	}

	public void setGender(int gender) {
		this.gender = gender;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public Set<String> getWorkingHistory() {
		return workingHistory;
	}

	public void setWorkingHistory(Set<String> workingHistory) {
		this.workingHistory = workingHistory;
	}

	public List<String> getViewedContents() {
		return viewedContents;
	}

	public void setViewedContents(List<String> viewedContents) {
		this.viewedContents = viewedContents;
	}

	public Map<String, Integer> getWeeklyMobileUsage() {
		return weeklyMobileUsage;
	}

	public void setWeeklyMobileUsage(Map<String, Integer> weeklyMobileUsage) {
		this.weeklyMobileUsage = weeklyMobileUsage;
	}

	public Set<String> getBusinessTransactions() {
		return businessTransactions;
	}

	public void setBusinessTransactions(Set<String> businessTransactions) {
		this.businessTransactions = businessTransactions;
	}

	public Set<String> getSupportHistory() {
		return supportHistory;
	}

	public void setSupportHistory(Set<String> supportHistory) {
		this.supportHistory = supportHistory;
	}

	public Set<String> getInCollections() {
		return inCollections;
	}

	public void setInCollections(Set<String> inCollections) {
		this.inCollections = inCollections;
	}

	public Map<String, Integer> getReferrerChannels() {
		return referrerChannels;
	}

	public void setReferrerChannels(Map<String, Integer> referrerChannels) {
		this.referrerChannels = referrerChannels;
	}

	public void updateReferrerChannel(String channel) {
		if (StringUtil.isNotEmpty(channel)) {
			int count = referrerChannels.getOrDefault(channel, 0) + 1;
			referrerChannels.put(channel, count);
		}
	}

	public String getLastWebCookies() {
		return lastWebCookies;
	}

	public void setLastWebCookies(String lastWebCookies) {
		this.lastWebCookies = lastWebCookies;
	}

	public String getVisitorId() {
		return visitorId;
	}

	public void setVisitorId(String visitorId) {
		this.visitorId = visitorId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getPrimaryUsername() {
		return primaryUsername;
	}

	public void setPrimaryUsername(String primaryUsername) {
		this.primaryUsername = primaryUsername;
	}
	
	@Override
	public String toString() {
		return StringUtil.join(this.identities.toArray(),"-");
	}

}
