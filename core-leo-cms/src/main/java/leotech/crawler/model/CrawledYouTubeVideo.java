package leotech.crawler.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.FulltextIndexOptions;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.Gson;

import leotech.cms.model.common.PersistentArangoObject;
import leotech.system.util.database.ArangoDbUtil;

public class CrawledYouTubeVideo implements Comparable<CrawledYouTubeVideo>, PersistentArangoObject {

    @DocumentField(Type.KEY)
    protected String key;
    
    String videoID;
    String title;
    String url;

    String description;
    long publishedAt;
    long modificationTime;
    
    String thumbnailUrl;
    String channelId;
    String channelTitle;

    List<String> topicCategories;
    List<String> keywords;
    SocialStatistics socialStatistics;

    public CrawledYouTubeVideo() {
    }

    public CrawledYouTubeVideo(String videoID, String title, String description, long publishedAt, String thumbnailUrl, String url, String channelId, String channelTitle) {
	super();
	this.videoID = videoID;
	this.title = title;
	this.description = description;
	this.publishedAt = publishedAt;
	this.thumbnailUrl = thumbnailUrl;
	this.url = url;
	this.channelId = channelId;
	this.channelTitle = channelTitle;
    }
    
    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getVideoID() {
	return videoID;
    }

    public void setVideoID(String videoID) {
	this.videoID = videoID;
    }

    public String getTitle() {
	return title;
    }

    public void setTitle(String title) {
	this.title = title;
    }
    

    public String getDescription() {
	return description;
    }

    public void setDescription(String description) {
	this.description = description;
    }

    public long getPublishedAt() {
	return publishedAt;
    }

    public void setPublishedAt(long publishedAt) {
	this.publishedAt = publishedAt;
    }

    public String getThumbnailUrl() {
	return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
	this.thumbnailUrl = thumbnailUrl;
    }

    public String getUrl() {
	return url;
    }

    public void setUrl(String fullUrl) {
	this.url = fullUrl;
    }

    public String getChannelId() {
	return channelId;
    }

    public void setChannelId(String channelId) {
	this.channelId = channelId;
    }

    public String getChannelTitle() {
	return channelTitle;
    }

    public void setChannelTitle(String channelTitle) {
	this.channelTitle = channelTitle;
    }
    
    public long getModificationTime() {
        return modificationTime;
    }

    public void setModificationTime(long modificationTime) {
        this.modificationTime = modificationTime;
    }

    public SocialStatistics getSocialStatistics() {
	if (socialStatistics == null) {
	    socialStatistics = new SocialStatistics(0, 0, 0, 0);
	}
	return socialStatistics;
    }

    public void setSocialStatistics(SocialStatistics socialStatistics) {
	this.socialStatistics = socialStatistics;
    }

    public List<String> getTopicCategories() {
	if (topicCategories == null) {
	    this.topicCategories = new ArrayList<>(0);
	}
	return topicCategories;
    }

    public void setTopicCategories(List<String> topicCategories) {
	this.topicCategories = topicCategories != null ? topicCategories : new ArrayList<>(0);
    }
    
    

    public List<String> getKeywords() {
	if (keywords == null) {
	    this.keywords = new ArrayList<>(0);
	}
        return keywords;
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
    }

    @Override
    public int compareTo(CrawledYouTubeVideo o) {
	// TODO compute the rank score here
	long totalScore2 = o.getSocialStatistics().totalScore();
	long totalScore1 = this.getSocialStatistics().totalScore();
	if (totalScore2 > totalScore1) {
	    return 1;
	} else if (totalScore2 < totalScore1) {
	    return -1;
	}
	return 0;
    }

    @Override
    public String toString() {
	return new Gson().toJson(this);
    }

    public static final String COLLECTION_NAME = CrawledYouTubeVideo.class.getSimpleName().toLowerCase();
    static ArangoCollection collectionInstance;

    @Override
    public ArangoCollection getCollection() {
	if (collectionInstance == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getActiveArangoDbInstance();

	    collectionInstance = arangoDatabase.collection(COLLECTION_NAME);

	    // ensure indexing key fields
	    collectionInstance.ensurePersistentIndex(Arrays.asList("videoID"), new PersistentIndexOptions().unique(true));
	    collectionInstance.ensureFulltextIndex(Arrays.asList("title"), new FulltextIndexOptions().minLength(5));
	    collectionInstance.ensureHashIndex(Arrays.asList("url"), new HashIndexOptions().unique(true));

	}
	return collectionInstance;
    }

    @Override
    public boolean isReadyForSave() {
	return title != null && videoID != null && url != null;
    }
}
