package leotech.cdp.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.devskiller.friendly_id.FriendlyId;
import com.google.gson.annotations.Expose;

import leotech.system.util.database.ArangoDbUtil;

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
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getArangoDatabase();

	    instance = arangoDatabase.collection(COLLECTION_NAME);

	    // ensure indexing key fields for fast lookup
	    instance.ensurePersistentIndex(Arrays.asList("id"), new PersistentIndexOptions().unique(true));
	    instance.ensurePersistentIndex(Arrays.asList("primaryEmail"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("primaryPhone"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("primaryAvatar"), new PersistentIndexOptions().unique(false));
	    instance.ensureHashIndex(Arrays.asList("rootProfileId"), new HashIndexOptions());
	    instance.ensurePersistentIndex(Arrays.asList("identities[*]"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("sessionKeys[*]"), new PersistentIndexOptions().unique(false));
	    instance.ensureHashIndex(Arrays.asList("personaUri"), new HashIndexOptions());
	}
	return instance;
    }

    @DocumentField(Type.KEY)
    @Expose
    private String key;

    @Expose
    String id;

    @Expose
    int type = ProfileType.ANONYMOUS;

    @Expose
    Date createdAt = new Date();

    @Expose
    String collectionId = "";

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
    Set<String> atTouchpoints = new HashSet<String>(100);

    @Expose
    int status = 1;

    @Expose
    String observerId = "unknown";

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
    Set<String> identities = new HashSet<>(100);
    
    @Expose
    Set<String> sessionKeys = new HashSet<>(100);

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
    Map<String, Integer> acquisitionChannels = new HashMap<>(20);

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

    @Override
    public int compareTo(Profile o) {
	// TODO Auto-generated method stub
	return 0;
    }

    @Override
    public boolean isReadyForSave() {
	return this.observerId != null && this.lastUsedDeviceId != null && this.lastTouchpointId != null;
    }
    
    public Profile() {
    }

    protected void initBaseInformation(String ctxSessionKey, String visitorId, int type, String observerId,
	    String lastTouchpointId, String lastSeenIp, String usedDeviceId, String email, String phone) {
	this.sessionKeys.add(ctxSessionKey);
	this.identities.add(visitorId);
	this.type = type;
	this.observerId = observerId;
	this.lastTouchpointId = lastTouchpointId;
	this.atTouchpoints.add(lastTouchpointId);
	this.lastSeenIp = lastSeenIp;
	this.lastUsedDeviceId = usedDeviceId;
	this.usedDeviceIds.add(usedDeviceId);
	this.primaryEmail = email;
	this.primaryPhone = phone;
	this.id = buildProfileId(type, observerId, lastTouchpointId, lastSeenIp, usedDeviceId, email, phone);
    }

    public static String buildProfileId(int type, String observerId, String lastTouchpointId, String lastSeenIp,String usedDeviceId, String email, String phone) {
	String keyHint = type + observerId + lastTouchpointId + lastSeenIp + usedDeviceId + email + phone;
	return id(keyHint);
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
    public static Profile newIdentifiedProfile(String ctxSessionKey, String visitorId, String observerId, String lastTouchpointId,
	    String lastSeenIp, String usedDeviceId, String email) {
	Profile p = new Profile();
	p.initBaseInformation(ctxSessionKey, visitorId,ProfileType.IDENTIFIED, observerId, lastTouchpointId, lastSeenIp, usedDeviceId, email,"");
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
    public static Profile newCrmProfile(String ctxSessionKey, String visitorId,  String observerId, String lastTouchpointId,
	    String lastSeenIp, String usedDeviceId, String email, String phone) {
	Profile p = new Profile();
	p.initBaseInformation(ctxSessionKey, visitorId, ProfileType.CRM_USER, observerId, lastTouchpointId, lastSeenIp, usedDeviceId, email,phone);
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
    public static Profile newAnonymousProfile(String ctxSessionKey, String visitorId, String observerId, String lastTouchpointId, String lastSeenIp,
	    String usedDeviceId) {
	Profile p = new Profile();
	p.initBaseInformation(ctxSessionKey, visitorId, ProfileType.ANONYMOUS, observerId, lastTouchpointId, lastSeenIp,usedDeviceId, "", "");
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

    public String getCollectionId() {
	return collectionId;
    }

    public void setCollectionId(String collectionId) {
	this.collectionId = collectionId;
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

    public Set<String> getAtTouchpoints() {
	return atTouchpoints;
    }

    public void setAtTouchpoints(Set<String> atTouchpoints) {
	this.atTouchpoints = atTouchpoints;
    }

    public int getStatus() {
	return status;
    }

    public void setStatus(int status) {
	this.status = status;
    }

    public String getObserverId() {
	return observerId;
    }

    public void setObserverId(String observerId) {
	this.observerId = observerId;
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

    public Set<String> getSessionKeys() {
        return sessionKeys;
    }

    public void setSessionKeys(Set<String> sessionKeys) {
        this.sessionKeys = sessionKeys;
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

    public String getKey() {
	return key;
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

    public Map<String, Integer> getAcquisitionChannels() {
	return acquisitionChannels;
    }

    public void setAcquisitionChannels(Map<String, Integer> acquisitionChannels) {
	this.acquisitionChannels = acquisitionChannels;
    }

    public String getLastWebCookies() {
	return lastWebCookies;
    }

    public void setLastWebCookies(String lastWebCookies) {
	this.lastWebCookies = lastWebCookies;
    }

}
