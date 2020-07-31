package leotech.cdp.model.customer;

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
import rfx.core.util.StringUtil;

/**
 * @author Trieu Nguyen (Thomas)
 * 
 *   general data entity for storing customer profile information
 *
 */
public class Profile extends CdpPersistentObject implements Comparable<Profile> {

	

	public static final String COLLECTION_NAME = COLLECTION_PREFIX + Profile.class.getSimpleName().toLowerCase();
	static ArangoCollection dbCollection;

	@Override
	public ArangoCollection getCollection() {
		if (dbCollection == null) {
			ArangoDatabase arangoDatabase = cdpDbInstance();

			dbCollection = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			dbCollection.ensureHashIndex(Arrays.asList("rootProfileId"), new HashIndexOptions());
			dbCollection.ensurePersistentIndex(Arrays.asList("visitorId"),
					new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("type"),
					new PersistentIndexOptions().unique(false));
			
			dbCollection.ensurePersistentIndex(Arrays.asList("primaryEmail"),
					new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("primaryPhone"),
					new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("primaryAvatar"),
					new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("crmRefId"),
					new PersistentIndexOptions().unique(false));
			
			dbCollection.ensurePersistentIndex(Arrays.asList("lastChannelId"),
					new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("lastSeenIp"),
					new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("lastTouchpointId"),
					new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("lastUsedDeviceId"),
					new PersistentIndexOptions().unique(false));
			
			dbCollection.ensurePersistentIndex(Arrays.asList("identities[*]"),
					new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("usedDeviceIds[*]"),
					new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("sessionKeys[*]"),
					new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("inSegments[*]"),
					new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("funnelStage"),
					new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("locationCode"),
					new PersistentIndexOptions().unique(false));
			
			dbCollection.ensurePersistentIndex(Arrays.asList("topEngagedTouchpointIds[*]"),
					new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("inCollections[*]"),
					new PersistentIndexOptions().unique(false));
			
			dbCollection.ensureHashIndex(Arrays.asList("personaUri"), new HashIndexOptions());
		}
		return dbCollection;
	}

	@DocumentField(Type.KEY)
	@Expose
	protected String id;

	@Expose
	protected int type = ProfileType.ANONYMOUS;

	@Expose
	protected Set<String> identities = new HashSet<>(100);

	@Expose
	protected Date createdAt = new Date();
	
	@Expose
	protected Date updatedAt;

	// the main ID after Identity Resolution processing
	@Expose
	String rootProfileId = "";

	@Expose
	protected Set<String> inCollections = new HashSet<String>(10);

	@Expose
	protected Set<String> inSegments = new HashSet<String>(20);

	@Expose
	protected Set<String> inJourneyMaps = new HashSet<String>(20);

	@Expose
	protected Set<String> topEngagedTouchpointIds = new HashSet<String>(1000);

	@Expose
	protected int status = 1;

	@Expose
	protected String lastObserverId = "unknown";

	@Expose
	protected String lastTouchpointId = "";

	@Expose
	protected String lastChannelId = "";

	@Expose
	protected String lastSeenIp = "";

	@Expose
	protected String lastUsedDeviceId = "";

	@Expose
	protected String lastWebCookies = "";

	@Expose
	protected String visitorId = "";
	
	@Expose
	protected String crmRefId = "";

	// --- BEGIN key Personal attributes
	
	@Expose
	protected String firstName = "";
	
	@Expose
	protected String lastName = "";
	
	@Expose
	protected String primaryUsername = "";
	
	@Expose
	protected String primaryEmail = "";

	@Expose
	protected String primaryPhone = "";

	@Expose
	protected String primaryAvatar = "";
	
	@Expose
	protected String livingLocation = "";
	
	@Expose
	protected String locationCode = "";
	
	@Expose
	protected String mainNationality = "";

	@Expose
	protected int gender = -1;

	@Expose
	protected int age = 0;

	@Expose
	protected int genderProbability = 50;

	@Expose
	protected int ageGroup = 0;
	
	@Expose
	protected Map<String, String> personalContacts = new HashMap<>(10);
	
	@Expose
	protected Map<String, String> businessContacts = new HashMap<>(10);
	
	@Expose
	protected Map<String, String> socialMediaProfiles = new HashMap<>(10);
	
	@Expose
	protected Map<String, String> extPersonalAttributes = new HashMap<>(30);
	
	
	// --- END key Personal attributes
	
	
	// --- BEGIN Marketing Data Model
	
	@Expose
	protected Set<String> personalProblems = new HashSet<>(20);
	
	@Expose
	protected Set<String> personalInterests = new HashSet<>(20);
	
	@Expose
	protected Set<String> ideasForBusiness = new HashSet<>(20);
	
	@Expose
	protected Set<String> solutionsForCustomer  = new HashSet<>(20);
	
	@Expose
	protected Set<String> mediaChannels  = new HashSet<>(30);
	
	@Expose
	protected Set<String> marketingKeywords = new HashSet<>(50);
	
	@Expose
	protected Set<String> funnelMetrics  = new HashSet<>(20);
	
	@Expose
	protected String funnelStage = "";
	
	
	// --- END Marketing Data Model
	
	
	// --- BEGIN Business Data Model
	
	@Expose
	protected Map<String, String> businessData = new HashMap<>();
	
	@Expose
	protected Map<String, Integer> referrerChannels = new HashMap<>(50);

	@Expose
	protected Set<String> usedDeviceIds = new HashSet<>(10);

	@Expose
	protected Set<String> workingHistory = new HashSet<>(20);

	@Expose
	protected List<String> viewedContents = new ArrayList<String>(100);

	@Expose
	protected Map<String, Integer> weeklyMobileUsage = new HashMap<>(7);

	@Expose
	protected Map<String, String> subscribedChannels = new HashMap<>(100);

	@Expose
	protected Set<String> businessTransactions = new HashSet<String>();

	@Expose
	protected Set<String> supportHistory = new HashSet<String>();
	
	// --- END Business Data Model

	@Expose
	protected int dataCompletionScore = 0;
	
	@Expose
	protected int businessCreditScore = 0;

	@Expose
	protected int satisfactionScore = 0;

	@Expose
	protected int totalCAC = 0;

	@Expose
	protected int totalCLV = 0;

	

	@Expose
	protected int mergeCode = 0;

	@Expose
	protected String personaUri = "";

	@Expose
	protected int partitionId = 0;
	
	
	@Expose
	protected Map<String, Map<String,Integer>> predictionMetrics = new HashMap<>();

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
			String phone, String fingerprintId, String crmRefId) {
		// hash for unique id key

		this.partitionId = partitionId;
		this.type = type;

		this.lastObserverId = observerId;
		this.lastTouchpointId = lastTouchpointId;
		this.topEngagedTouchpointIds.add(lastTouchpointId);
		this.lastSeenIp = lastSeenIp;
		this.lastUsedDeviceId = usedDeviceId;

		this.visitorId = visitorId;
		this.crmRefId = crmRefId;
		this.primaryEmail = email;
		this.primaryPhone = phone;

		// add 5 primary identity data for indexing
		if (StringUtil.isNotEmpty(visitorId)) {
			this.identities.add(visitorId);
		}
		if (StringUtil.isNotEmpty(crmRefId)) {
			this.identities.add(crmRefId);
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
		p.initBaseInformation(0, visitorId, ProfileType.IDENTIFIED, observerId, lastTouchpointId, lastSeenIp, usedDeviceId, email, "", fingerprintId, "");
		return p;
	}

	/**
	 * new CRM_USER profile with email, phone and crm Ref ID
	 * 
	 * @param observerId
	 * @param email
	 * @param phone
	 * @param crmRefId
	 * @return
	 */
	public static Profile newCrmProfile(String observerId, String email, String phone, String crmRefId) {
		Profile p = new Profile();
		p.initBaseInformation(0, "", ProfileType.CRM_CONTACT, observerId, "", "", "", email, phone, "", crmRefId);
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
		p.initBaseInformation(0,  visitorId, ProfileType.ANONYMOUS, observerId, lastTouchpointId, lastSeenIp, usedDeviceId, "", "", fingerprintId, "");
		return p;
	}

	// -- getter and setter methods --

	public int getType() {
		return type;
	}

	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
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

	public Set<String> getTopEngagedTouchpointIds() {
		return topEngagedTouchpointIds;
	}

	public void setTopEngagedTouchpointIds(Set<String> topEngagedTouchpointIds) {
		this.topEngagedTouchpointIds = topEngagedTouchpointIds;
	}
	
	public void engageAtTouchpointId(String atTouchpointId) {
		if(this.topEngagedTouchpointIds.size()<1000) {
			this.topEngagedTouchpointIds.add(atTouchpointId);
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

	

	public Map<String, String> getExtPersonalAttributes() {
		return extPersonalAttributes;
	}

	public void setExtPersonalAttributes(Map<String, String> extPersonalAttributes) {
		this.extPersonalAttributes = extPersonalAttributes;
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

	
	public Map<String, String> getSubscribedChannels() {
		return subscribedChannels;
	}

	public void setSubscribedChannels(Map<String, String> subscribedChannels) {
		this.subscribedChannels = subscribedChannels;
	}

	public Map<String, String> getBusinessContacts() {
		return businessContacts;
	}

	public void setBusinessContacts(Map<String, String> businessContacts) {
		this.businessContacts = businessContacts;
	}

	public int getDataCompletionScore() {
		return dataCompletionScore;
	}

	public void setDataCompletionScore(int dataCompletionScore) {
		this.dataCompletionScore = dataCompletionScore;
	}

	public int getBusinessCreditScore() {
		return businessCreditScore;
	}

	public void setBusinessCreditScore(int businessCreditScore) {
		this.businessCreditScore = businessCreditScore;
	}

	

	public Map<String, Map<String, Integer>> getPredictionMetrics() {
		return predictionMetrics;
	}

	public void setPredictionMetrics(Map<String, Map<String, Integer>> predictionMetrics) {
		this.predictionMetrics = predictionMetrics;
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
	
	

	public String getLivingLocation() {
		return livingLocation;
	}

	public void setLivingLocation(String livingLocation) {
		this.livingLocation = livingLocation;
	}

	public String getLocationCode() {
		return locationCode;
	}

	public void setLocationCode(String locationCode) {
		this.locationCode = locationCode;
	}

	public String getMainNationality() {
		return mainNationality;
	}

	public void setMainNationality(String mainNationality) {
		this.mainNationality = mainNationality;
	}

	public Set<String> getPersonalProblems() {
		return personalProblems;
	}

	public void setPersonalProblems(Set<String> personalProblems) {
		this.personalProblems = personalProblems;
	}

	public Set<String> getPersonalInterests() {
		return personalInterests;
	}

	public void setPersonalInterests(Set<String> personalInterests) {
		this.personalInterests = personalInterests;
	}

	public Set<String> getIdeasForBusiness() {
		return ideasForBusiness;
	}

	public void setIdeasForBusiness(Set<String> ideasForBusiness) {
		this.ideasForBusiness = ideasForBusiness;
	}

	public Set<String> getSolutionsForCustomer() {
		return solutionsForCustomer;
	}

	public void setSolutionsForCustomer(Set<String> solutionsForCustomer) {
		this.solutionsForCustomer = solutionsForCustomer;
	}

	public Set<String> getMediaChannels() {
		return mediaChannels;
	}

	public void setMediaChannels(Set<String> mediaChannels) {
		this.mediaChannels = mediaChannels;
	}

	public Set<String> getMarketingKeywords() {
		return marketingKeywords;
	}

	public void setMarketingKeywords(Set<String> marketingKeywords) {
		this.marketingKeywords = marketingKeywords;
	}

	public Set<String> getFunnelMetrics() {
		return funnelMetrics;
	}

	public void setFunnelMetrics(Set<String> funnelMetrics) {
		this.funnelMetrics = funnelMetrics;
	}

	public String getFunnelStage() {
		return funnelStage;
	}

	public void setFunnelStage(String funnelStage) {
		this.funnelStage = funnelStage;
	}

	public Map<String, String> getBusinessData() {
		return businessData;
	}

	public void setBusinessData(Map<String, String> businessData) {
		this.businessData = businessData;
	}

	public String getCrmRefId() {
		return crmRefId;
	}

	public void setCrmRefId(String crmRefId) {
		this.crmRefId = crmRefId;
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
