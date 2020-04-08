package leotech.cdp.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.FulltextIndexOptions;
import com.arangodb.model.GeoIndexOptions;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.system.util.database.ArangoDbUtil;

/**
 * @author Trieu Nguyen
 * 
 *         A touchpoint can be defined as any way a consumer can interact with a
 *         business, whether it be person-to-person, through a website, an app
 *         or any form of communication
 *
 */
public class Touchpoint extends CdpPersistentObject implements Comparable<Touchpoint> {

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
	    instance.ensureHashIndex(Arrays.asList("keywords[*]"), new HashIndexOptions());
	    instance.ensureHashIndex(Arrays.asList("locationCode"), new HashIndexOptions());
	    instance.ensureGeoIndex(Arrays.asList("latitude", "longitude"), new GeoIndexOptions());
	}
	return instance;
    }

    @DocumentField(Type.KEY)
    @Expose
    private String key;

    @Expose
    String name;

    @Expose
    int type;

    @Expose
    boolean isMediaSrc = false;

    @Expose
    Date createdAt = new Date();

    @Expose
    int status;

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
    float latitude = 0;

    @Expose
    float longitude = 0;

    @Expose
    float radius = 0;

    @Expose
    float reachableArea = 0;

    @Expose
    List<String> keywords = new ArrayList<>();

    @Expose
    String collectionId;

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
	// TODO Auto-generated method stub
	return false;
    }

    @Override
    public int compareTo(Touchpoint o) {
	// TODO Auto-generated method stub
	return 0;
    }

    ////////////////
    
    public Touchpoint() {
	// TODO Auto-generated constructor stub
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

    public float getLatitude() {
	return latitude;
    }

    public void setLatitude(float latitude) {
	this.latitude = latitude;
    }

    public float getLongitude() {
	return longitude;
    }

    public void setLongitude(float longitude) {
	this.longitude = longitude;
    }

    public float getRadius() {
	return radius;
    }

    public void setRadius(float radius) {
	this.radius = radius;
    }

    public float getReachableArea() {
	return reachableArea;
    }

    public void setReachableArea(float reachableArea) {
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
