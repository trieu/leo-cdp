package leotech.cdp.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.system.util.database.ArangoDbUtil;

/**
 * @author Trieu Nguyen (Thomas)
 * 
 *  the entity for storing human profile information
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
	    instance.ensureHashIndex(Arrays.asList("identityAttributes[*]"), new HashIndexOptions());
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
    List<String> inCollections = new ArrayList<String>(10);

    @Expose
    List<String> inSegments = new ArrayList<String>(20);

    @Expose
    List<String> inJourneyMaps = new ArrayList<String>(20);

    @Expose
    List<String> atTouchpoints = new ArrayList<String>(100);

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
    String lastUsedDevice = "";

    @Expose
    String lastWebCookies = "";

    @Expose
    Map<String, String> identityAttributes = new HashMap<>(10);

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
    List<String> usedDevices = new ArrayList<>(10);

    @Expose
    List<String> workingHistory = new ArrayList<>(20);

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
    List<String> businessTransactions = new ArrayList<String>();

    @Expose
    List<String> supportHistory = new ArrayList<String>();

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
	
	return this.observerId != null && this.lastUsedDevice != null && this.lastTouchpointId != null;
    }

    public Profile(int type, String observerId, String lastTouchpointId, String lastSeenIp, String usedDevice) {
	super();
	this.type = type;
	this.observerId = observerId;
	this.lastTouchpointId = lastTouchpointId;
	this.lastSeenIp = lastSeenIp;
	this.lastUsedDevice = usedDevice;
	this.usedDevices.add(usedDevice);
    }

    public Profile(String observerId, String lastTouchpointId, String lastSeenIp, String usedDevice) {
	super();
	this.observerId = observerId;
	this.lastTouchpointId = lastTouchpointId;
	this.lastSeenIp = lastSeenIp;
	this.lastUsedDevice = usedDevice;
	this.usedDevices.add(usedDevice);
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

    public List<String> getInSegments() {
	return inSegments;
    }

    public void setInSegments(List<String> inSegments) {
	this.inSegments = inSegments;
    }

    public List<String> getInJourneyMaps() {
	return inJourneyMaps;
    }

    public void setInJourneyMaps(List<String> inJourneyMaps) {
	this.inJourneyMaps = inJourneyMaps;
    }

    public List<String> getAtTouchpoints() {
	return atTouchpoints;
    }

    public void setAtTouchpoints(List<String> atTouchpoints) {
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

    public String getLastUsedDevice() {
	return lastUsedDevice;
    }

    public void setLastUsedDevice(String lastUsedDevice) {
	this.lastUsedDevice = lastUsedDevice;
    }

    public Map<String, String> getIdentityAttributes() {
	return identityAttributes;
    }

    public void setIdentityAttributes(Map<String, String> identityAttributes) {
	this.identityAttributes = identityAttributes;
    }

    public String getPrimaryEmail() {
	return primaryEmail;
    }

    public void setPrimaryEmail(String primaryEmail) {
	this.primaryEmail = primaryEmail;
	if(this.type == ProfileType.ANONYMOUS) {
	    this.type = ProfileType.IDENTIFIED;
	}
    }

    public String getPrimaryPhone() {
	return primaryPhone;
    }

    public void setPrimaryPhone(String primaryPhone) {
	this.primaryPhone = primaryPhone;
	if(this.type == ProfileType.ANONYMOUS) {
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

    public List<String> getUsedDevices() {
	return usedDevices;
    }

    public void setUsedDevices(List<String> usedDevices) {
	this.usedDevices = usedDevices;
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

    public List<String> getWorkingHistory() {
	return workingHistory;
    }

    public void setWorkingHistory(List<String> workingHistory) {
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

    public List<String> getBusinessTransactions() {
	return businessTransactions;
    }

    public void setBusinessTransactions(List<String> businessTransactions) {
	this.businessTransactions = businessTransactions;
    }

    public List<String> getSupportHistory() {
	return supportHistory;
    }

    public void setSupportHistory(List<String> supportHistory) {
	this.supportHistory = supportHistory;
    }

    public List<String> getInCollections() {
	return inCollections;
    }

    public void setInCollections(List<String> inCollections) {
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