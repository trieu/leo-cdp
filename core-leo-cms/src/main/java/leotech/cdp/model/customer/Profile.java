package leotech.cdp.model.customer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.FulltextIndexOptions;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;
import rfx.core.util.StringUtil;

/**
 * 
 * general entity for storing customer data profile information
 * 
 * @author Trieu Nguyen (Thomas)
 * @since 2019
 *
 */
public class Profile extends CdpPersistentObject implements Comparable<Profile> {
	
	public static final int MERGED_BY_EMAIL = 101;
	public static final int STATUS_REMOVED = -4;
	public static final int STATUS_INVALID = -1;
	public static final int STATUS_MERGED = 0;
	public static final int STATUS_ACTIVE = 1;

	public static final String COLLECTION_NAME = getCollectionName(Profile.class);
	static ArangoCollection dbCol;

	@Override
	public ArangoCollection getDbCollection() {
		if (dbCol == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			dbCol = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			dbCol.ensureHashIndex(Arrays.asList("rootProfileId"), new HashIndexOptions());
			dbCol.ensurePersistentIndex(Arrays.asList("visitorId"),new PersistentIndexOptions().unique(false));
			dbCol.ensurePersistentIndex(Arrays.asList("type"), new PersistentIndexOptions().unique(false));
			
			dbCol.ensureFulltextIndex(Arrays.asList("firstName"), new FulltextIndexOptions().inBackground(true).minLength(2) );
			dbCol.ensureFulltextIndex(Arrays.asList("lastName"), new FulltextIndexOptions().inBackground(true).minLength(2) );

			dbCol.ensurePersistentIndex(Arrays.asList("primaryEmail"),new PersistentIndexOptions().unique(false));
			dbCol.ensurePersistentIndex(Arrays.asList("primaryPhone"),new PersistentIndexOptions().unique(false));
			dbCol.ensurePersistentIndex(Arrays.asList("crmRefId"), new PersistentIndexOptions().unique(false));

			dbCol.ensurePersistentIndex(Arrays.asList("lastChannelId"),new PersistentIndexOptions().unique(false));
			dbCol.ensurePersistentIndex(Arrays.asList("lastSeenIp"), new PersistentIndexOptions().unique(false));
			dbCol.ensurePersistentIndex(Arrays.asList("lastTouchpointId"),new PersistentIndexOptions().unique(false));
			dbCol.ensurePersistentIndex(Arrays.asList("lastUsedDeviceId"), new PersistentIndexOptions().unique(false));

			dbCol.ensurePersistentIndex(Arrays.asList("identities[*]"),new PersistentIndexOptions().unique(false));
			
			dbCol.ensurePersistentIndex(Arrays.asList("usedDeviceIds[*]"),new PersistentIndexOptions().unique(false));
			
			dbCol.ensurePersistentIndex(Arrays.asList("funnelStage"),new PersistentIndexOptions().unique(false));
			dbCol.ensurePersistentIndex(Arrays.asList("behavioralEvents[*]"),new PersistentIndexOptions().unique(false));
			dbCol.ensurePersistentIndex(Arrays.asList("locationCode"),new PersistentIndexOptions().unique(false));

			dbCol.ensurePersistentIndex(Arrays.asList("topEngagedTouchpointIds[*]"),new PersistentIndexOptions().unique(false));
			
			dbCol.ensurePersistentIndex(Arrays.asList("inSegments[*]"),new PersistentIndexOptions().unique(false));
			dbCol.ensurePersistentIndex(Arrays.asList("inCollections[*]"),new PersistentIndexOptions().unique(false));
			dbCol.ensurePersistentIndex(Arrays.asList("inJourneyMaps[*]"),new PersistentIndexOptions().unique(false));

			dbCol.ensureHashIndex(Arrays.asList("personaUri"), new HashIndexOptions());
		}
		return dbCol;
	}

	@DocumentField(Type.KEY)
	@Expose
	protected String id;

	// the main ID after Identity Resolution processing
	@Expose
	String rootProfileId = "";

	@Expose
	protected String visitorId = "";

	@Expose
	protected String crmRefId = "";

	@Expose
	protected Set<String> identities = new HashSet<>(50);

	@Expose
	protected int type = ProfileType.TYPE_ANONYMOUS;

	@Expose
	protected String schemaType = ProfileSchema.SCHEMA_TYPE_GENERAL;

	@Expose
	protected int mergeCode = 0;

	@Expose
	protected String personaUri = "";

	@Expose
	protected Date createdAt = new Date();

	@Expose
	protected Date updatedAt ;

	// --- BEGIN taxonomy meta data

	@Expose
	protected int status = STATUS_ACTIVE;

	@Expose
	protected Set<String> inCollections = new HashSet<String>(100);

	@Expose
	protected Set<String> inSegments = new HashSet<String>(100);

	@Expose
	protected Set<String> inJourneyMaps = new HashSet<String>(100);

	// --- END taxonomy meta data

	// --- BEGIN metadata of business engagement

	@Expose
	protected Set<String> topEngagedTouchpointIds = new HashSet<String>(1000);

	@Expose
	protected String lastObserverId = ProfileType.UNKNOWN;

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

	// --- END metadata of business engagement

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
	protected Map<String, Set<String>> notificationUserIds = new HashMap<>(20); // for web push and app push

	@Expose
	protected Map<String, String> businessContacts = new HashMap<>(10);

	@Expose
	protected Map<String, String> socialMediaProfiles = new HashMap<>(10);

	@Expose
	protected Map<String, String> extPersonalAttributes = new HashMap<>(50);

	// --- END key Personal attributes
	
	
	// --- BEGIN Marketing Data Model , inputed by Marketer
	
	@Expose
	protected int receiveNotification = 0;
	
	@Expose
	protected int receiveEmail = 0;
	
	@Expose
	protected int receiveMobileSms = 0;

	@Expose
	protected Set<String> personalProblems = new HashSet<>(20);

	@Expose
	protected Set<String> personalInterests = new HashSet<>(20);

	@Expose
	protected Set<String> ideasForBusiness = new HashSet<>(20);

	@Expose
	protected Set<String> solutionsForCustomer = new HashSet<>(20);

	@Expose
	protected Set<String> mediaChannels = new HashSet<>(30);

	@Expose
	protected Set<String> contentKeywords = new HashSet<>(50);

	// --- END Marketing Data Model
	

	// --- BEGIN Business Data Model

	@Expose
	protected Map<String, Set<String>> businessData = new HashMap<>();

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
	

	// --- BEGIN Quantitative Data Metrics

	@Expose
	protected int totalDataQualityScore = 0;

	// sum of all score from BehavioralEventMetric data
	@Expose
	protected int totalLeadScore = 0; 

	@Expose
	protected int totalCreditScore = 0;
	
	/**
	 * Customer Feedback Score: can be positive or negative
	 */
	@Expose
	protected int totalCFS = 0;

	// Customer Satisfaction Score
	@Expose
	protected int totalCSAT = 0; 

	// Customer Acquisition Cost
	@Expose
	protected int totalCAC = 0; 

	// Customer Lifetime Value
	@Expose
	protected int totalCLV = 0; 

	// Customer Effort Score
	@Expose
	protected int totalCES = 0; 

	// Net Promoter Score
	@Expose
	protected int totalNPS = 0; 
	
	@Expose
	// summary view of statistics from Profile Analytics Jobs
	Map<String,Long> eventStatistics = new ConcurrentHashMap<>();
	
	@Expose
	// the timeline of first-time recorded event metrics
	// E.g: {"content-view": "2020-05-05T02:56:12.102Z", "play_prvideo" : "2020-05-06T02:56:12.102Z" }
	protected Map<String,Date> funnelStageTimeline = new ConcurrentHashMap<>();
	
	@Expose
	// all recorded event metric names ["content-view","product-view"]
	protected Set<String> behavioralEvents = new HashSet<String>(100);
	
	@Expose
	// current name of funnel stage: Prospective Customer or Engaged Visitor or First-time Customer
	protected String funnelStage = "";
	
	@Expose
	protected Map<String, Map<String, Integer>> predictionMetrics = new HashMap<>();

	// --- END Quantitative Data Metrics

	// when the database has more than 500,000 profile, need a good partitioning strategy
	@Expose
	protected int partitionId = 0;
	
	@Expose
	protected int dataContext = 1; // 1 is production data context, 0 is testing only, -1 is fake data
	
	

	@Override
	public int compareTo(Profile o) {
		if(this.getTotalValue() > o.getTotalValue()) {
			return 1;
		}
		else if(this.getTotalValue() < o.getTotalValue()) {
			return -1;
		}
		return 0;
	}

	@Override
	public boolean isReadyForSave() {
		return this.id != null && this.lastObserverId != null && this.lastUsedDeviceId != null
				&& this.lastTouchpointId != null && this.identities.size() > 0;
	}

	public Profile() {}

	public Profile(String primaryUsername) {
		this.primaryUsername = primaryUsername;
		if (StringUtil.isNotEmpty(primaryUsername)) {
			this.identities.add(primaryUsername);
		}
	}

	protected void initBaseInformation(int partitionId, String visitorId, int type, String observerId,
			String lastTouchpointId, String lastSeenIp, String usedDeviceId, String email, String phone,
			String fingerprintId, String crmRefId) {
		// hash for unique id key
		this.partitionId = partitionId;
		this.type = type;

		this.lastObserverId = observerId;

		if (StringUtil.isNotEmpty(lastTouchpointId)) {
			this.lastTouchpointId = lastTouchpointId;
			this.topEngagedTouchpointIds.add(lastTouchpointId);
		}

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
	public static Profile newIdentifiedProfile(String observerId, String lastTouchpointId, String lastSeenIp,
			String visitorId, String usedDeviceId, String email, String fingerprintId) {
		Profile p = new Profile();
		p.initBaseInformation(0, visitorId, ProfileType.TYPE_IDENTIFIED, observerId, lastTouchpointId,
				lastSeenIp, usedDeviceId, email, "", fingerprintId, "");
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
		p.initBaseInformation(0, "", ProfileType.TYPE_CRM_CONTACT, observerId, "", "", "", email, phone, "",
				crmRefId);
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
	public static Profile newSocialLoginProfile(String observerId, String visitorId, String firstName,
			String lastName, String email, String refId, String source) {
		Profile p = new Profile();
		p.initBaseInformation(0, visitorId, ProfileType.TYPE_SOCIAL_LOGIN, observerId, "", "", "", email, "","", "");
		p.setFirstName(firstName);
		p.setLastName(lastName);
		p.setSocialMediaProfile(source, refId);
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
	public static Profile newAnonymousProfile(String observerId, String lastTouchpointId, String lastSeenIp,
			String visitorId, String usedDeviceId, String fingerprintId) {
		Profile p = new Profile();
		p.initBaseInformation(0, visitorId, ProfileType.TYPE_ANONYMOUS, observerId, lastTouchpointId,
				lastSeenIp, usedDeviceId, "", "", fingerprintId, "");
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
		if (this.topEngagedTouchpointIds.size() < 1000 && StringUtil.isNotEmpty(atTouchpointId)) {
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

	public void addIdentityData(String identity) {
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
		this.receiveEmail = 1;
		if (this.type == ProfileType.TYPE_ANONYMOUS) {
			this.type = ProfileType.TYPE_IDENTIFIED;
		}
	}

	public String getPrimaryPhone() {
		return primaryPhone;
	}

	public void setPrimaryPhone(String primaryPhone) {
		this.primaryPhone = primaryPhone;
		this.receiveMobileSms = 1;
		if (this.type == ProfileType.TYPE_ANONYMOUS) {
			this.type = ProfileType.TYPE_IDENTIFIED;
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
	
	public void setUsedDeviceId(String usedDeviceId) {
		this.usedDeviceIds.add(usedDeviceId);
		this.lastUsedDeviceId = usedDeviceId;
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

	public void setSocialMediaProfile(String source, String id) {
		this.socialMediaProfiles.put(source, id);
	}
	
	public Map<String, Set<String>> getNotificationUserIds() {
		return notificationUserIds;
	}

	public void setNotificationUserIds(Map<String, Set<String>> notificationUserIds) {
		this.notificationUserIds = notificationUserIds;
		this.receiveNotification = 1;
	}
	
	public Set<String> getNotificationUserIdsByProvider(String provider) {
		return notificationUserIds.getOrDefault(provider, new HashSet<String>(0));
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

	public int getTotalDataQualityScore() {
		return totalDataQualityScore;
	}

	public void setTotalDataQualityScore(int totalDataQualityScore) {
		this.totalDataQualityScore = totalDataQualityScore;
	}

	public Map<String, Map<String, Integer>> getPredictionMetrics() {
		return predictionMetrics;
	}

	public void setPredictionMetrics(Map<String, Map<String, Integer>> predictionMetrics) {
		this.predictionMetrics = predictionMetrics;
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

	// 0: Female, 1: Male, 2: LGBT, 3: Lesbian, 4: Gay, 5: Bisexual, 6: Transgender, 7: Unknown
	public void setGender(int gender) {
		if (gender >= 0 && gender <= 7) {
			this.gender = gender;
			setGenderProbability(100);
		}
	}
	
	public void setGender(String genderStr) {
		System.out.println("setGender " + genderStr);
		String s = genderStr.toLowerCase();
		int gender = 7;
		
		if ("female".equals(s)) {
			gender = 0;
		} 
		else if ("male".equals(s)) {
			gender = 1;
		} 
		else if ("lgbt".equals(s)) {
			gender = 2;
		} 
		else if ("lesbian".equals(s)) {
			gender = 3;
		} 
		else if ("gay".equals(s)) {
			gender = 4;
		}
		else if ("bisexual".equals(s)) {
			gender = 5;
		}
		else if ("transgender".equals(s)) {
			gender = 6;
		}
		
		if (gender >= 0 && gender <= 7) {
			this.gender = gender;
			setGenderProbability(100);
			System.out.println("this.gender " + this.gender);
		}
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

	public String getSchemaType() {
		return schemaType;
	}

	public void setSchemaType(String schemaType) {
		this.schemaType = schemaType;
	}

	public Set<String> getContentKeywords() {
		return contentKeywords;
	}

	public void setContentKeywords(Set<String> contentKeywords) {
		this.contentKeywords = contentKeywords;
	}

	public String getFunnelStage() {
		return funnelStage;
	}

	/**
	 * update current funnel stage of customer
	 * 
	 * @param funnelStage
	 */
	public void setFunnelStage(String funnelStage) {
		this.funnelStage = funnelStage;
	}

	public Map<String, Set<String>> getBusinessData() {
		return businessData;
	}

	public void setBusinessData(Map<String, Set<String>> businessData) {
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

	public int getTotalLeadScore() {
		return totalLeadScore;
	}

	public void setTotalLeadScore(int totalLeadScore) {
		this.totalLeadScore = totalLeadScore;
	}

	public int getTotalCreditScore() {
		return totalCreditScore;
	}

	public void setTotalCreditScore(int totalCreditScore) {
		this.totalCreditScore = totalCreditScore;
	}

	public int getTotalCFS() {
		return totalCFS;
	}

	public void setTotalCFS(int totalCFS) {
		this.totalCFS = totalCFS;
	}
	

	public boolean isReceiveNotification() {
		return receiveNotification == 1;
	}
	
	public int getReceiveNotification() {
		return receiveNotification;
	}

	public void setReceiveNotification(int receiveNotification) {
		this.receiveNotification = receiveNotification;
	}

	public boolean isReceiveEmail() {
		return receiveEmail == 1;
	}
	
	public int getReceiveEmail() {
		return receiveEmail;
	}

	public void setReceiveEmail(int receiveEmail) {
		this.receiveEmail = receiveEmail;
	}

	public boolean isReceiveMobileSms() {
		return receiveMobileSms == 1;
	}
	
	public int getReceiveMobileSms() {
		return receiveMobileSms;
	}

	public void setReceiveMobileSms(int receiveMobileSms) {
		this.receiveMobileSms = receiveMobileSms;
	}

	/**
	 * 
	 * @return Customer Satisfaction Score
	 */
	public int getTotalCSAT() {
		return totalCSAT;
	}

	/**
	 * Customer Satisfaction Score
	 * 
	 * @param totalCSAT
	 */
	public void setTotalCSAT(int totalCSAT) {
		this.totalCSAT = totalCSAT;
	}

	/**
	 * @return Customer Effort Score
	 */
	public int getTotalCES() {
		return totalCES;
	}

	/**
	 * Customer Effort Score
	 * 
	 * @param totalCES
	 */
	public void setTotalCES(int totalCES) {
		this.totalCES = totalCES;
	}

	public int getTotalNPS() {
		return totalNPS;
	}

	public void setTotalNPS(int totalNPS) {
		this.totalNPS = totalNPS;
	}
	
	public long getTotalValue() {
		long total = this.totalDataQualityScore + this.totalLeadScore + this.totalCreditScore + this.totalCLV;
		return total;
	}
	
	
	public Map<String, Long> getEventStatistics() {
		if(eventStatistics == null) {
			eventStatistics = new HashMap<String, Long>(0);
		}
		return eventStatistics;
	}

	public void setEventStatistics(Map<String, Long> totalEventStatistics) {
		this.eventStatistics = totalEventStatistics;
	}
	
	public void updateEventCount(String eventName) {
		long c = this.eventStatistics.getOrDefault(eventName, 0L) + 1;
		this.eventStatistics.put(eventName, c);
	}
	
	public void resetEventCount(String eventName) {
		this.eventStatistics.put(eventName, 0L);
	}
	
	public void resetEventStatistics() {
		this.eventStatistics.clear();
	}
	
	public Set<String> getBehavioralEvents() {
		return behavioralEvents;
	}

	public void setBehavioralEvents(Set<String> behavioralEvents) {
		this.behavioralEvents = behavioralEvents;
	}
	
	public void setBehavioralEvent(String eventName) {
		this.behavioralEvents.add(eventName);
	}
	
	public void resetBehavioralEvent() {
		this.behavioralEvents.clear();
	}

	public Map<String, Date> getFunnelStageTimeline() {
		return funnelStageTimeline;
	}

	public void setFunnelStageTimeline(Map<String, Date> funnelStageTimeline) {
		this.funnelStageTimeline = funnelStageTimeline;
	}
	
	public void updateFunnelStageTimeline(String funnelStageName, Date date) {
		if(! this.funnelStageTimeline.containsKey(funnelStageName) ) {
			this.funnelStageTimeline.put(funnelStageName, date);
		}
	}
	
	public void resetFunnelStageTimeline() {
		this.funnelStageTimeline.clear();
	}

	public int getDataContext() {
		return dataContext;
	}

	public void setDataContext(int dataContext) {
		this.dataContext = dataContext;
	}

	@Override
	public String toString() {
		return StringUtil.join(this.identities.toArray(), "-");
	}

}
