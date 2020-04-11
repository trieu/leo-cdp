package leotech.cms.model.common;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

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

import leotech.cms.model.MediaInfoUnit;
import leotech.cms.model.Post;
import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.HashUtil;
import rfx.core.util.StringUtil;

/**
 * @author TrieuNT core abstract class for content persistence
 */
public abstract class MediaNode implements PersistentArangoObject, Comparable<MediaNode> {

    private static final int MAX_LENGTH_OF_SLUG = 255;

    @DocumentField(Type.KEY)
    protected String key;

    @Expose
    protected String id;

    @Expose
    protected String title;

    @Expose
    protected String contentClass = "";// class name. E.g: project, product, item, youtube-video, facebook-video ...

    @Expose
    protected String mediaInfo = "";

    @Expose
    List<MediaInfoUnit> mediaInfoUnits = new ArrayList<>();

    @Expose
    protected int status = ContentStatus.DRAFTED;

    @Expose
    protected long creationTime;

    @Expose
    protected long modificationTime;

    @Expose
    protected long publishingTime;

    @Expose
    protected long destroyedTime;

    @Expose
    protected int type = ContentType.HTML_TEXT;

    @Expose
    protected String slug = ""; // for SEO friendly, maximum 255 characters

    @Expose
    protected String headlineImageUrl = "";// default headline image about content

    @Expose
    protected String headlineVideoUrl = "";// default headline short video about content

    @Expose
    protected Map<String, String> headlineImages = new HashMap<>(20);// KEY is Image URL, VALUE is the label of image

    @Expose
    protected String description = "";// maximum 500 characters

    @Expose
    protected List<String> pageIds = new ArrayList<>(30);

    @Expose
    protected List<String> topicKeys = new ArrayList<>(20);// by user-generated

    @Expose
    protected List<String> categoryKeys = new ArrayList<>(10);// by administrator

    @Expose
    protected List<String> keywords = new ArrayList<>(100);

    @Expose
    protected long networkId = 0; // the content network ID

    @Expose
    protected String ownerId = ""; // the userId or botId

    protected int privacyStatus = 0;// 0: public, 1: protected or -1: private

    @Expose
    protected long rankingScore = 0;// for the order in ranking

    protected List<String> targetGeoLocations = new ArrayList<>();

    protected List<String> targetAudienceSegments = new ArrayList<>();

    protected List<String> viewerIds = new ArrayList<>();

    @Expose
    protected Map<String, String> customData = new HashMap<>();// custom field for extending data

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected MediaNode() {
    }

    public MediaNode(String id, String title, String mediaInfo, long networkId, int type, String ownerId) {
	super();
	if (id.startsWith(String.valueOf(networkId))) {
	    this.id = id;
	    initRequiredData(title, mediaInfo, networkId, type, ownerId);
	} else {
	    throw new IllegalArgumentException("The id must be started with networkId:" + networkId);
	}
    }

    public MediaNode(String title, String mediaInfo, long networkId, int type, String ownerId) {
	super();
	initRequiredData(title, mediaInfo, networkId, type, ownerId);
    }

    public MediaNode(String id, String title, String mediaInfo, long networkId, int type, String pageId, String categoryKey, String ownerId) {
	if (id.startsWith(String.valueOf(networkId))) {
	    this.id = id;
	    this.pageIds.add(pageId);
	    this.categoryKeys.add(categoryKey);
	    initRequiredData(title, mediaInfo, networkId, type, ownerId);
	} else {
	    throw new IllegalArgumentException("The id must be started with networkId:" + networkId);
	}
    }

    public MediaNode(String title, String mediaInfo, long networkId, int type, String pageId, String categoryKey, String ownerId) {
	initRequiredData(title, mediaInfo, networkId, type, ownerId);
	this.pageIds.add(pageId);
	this.categoryKeys.add(categoryKey);
    }

    public MediaNode(String id, String title, String mediaInfo, long networkId, int type, String pageId, String ownerId) {
	if (id.startsWith(String.valueOf(networkId))) {
	    this.id = id;
	    initRequiredData(title, mediaInfo, networkId, type, ownerId);
	    this.pageIds.add(pageId);
	} else {
	    throw new IllegalArgumentException("The id must be started with networkId:" + networkId);
	}

    }

    public MediaNode(String title, String mediaInfo, long networkId, int type, String pageId, String ownerId) {
	this.pageIds.add(pageId);
	initRequiredData(title, mediaInfo, networkId, type, ownerId);
    }

    public void initRequiredData(String title, String mediaInfo, long networkId, int type, String ownerId) {
	if (this.id == null) {
	    this.id = networkId + "-" + HashUtil.sha1(title + ownerId);
	}
	this.networkId = networkId;
	this.creationTime = System.currentTimeMillis();
	this.modificationTime = System.currentTimeMillis();
	this.title = title;
	this.mediaInfo = mediaInfo;
	this.type = type;
	this.ownerId = ownerId;

	String s = new Slugify().slugify(title);
	this.slug = s.substring(0, Math.min(s.length(), MAX_LENGTH_OF_SLUG)) + "-" + id;
    }

    public boolean isReadyForSave() {
	boolean ok = StringUtil.isNotEmpty(this.id) && networkId > 0 && StringUtil.isNotEmpty(this.slug) && StringUtil.isNotEmpty(this.title);
	if (ok) {
	    return true;
	}
	throw new IllegalArgumentException("The data is not ready, title is empty ");
    }

    public static ArangoCollection getCollection(ArangoCollection collection, String colName) throws ArangoDBException {
	if (collection == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getArangoDatabase();

	    collection = arangoDatabase.collection(colName);

	    // ensure indexing key fields
	    collection.ensurePersistentIndex(Arrays.asList("id"), new PersistentIndexOptions().unique(true));
	    collection.ensureFulltextIndex(Arrays.asList("title"), new FulltextIndexOptions().minLength(5));
	    collection.ensureHashIndex(Arrays.asList("slug"), new HashIndexOptions().unique(true));
	    collection.ensureHashIndex(Arrays.asList("ownerId"), new HashIndexOptions());
	    collection.ensureHashIndex(Arrays.asList("networkId", "contentClass"), new HashIndexOptions());
	    collection.ensureHashIndex(Arrays.asList("contentClass", "pageIds[*]"), new HashIndexOptions());
	    collection.ensureHashIndex(Arrays.asList("contentClass", "categoryIds[*]"), new HashIndexOptions());
	    collection.ensureHashIndex(Arrays.asList("networkId", "topicIds[*]"), new HashIndexOptions());

	    // array fields
	    collection.ensureHashIndex(Arrays.asList("pageIds[*]"), new HashIndexOptions());
	    collection.ensureHashIndex(Arrays.asList("topicIds[*]"), new HashIndexOptions());
	    collection.ensureHashIndex(Arrays.asList("categoryIds[*]"), new HashIndexOptions());
	    collection.ensureHashIndex(Arrays.asList("keywords[*]"), new HashIndexOptions());

	    // for content marketing with targeting
	    collection.ensureHashIndex(Arrays.asList("targetGeoLocations[*]"), new HashIndexOptions());
	    collection.ensureHashIndex(Arrays.asList("targetAudienceSegments[*]"), new HashIndexOptions());
	}
	return collection;
    }

  

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public String getKey() {
	return key;
    }

    public void setKey(String key) {
	this.key = key;
    }

    public String getId() {
	return id;
    }

    public void setId(String id) {
	this.id = id;
    }

    public String getTitle() {
	return title;
    }

    public void setTitle(String title) {
	this.title = title;
    }

    public String getMediaInfo() {
	return mediaInfo;
    }

    public void setMediaInfo(String mediaInfo) {
	this.mediaInfo = mediaInfo;
    }

    public int getStatus() {
	return status;
    }

    public void setStatus(int status) {
	this.status = status;
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

    public long getPublishingTime() {
	return publishingTime;
    }

    public void setPublishingTime(long publishingTime) {
	this.publishingTime = publishingTime;
    }

    public long getDestroyedTime() {
	return destroyedTime;
    }

    public void setDestroyedTime(long destroyedTime) {
	this.destroyedTime = destroyedTime;
    }

    public String getDescription() {
	return description;
    }

    public void setDescription(String description) {
	this.description = description;
    }

    public int getType() {
	return type;
    }

    public void setType(int type) {
	this.type = type;
    }

    public String getOwnerId() {
	return ownerId;
    }

    public void setOwnerId(String ownerId) {
	this.ownerId = ownerId;
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

    public String getSlug() {
	return slug;
    }

    public void setSlug(String slug) {
	this.slug = slug;
    }

    public String getHeadlineImageUrl() {
	if (headlineImages.size() > 0 && StringUtil.isEmpty(headlineImageUrl)) {
	    headlineImageUrl = headlineImages.get(0);
	}
	if(headlineImageUrl.startsWith("/public/uploaded-files/")) {
	    //FIXME move to configs
	    headlineImageUrl = "//xemgiday.com" + headlineImageUrl;
	}
	return headlineImageUrl;
    }

    public List<String> getKeywords() {
	return keywords;
    }

    public void clearKeywords() {
	this.keywords.clear();
    }

    public void setKeywords(List<String> keywords) {
	this.keywords = keywords;
    }

    public void setKeyword(String keyword) {
	this.keywords.add(keyword);
    }

    public long getNetworkId() {
	return networkId;
    }

    public void setNetworkId(long networkId) {
	this.networkId = networkId;
    }

    ///////////////////////////////////////////////////

    public List<String> getPageIds() {
	return pageIds;
    }

    public void setPageIds(List<String> pageIds) {
	this.pageIds = pageIds;
    }

    public void setPageId(String pageId) {
	this.pageIds.add(pageId);
    }

    public List<String> getCategoryKeys() {
	return categoryKeys;
    }

    public void setCategoryKeys(List<String> categoryKeys) {
	this.categoryKeys = categoryKeys;
    }

    public void setCategoryKey(String categoryKey) {
	this.categoryKeys.add(categoryKey);
    }

    public List<String> getTopicKeys() {
	return topicKeys;
    }

    public void setTopicKeys(List<String> topicKeys) {
	this.topicKeys = topicKeys;
    }

    public void setTopicKey(String topicKey) {
	this.topicKeys.add(topicKey);
    }

    public long getRankingScore() {
	return rankingScore;
    }

    public void setRankingScore(long rankingScore) {
	this.rankingScore = rankingScore;
    }

    public List<String> getTargetGeoLocations() {
	return targetGeoLocations;
    }

    public void setTargetGeoLocations(List<String> targetGeoLocations) {
	this.targetGeoLocations = targetGeoLocations;
    }

    public List<String> getTargetAudienceSegments() {
	return targetAudienceSegments;
    }

    public void setTargetAudienceSegments(List<String> targetAudienceSegments) {
	this.targetAudienceSegments = targetAudienceSegments;
    }

    public String getContentClass() {
	return contentClass;
    }

    public void setContentClass(String contentClass) {
	this.contentClass = contentClass;
    }

    public Map<String, String> getHeadlineImages() {
	return headlineImages;
    }

    public void setHeadlineImages(Map<String, String> headlineImages) {
	this.headlineImages.clear();
	this.headlineImages = headlineImages;
    }

    public List<MediaInfoUnit> getMediaInfoUnits() {
	return mediaInfoUnits;
    }

    public void setMediaInfoUnits(List<MediaInfoUnit> mediaInfoUnits) {
	this.mediaInfoUnits = mediaInfoUnits;
    }

    public void setMediaInfoUnit(MediaInfoUnit mediaInfoUnit) {
	this.mediaInfoUnits.add(mediaInfoUnit);
    }

    public String getHeadlineVideoUrl() {
	return headlineVideoUrl;
    }

    public void setHeadlineVideoUrl(String headlineVideoUrl) {
	this.headlineVideoUrl = headlineVideoUrl;
    }

    public void setHeadlineImageUrl(String headlineImageUrl) {
	this.headlineImageUrl = headlineImageUrl;
	if (!headlineImages.containsKey(headlineImageUrl)) {
	    headlineImages.put(headlineImageUrl, "");
	}
    }

    public void buildDefaultHeadlineImage() {
	if (headlineImages.size() > 0) {
	    String url = null;
	    Set<String> keys = this.headlineImages.keySet();
	    for (String imgUri : keys) {
		String caption = this.headlineImages.get(imgUri).trim();
		if (caption.equalsIgnoreCase("headline")) {
		    url = imgUri;
		    break;
		}
	    }
	    if (url == null) {
		url = headlineImages.keySet().iterator().next();
	    }
	    this.headlineImageUrl = url;
	}
    }

    /**
     * this method is only for Content Delivery to client
     * 
     * @param headlineOnly
     */
    public void compactDataForList(boolean headlineOnly) {

	// FIXME
	buildDefaultHeadlineImage();

	if (headlineOnly) {
	    this.mediaInfo = "";
	    if (mediaInfoUnits != null) {
		this.mediaInfoUnits.clear();
	    }
	}

	// this.title = Base64.getEncoder().encodeToString(this.title.getBytes());
	// this.description =
	// Base64.getEncoder().encodeToString(this.description.getBytes());
	//
	// this.keywords = this.keywords.stream().map(e -> {
	// return Base64.getEncoder().encodeToString(e.getBytes());
	// }).collect(Collectors.toList());
	//

	// this.headlineImages = newImages;

    }

    public boolean isEditable(String ownerId) {
	// FIXME return this.privacyStatus >= 0 || this.ownerId.equals(ownerId);
	return true;
    }

    @Override
    public int compareTo(MediaNode o2) {
	MediaNode o1 = this;
	if (o1.getModificationTime() > o2.getModificationTime()) {
	    return 1;
	} else if (o1.getModificationTime() < o2.getModificationTime()) {
	    return -1;
	}
	return 0;
    }

}
