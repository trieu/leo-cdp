package leotech.cdp.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.FulltextIndexOptions;
import com.arangodb.model.GeoIndexOptions;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.devskiller.friendly_id.FriendlyId;
import com.google.gson.annotations.Expose;

import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.StringUtil;

/**
 * @author Trieu Nguyen
 * 
 *         A touchpoint can be defined as any way a consumer can interact with a
 *         business, whether it be person-to-person, through a website, an app
 *         or any form of communication
 *
 */
public class Touchpoint extends CdpPersistentObject  {

    public static final class TouchpointType {
	public static final int ECOMMERCE_PLATFORM = 1;
	public static final int WEBSITE = 2;
	public static final int MOBILE_APP = 3;
	public static final int SMART_TV_APP = 4;
	public static final int IOT_APP = 5;
	public static final int OTT_APP = 6;
	public static final int SOCIAL_MEDIA_PLATFORM = 7;
	public static final int URBAN_MARKET = 8;
	public static final int RETAIL_STORE = 9;
	public static final int TRADITIONAL_TV = 10;

	public static final int SHOPPING_MALL = 11;
	public static final int COFFEE_SHOP = 12;
	public static final int CONFERENCE_HALL = 13;
	public static final int URBAN_PARK = 14;
	public static final int OFFICE_BUILDING = 15;
	public static final int EXPERIENCE_SPACE = 16;
	public static final int OUTDOOR_PR_EVENT = 17;
	public static final int BILLBOARD_OUTDOOR = 18;
	public static final int BILLBOARD_INDOOR = 19;
	public static final int TRANSIT_MEDIA = 20;
	public static final int SPORTING_EVENT = 21;

	public static final int KEY_OPINION_LEADER = 22;
    }

    public static final String COLLECTION_NAME = COLLECTION_PREFIX + Touchpoint.class.getSimpleName().toLowerCase();
    static ArangoCollection instance;

    @Override
    public ArangoCollection getCollection() {
	if (instance == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getArangoDatabase();

	    instance = arangoDatabase.collection(COLLECTION_NAME);

	    // ensure indexing key fields for fast lookup
	    instance.ensureFulltextIndex(Arrays.asList("name"), new FulltextIndexOptions());
	    instance.ensurePersistentIndex(Arrays.asList("url"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("primaryPhone"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("collectionId"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("parentId"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("locationCode"), new PersistentIndexOptions().unique(false));
	    instance.ensureHashIndex(Arrays.asList("keywords[*]"), new HashIndexOptions());
	    instance.ensureGeoIndex(Arrays.asList("latitude", "longitude"), new GeoIndexOptions());
	}
	return instance;
    }

    @DocumentField(Type.KEY)
    @Expose
    private String key;

    @Expose
    String id;

    @Expose
    String name;

    @Expose
    int type = -1;

    @Expose
    boolean isMediaSrc = false;

    @Expose
    Date createdAt;

    @Expose
    int status = 0;

    @Expose
    String url;
    
    @Expose
    String thumbnailUrl;

    @Expose
    String countryCode;

    @Expose
    String locationCode;

    @Expose
    String address;

    @Expose
    double latitude = 0;

    @Expose
    double longitude = 0;

    @Expose
    double radius = 0;

    @Expose
    double reachableArea = 0;

    @Expose
    List<String> keywords = new ArrayList<>();

    @Expose
    String collectionId = "";

    @Expose
    String parentId;

    @Expose
    int unitCost = 0;

    @Expose
    Date updatedAt;

    @Expose
    int partitionId;

    @Override
    public boolean isReadyForSave() {
	return StringUtil.isNotEmpty(this.name) && this.type >=0 && (StringUtil.isNotEmpty(this.url) || StringUtil.isNotEmpty(this.locationCode));
    }

    

    ////////////////

    public Touchpoint() {
	// TODO Auto-generated constructor stub
	
    }

    /**
     * for online touch-point
     * 
     * @param name
     * @param type
     * @param isMediaSrc
     * @param url
     * @param collectionId
     */
    public Touchpoint(String name, int type, String url) {
	super();
	this.createdAt = new Date();
	this.name = name;
	this.type = type;
	this.url = url;
	String keyHint = name + type + url;
	this.id = id(keyHint);
    }

    /**
     * for offline touch-point
     * 
     * @param name
     * @param type
     * @param isMediaSrc
     * @param locationCode
     * @param address
     * @param collectionId
     */
    public Touchpoint(String name, int type, String locationCode, String address, double latitude, double longitude) {
	super();
	this.createdAt = new Date();
	this.name = name;
	this.type = type;
	this.locationCode = locationCode;
	this.address = address;
	this.latitude = latitude;
	this.longitude = longitude;
	String keyHint = name + type + locationCode;
	this.id = id(keyHint);
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

    public boolean isMediaSrc() {
	return isMediaSrc;
    }

    public void setMediaSrc(boolean isMediaSrc) {
	this.isMediaSrc = isMediaSrc;
    }

    public Date getCreatedAt() {
	return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
	this.createdAt = createdAt;
    }

    public int getStatus() {
	return status;
    }

    public void setStatus(int status) {
	this.status = status;
    }

    public String getUrl() {
	return url;
    }

    public void setUrl(String url) {
	this.url = url;
    }

    public String getThumbnailUrl() {
	return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
	this.thumbnailUrl = thumbnailUrl;
    }

    public String getCountryCode() {
	return countryCode;
    }

    public void setCountryCode(String countryCode) {
	this.countryCode = countryCode;
    }

    public String getLocationCode() {
	return locationCode;
    }

    public void setLocationCode(String locationCode) {
	this.locationCode = locationCode;
    }

    public String getAddress() {
	return address;
    }

    public void setAddress(String address) {
	this.address = address;
    }

    public double getLatitude() {
	return latitude;
    }

    public void setLatitude(double latitude) {
	this.latitude = latitude;
    }

    public double getLongitude() {
	return longitude;
    }

    public void setLongitude(double longitude) {
	this.longitude = longitude;
    }

    public double getRadius() {
	return radius;
    }

    public void setRadius(double radius) {
	this.radius = radius;
    }

    public double getReachableArea() {
	return reachableArea;
    }

    public void setReachableArea(double reachableArea) {
	this.reachableArea = reachableArea;
    }

    public List<String> getKeywords() {
	return keywords;
    }

    public void setKeywords(List<String> keywords) {
	this.keywords = keywords;
    }

    public String getCollectionId() {
	return collectionId;
    }

    public void setCollectionId(String collectionId) {
	this.collectionId = collectionId;
    }

    public String getParentId() {
	return parentId;
    }

    public void setParentId(String parentId) {
	this.parentId = parentId;
    }

    public int getUnitCost() {
	return unitCost;
    }

    public void setUnitCost(int unitCost) {
	this.unitCost = unitCost;
    }

    public Date getUpdatedAt() {
	return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
	this.updatedAt = updatedAt;
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

}
