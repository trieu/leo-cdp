package leotech.cms.model.common;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDBException;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.FulltextIndexOptions;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.github.slugify.Slugify;
import com.google.gson.annotations.Expose;

import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.StringUtil;

public abstract class TaxonomyNode extends CmsPersistentObject {

	@DocumentField(Type.KEY)
	@Expose
	private String key;

	@Expose
	String name;

	@Expose
	String description;

	@Expose
	String parentId;

	@Expose
	String headlineImageUrl = "";

	@Expose
	long creationTime;

	@Expose
	long modificationTime;

	@Expose
	int navigationOrder = 0;// for the order of display in menu

	@Expose
	String slug = ""; // for SEO friendly

	long networkId = 0; // the content network ID

	int privacyStatus = 0;// 0: public, 1: protected or -1: private

	List<String> viewerIds = new ArrayList<>();

	@Expose
	Map<String, String> customData = new HashMap<>();

	protected TaxonomyNode() {
	}

	public TaxonomyNode(String name, long networkId) {
		super();
		initRequiredData(name, networkId);
		this.description = "";
		this.parentId = "";
	}

	public void initRequiredData(String name, long networkId) {
		this.name = name;
		this.networkId = networkId;
		this.slug = networkId + "-" + new Slugify().slugify(name);
		this.creationTime = System.currentTimeMillis();
		this.modificationTime = System.currentTimeMillis();
	}

	protected static ArangoCollection getCollection(ArangoCollection collection, String colName)
			throws ArangoDBException {
		if (collection == null) {
			ArangoDatabase arangoDatabase = ArangoDbUtil.getActiveArangoDbInstance();

			collection = arangoDatabase.collection(colName);

			// ensure indexing key fields
			collection.ensureFulltextIndex(Arrays.asList("name"), new FulltextIndexOptions().minLength(5));
			collection.ensurePersistentIndex(Arrays.asList("slug"), new PersistentIndexOptions().unique(true));
			collection.ensureHashIndex(Arrays.asList("parentId"), new HashIndexOptions());
			collection.ensureHashIndex(Arrays.asList("networkId"), new HashIndexOptions());
		}
		return collection;
	}

	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(name) && networkId > 0 && StringUtil.isNotEmpty(this.slug);
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getHeadlineImageUrl() {
		return headlineImageUrl;
	}

	public void setHeadlineImageUrl(String headlineImageUrl) {
		this.headlineImageUrl = headlineImageUrl;
	}

	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}

	public long getNetworkId() {
		return networkId;
	}

	public void setNetworkId(int networkId) {
		this.networkId = networkId;
	}

	public long getCreationTime() {
		return creationTime;
	}

	public void setCreationTime(long creationTime) {
		this.creationTime = creationTime;
	}

	public long getModificationTime() {
		return modificationTime;
	}

	public void setModificationTime(long modificationTime) {
		this.modificationTime = modificationTime;
	}

	public int getPrivacyStatus() {
		return privacyStatus;
	}

	public void setPrivacyStatus(int privacyStatus) {
		this.privacyStatus = privacyStatus;
	}

	public List<String> getViewerIds() {
		return viewerIds;
	}

	public void setViewerIds(List<String> viewerIds) {
		this.viewerIds = viewerIds;
	}

	public Map<String, String> getCustomData() {
		return customData;
	}

	public void setCustomData(Map<String, String> customData) {
		this.customData = customData;
	}

	public int getNavigationOrder() {
		return navigationOrder;
	}

	public void setNavigationOrder(int navigationOrder) {
		this.navigationOrder = navigationOrder;
	}

}
