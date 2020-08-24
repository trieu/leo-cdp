package leotech.cms.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeSet;

import com.arangodb.ArangoCollection;
import com.google.gson.annotations.Expose;

import leotech.cms.model.common.ContentType;
import leotech.cms.model.common.MediaNode;

public class Page extends MediaNode {
	
	public static final String COLLECTION_NAME = getCollectionName(Page.class);
	static ArangoCollection collectionInstance;

	@Expose
	@com.arangodb.velocypack.annotations.Expose(serialize = false, deserialize = false)
	SortedSet<Post> postsOfPage;

	boolean isRunByBot = false;// if true , then new Bot Subscriber is created
								// for this page

	@Expose
	protected Map<String, List<String>> mapContentClassKeywords = new HashMap<>(50);

	public Page() {
	}

	public Page(String title, long networkId, String categoryKey, String ownerId) {
		super(title, "", networkId, ContentType.HTML_TEXT, ownerId);
		this.categoryKeys.add(categoryKey);
	}

	public Page(String title, long networkId, String categoryKey, String ownerId, String mediaInfo) {
		super(title, "", networkId, ContentType.HTML_TEXT, ownerId);
		this.categoryKeys.add(categoryKey);
		this.mediaInfo = mediaInfo;
	}

	public void setPostsWithOrderByTime(List<Post> posts) {
		this.postsOfPage = new TreeSet<>();
		postsOfPage.addAll(posts);
	}



	@Override
	public ArangoCollection getCollection() {
		return getCollection(collectionInstance, COLLECTION_NAME);
	}

	public SortedSet<Post> getPostsOfPage() {
		if (postsOfPage == null) {
			postsOfPage = new TreeSet<>();
		}
		return postsOfPage;
	}

	public void setPostsOfPage(SortedSet<Post> posts) {
		this.postsOfPage = posts;
	}

	public boolean isRunByBot() {
		return isRunByBot;
	}

	public void setRunByBot(boolean isRunByBot) {
		this.isRunByBot = isRunByBot;
	}

	public Map<String, List<String>> getMapContentClassKeywords() {
		return mapContentClassKeywords;
	}

	public void clearMapContentClassKeywords() {
		this.mapContentClassKeywords.clear();
	}

	public void setMapContentClassKeywords(Map<String, List<String>> mapContentClassKeywords) {
		this.mapContentClassKeywords = mapContentClassKeywords;
	}

	public void setContentClassKeywords(String contentClass, List<String> keywords) {
		this.mapContentClassKeywords.put(contentClass, keywords);
	}

}
