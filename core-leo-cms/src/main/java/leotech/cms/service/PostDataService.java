package leotech.cms.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.MediaInfoUnit;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.Post;
import leotech.cms.model.User;
import leotech.cms.model.bot.LeoBot;
import leotech.cms.model.common.ContentType;
import leotech.crawler.model.CrawledYouTubeVideo;
import leotech.system.util.seach.LuceneSearchPostUtil;

public class PostDataService {

    // TODO add shared redis cache here

    public static int rebuildSearchIndex() throws IOException {
	File dir = new File(LuceneSearchPostUtil.LUCENE_INDEX_FOLDER_NAME);
	if (dir.isDirectory()) {
	    FileUtils.deleteDirectory(dir);
	}
	List<Post> posts = PostDaoUtil.listByNetwork(MediaNetwork.DEFAULT_ID, 0, Integer.MAX_VALUE);
	LuceneSearchPostUtil.insertPostIndex(posts);
	return posts.size();
    }

    public static String savePostInfo(CrawledYouTubeVideo tubeVideo, String ownerId, String pageId, String categoryKey) {
	String title = tubeVideo.getTitle();
	String mediaInfo = tubeVideo.getDescription();
	String videoUrl = "https://www.youtube.com/watch?v=" + tubeVideo.getVideoID();
	long networkId = MediaNetwork.DEFAULT_ID;
	int type = ContentType.HTML_TEXT;
	String contentClass = "standard";
	int privacyStatus = -1;//private
	List<String> keywords = tubeVideo.getKeywords();
	
	Post post = new Post(title, mediaInfo, networkId, type, pageId, categoryKey, ownerId);
	post.setHeadlineVideoUrl(videoUrl);
	post.setHeadlineImageUrl(tubeVideo.getThumbnailUrl());
	post.setContentClass(contentClass);
	post.setPrivacyStatus(privacyStatus);	
	post.setKeywords(keywords );
	
	String saveId = PostDaoUtil.save(post);
	if (saveId != null) {
	    LuceneSearchPostUtil.doPostIndexing(post);
	}
	return saveId;
    }

    public static String savePostInfo(JsonObject paramJson, User loginUser) {
	String ownerId = loginUser.getKey();
	String postId = paramJson.getString("postId", "");
	String pageId = paramJson.getString("pageId", "");
	String categoryKey = paramJson.getString("categoryKey", "");
	String title = paramJson.getString("title", "");
	String mediaInfo = paramJson.getString("mediaInfo", "");
	int type = paramJson.getInteger("type", ContentType.HTML_TEXT);

	// TODO need validate and check security data

	Post post;
	boolean updateData = false;
	if (postId.isEmpty()) {
	    // create new content
	    long networkId = MediaNetwork.DEFAULT_ID;
	    post = new Post(title, mediaInfo, networkId, type, pageId, categoryKey, ownerId);
	    System.out.println("create new content ....");
	} else {
	    // update existing content
	    post = PostDaoUtil.getById(postId);
	    System.out.println("update existing content ....");
	    if (post.isEditable(ownerId)) {
		post.setTitle(title);
		post.setMediaInfo(mediaInfo);
		post.setType(type);
		post.setPageIds(Arrays.asList(pageId));
		post.setCategoryKeys(Arrays.asList(categoryKey));

		// update slug Content URI for SEO or user-friendly ID of content
		String slug = paramJson.getString("slug", "");
		post.setSlug(slug);
		updateData = true;

	    } else {
		throw new IllegalAccessError("You do not have permission to edit the page");
	    }
	}

	// privacyStatus for authorization check
	int privacyStatus = paramJson.getInteger("privacyStatus", 0);
	post.setPrivacyStatus(privacyStatus);

	// contentClass for JavaScript OOP
	String contentClass = paramJson.getString("contentClass", "");
	post.setContentClass(contentClass);

	// description default for SEO
	String description = paramJson.getString("description", "");
	post.setDescription(description);

	// description default for SEO
	String headlineVideoUrl = paramJson.getString("headlineVideoUrl", "");
	post.setHeadlineVideoUrl(headlineVideoUrl);

	// headline images
	JsonObject jsonHeadlineImages = paramJson.getJsonObject("headlineImages", new JsonObject());
	Map<String, String> headlineImages = new HashMap<>(jsonHeadlineImages.size());
	jsonHeadlineImages.forEach(e -> {
	    String key = e.getKey();
	    String val = e.getValue().toString();
	    if (!key.isEmpty()) {
		headlineImages.put(key, val);
	    }
	});
	post.setHeadlineImages(headlineImages);

	// keywords
	post.clearKeywords();
	JsonArray jsonKeywords = paramJson.getJsonArray("keywords", new JsonArray());
	jsonKeywords.forEach(e -> {
	    String keyword = e.toString().trim().toLowerCase();
	    if (!keyword.isEmpty()) {
		post.setKeyword(keyword);
	    }
	});

	// custom data
	JsonObject jsonCustomData = paramJson.getJsonObject("customData", new JsonObject());
	Map<String, String> customData = new HashMap<>(jsonCustomData.size());
	jsonCustomData.forEach(e -> {
	    String key = e.getKey();
	    String val = e.getValue().toString();
	    if (!key.isEmpty()) {
		customData.put(key, val);
	    }
	});
	post.setCustomData(customData);

	// mediaInfoUnits
	JsonArray jsonMediaInfoUnits = paramJson.getJsonArray("mediaInfoUnits", new JsonArray());
	List<MediaInfoUnit> mediaInfoUnits = new ArrayList<>(jsonMediaInfoUnits.size());
	int size = jsonMediaInfoUnits.size();
	for (int i = 0; i < size; i++) {
	    JsonObject obj = jsonMediaInfoUnits.getJsonObject(i);
	    MediaInfoUnit infoUnit = new MediaInfoUnit(obj.getString("headline"), obj.getString("content"));
	    mediaInfoUnits.add(infoUnit);
	}
	post.setMediaInfoUnits(mediaInfoUnits);

	String saveId = PostDaoUtil.save(post);
	if (saveId != null) {
	    if (updateData) {
		LuceneSearchPostUtil.updateIndexedPost(post);
	    } else {
		LuceneSearchPostUtil.insertPostIndex(post);
	    }
	}
	return saveId;
    }

    public static boolean deletePost(String postId) {
	boolean ok = PostDaoUtil.deletePost(postId);
	if (ok) {
	    LuceneSearchPostUtil.deletePostIndex(postId);
	}
	return ok;
    }

    public static Post getBySlug(String slug) {
	Post p = PostDaoUtil.getBySlug(slug);
	return p;
    }

    public static Post getById(String id, boolean headlineOnly) {
	Post p = PostDaoUtil.getById(id, headlineOnly);
	return p;
    }

    public static List<Post> getSimilarPosts(List<String> contextPageIds, String postId) {
	LeoBot bot = new LeoBot(contextPageIds, postId);
	bot.process();
	return bot.getRecommendedPosts();
    }
}
