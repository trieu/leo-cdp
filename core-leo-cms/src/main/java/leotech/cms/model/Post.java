package leotech.cms.model;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDBException;

import leotech.cms.model.common.ContentType;
import leotech.cms.model.common.MediaNode;

/**
 * @author Trieu
 * 
 *
 */
public class Post extends MediaNode {
    
    long viewCount = 0;
    int likeCount = 0;

    public Post() {
	// for JSON decode from ArangoDB
    }

    public Post(String id, String title, String mediaInfo, long networkId, String ownerId) {
	super(id, title, mediaInfo, networkId, ContentType.HTML_TEXT, ownerId);
    }

    public Post(String title, String mediaInfo, long networkId, String ownerId) {
	super(title, mediaInfo, networkId, ContentType.HTML_TEXT, ownerId);
    }

    public Post(String title, String mediaInfo, long networkId, int type, String ownerId) {
	super(title, mediaInfo, networkId, type, ownerId);
    }

    public Post(String title, String mediaInfo, long networkId, int type, String pageId, String categoryKey, String ownerId) {
	super(title, mediaInfo, networkId, type, pageId, categoryKey, ownerId);
    }

    public static final String COLLECTION_NAME = Post.class.getSimpleName().toLowerCase();
    static ArangoCollection collectionInstance;

    @Override
    public ArangoCollection getCollection() throws ArangoDBException {
	return theCollection();
    }

    public static ArangoCollection theCollection() throws ArangoDBException {
	return getCollection(collectionInstance, COLLECTION_NAME);
    }

    public static List<Post> sortBy(List<Post> list) {
	Collections.sort(list, new Comparator<Post>() {
	    @Override
	    public int compare(Post o1, Post o2) {
		if (o1.getModificationTime() > o2.getModificationTime()) {
		    return 1;
		} else if (o1.getModificationTime() < o2.getModificationTime()) {
		    return -1;
		}
		return 0;
	    }
	});
	return list;
    }

    public long getViewCount() {
        return viewCount;
    }

    public void setViewCount(long viewCount) {
        this.viewCount = viewCount;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }

  

}
