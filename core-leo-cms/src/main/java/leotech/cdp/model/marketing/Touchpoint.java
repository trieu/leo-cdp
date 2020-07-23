package leotech.cdp.model.marketing;

import java.util.Arrays;
import java.util.Date;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.model.FulltextIndexOptions;
import com.arangodb.model.GeoIndexOptions;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import rfx.core.util.StringUtil;

/**
 * @author Trieu Nguyen
 * 
 *         A touchpoint can be defined as any way a consumer can interact with a
 *         business, whether it be person-to-person, through a website, an app
 *         or any form of communication
 *
 */
public class Touchpoint extends MediaChannel {

	public static final String COLLECTION_NAME = COLLECTION_PREFIX + Touchpoint.class.getSimpleName().toLowerCase();
	static ArangoCollection instance;

	@Override
	public ArangoCollection getCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = cdpDbInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			instance.ensureFulltextIndex(Arrays.asList("name"), new FulltextIndexOptions());
			instance.ensurePersistentIndex(Arrays.asList("url"), new PersistentIndexOptions().unique(false));

			instance.ensurePersistentIndex(Arrays.asList("collectionId"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("parentId"), new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("locationCode"),
					new PersistentIndexOptions().unique(false));
			instance.ensureHashIndex(Arrays.asList("keywords[*]"), new HashIndexOptions());
			instance.ensureGeoIndex(Arrays.asList("latitude", "longitude"), new GeoIndexOptions());
		}
		return instance;
	}

	@Expose
	String collectionId = "";// IAB-17 or category topics ...

	@Expose
	String parentId = "";

	@Expose
	double unitCost = 0;

	@Expose
	int partitionId;

	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(this.name) && this.type >= 0
				&& (StringUtil.isNotEmpty(this.url) || StringUtil.isNotEmpty(this.locationCode));
	}

	////////////////

	public Touchpoint() {
		// TODO Auto-generated constructor stub

	}

	/**
	 * for online touch-point from internal API
	 * 
	 * @param name
	 * @param type
	 * @param isOwnedMedia
	 * @param url
	 * @param collectionId
	 */
	public Touchpoint(String name, int type, String url) {
		super();
		this.createdAt = new Date();
		this.name = name;
		this.type = type;
		this.url = url;
		String keyHint = type + url;
		this.id = id(keyHint);
	}

	/**
	 * for online touch-point from public API
	 * 
	 * @param name
	 * @param type
	 * @param isOwnedMedia
	 * @param url
	 * @param collectionId
	 */
	public Touchpoint(int type, String url) {
		super();
		this.createdAt = new Date();
		this.name = "Web";
		this.type = type;
		this.url = url;
		String keyHint = type + url;
		this.id = id(keyHint);
	}

	/**
	 * for offline touch-point
	 * 
	 * @param name
	 * @param type
	 * @param isOwnedMedia
	 * @param locationCode
	 * @param address
	 * @param collectionId
	 */
	public Touchpoint(String name, int type, String locationCode, String address, double latitude,
			double longitude) {
		super();
		this.createdAt = new Date();
		this.name = name;
		this.type = type;
		this.locationCode = locationCode;
		this.address = address;
		this.latitude = latitude;
		this.longitude = longitude;
		String keyHint = type + locationCode + name;
		this.id = id(keyHint);
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

	public double getUnitCost() {
		return unitCost;
	}

	public void setUnitCost(double unitCost) {
		this.unitCost = unitCost;
	}

	public int getPartitionId() {
		return partitionId;
	}

	public void setPartitionId(int partitionId) {
		this.partitionId = partitionId;
	}

}
