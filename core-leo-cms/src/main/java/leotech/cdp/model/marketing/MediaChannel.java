package leotech.cdp.model.marketing;

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

import leotech.cdp.model.CdpPersistentObject;
import rfx.core.util.StringUtil;
public class MediaChannel extends CdpPersistentObject {

	public static final String COLLECTION_NAME = getCollectionName(MediaChannel.class);
	static ArangoCollection instance;

	@Override
	public ArangoCollection getCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = cdpDbInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			instance.ensureFulltextIndex(Arrays.asList("name"), new FulltextIndexOptions());
			instance.ensurePersistentIndex(Arrays.asList("url"), new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("type"), new PersistentIndexOptions().unique(false));

			instance.ensurePersistentIndex(Arrays.asList("countryCode"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("locationCode"),
					new PersistentIndexOptions().unique(false));
			instance.ensureGeoIndex(Arrays.asList("latitude", "longitude"), new GeoIndexOptions());
			instance.ensureHashIndex(Arrays.asList("keywords[*]"), new HashIndexOptions());
		}
		return instance;
	}

	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(this.name) && this.type >= 0
				&& (StringUtil.isNotEmpty(this.url) || StringUtil.isNotEmpty(this.locationCode));
	}

	@DocumentField(Type.KEY)
	@Expose
	protected String id;
	@Expose
	protected String name;
	@Expose
	protected int type = MediaChannelType.UNKNOWN;
	@Expose
	protected boolean isOwnedMedia = true;
	@Expose
	protected Date createdAt;
	@Expose
	Date updatedAt;
	@Expose
	protected int status = 0;
	@Expose
	protected String url = "";
	@Expose
	protected String thumbnailUrl = "";
	@Expose
	protected String countryCode = "";
	@Expose
	protected String locationCode = "";
	@Expose
	protected String address = "";
	@Expose
	protected double latitude = 0;
	@Expose
	protected double longitude = 0;
	@Expose
	protected double radius = 0;
	@Expose
	protected double reachableArea = 0;
	@Expose
	protected List<String> keywords = new ArrayList<>();

	public MediaChannel() {
		super();
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

	public boolean isOwnedMedia() {
		return isOwnedMedia;
	}

	public void setOwnedMedia(boolean isOwnedMedia) {
		this.isOwnedMedia = isOwnedMedia;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
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

}