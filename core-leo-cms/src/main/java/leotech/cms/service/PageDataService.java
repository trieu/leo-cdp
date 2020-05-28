package leotech.cms.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import leotech.cms.dao.PageDaoUtil;
import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.Page;
import leotech.cms.model.Post;
import leotech.cms.model.common.ContentType;
import leotech.system.model.AppMetadata;
import leotech.system.model.User;
import leotech.system.util.KeywordUtil;

public class PageDataService {

	// TODO add shared redis cache here

	public static String savePageInfo(JsonObject paramJson, User loginUser) {

		String ownerId = loginUser.getKey();
		String pageId = paramJson.getString("pageId", "");
		String categoryKey = paramJson.getString("categoryKey", "");
		String title = paramJson.getString("title", "");
		String mediaInfo = paramJson.getString("mediaInfo", "");

		// TODO need validate and check security data

		Page page;
		if (pageId.isEmpty()) {
			// create new page
			long networkId = AppMetadata.DEFAULT_ID;
			page = new Page(title, networkId, categoryKey, ownerId, mediaInfo);
		} else {
			// update existed page
			page = PageDaoUtil.getById(pageId);
			if (page.isEditable(ownerId)) {
				page.setTitle(title);
				page.setMediaInfo(mediaInfo);

				// update slug Content URI for SEO or user-friendly ID of
				// content
				String slug = paramJson.getString("slug", "");
				page.setSlug(slug);
			} else {
				throw new IllegalAccessError("You do not have permission to edit the page");
			}
		}

		page.setCategoryKeys(Arrays.asList(categoryKey));

		// content type
		int type = paramJson.getInteger("type", ContentType.HTML_TEXT);
		page.setType(type);

		// privacyStatus for authorization check
		int privacyStatus = paramJson.getInteger("privacyStatus", 0);
		page.setPrivacyStatus(privacyStatus);

		// set score for ranking pages
		long rankingScore = paramJson.getLong("rankingScore");
		page.setRankingScore(rankingScore);

		// contentClass for JavaScript OOP
		String contentClass = paramJson.getString("contentClass", "");
		page.setContentClass(contentClass);

		// description default for SEO
		String description = paramJson.getString("description", "");
		if (!description.isEmpty()) {
			page.setDescription(description);
		}

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
		page.setHeadlineImages(headlineImages);

		// keywords
		page.clearKeywords();
		JsonArray jsonKeywords = paramJson.getJsonArray("keywords", new JsonArray());
		jsonKeywords.forEach(e -> {
			String keyword = e.toString();
			if (!keyword.isEmpty()) {
				page.setKeyword(keyword);
			}
		});

		// contentClass => keyword filters
		page.clearMapContentClassKeywords();
		JsonObject mapContentClassKeywords = paramJson.getJsonObject("mapContentClassKeywords", new JsonObject());
		mapContentClassKeywords.forEach(e -> {
			String className = e.getKey();
			JsonArray filterList = (JsonArray) e.getValue();
			List<String> keywords = new ArrayList<>(filterList.size());
			filterList.forEach(e1 -> {
				String keyword = e1.toString();
				if (!keyword.isEmpty()) {
					keywords.add(KeywordUtil.normalizeForSEO(keyword));
				}
			});
			page.setContentClassKeywords(className, keywords);
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
		page.setCustomData(customData);

		return PageDaoUtil.save(page);
	}

	/**
	 * 
	 * must be carefull call this method
	 * 
	 * @param pageId
	 * @return
	 */
	public static boolean deletePage(String pageId) {
		List<Post> list = PostDaoUtil.listAllByPage(pageId);
		for (Post post : list) {
			PostDaoUtil.deletePost(post.getId());
		}
		boolean ok = PageDaoUtil.deletePage(pageId);
		return ok;
	}

	public static Page getPageWithPosts(String slug, int startIndex, int numberResult) {
		Page page = PageDaoUtil.getBySlug(slug);
		
		if(page != null) {
			String pageId = page.getId();
			List<Post> posts = PostDaoUtil.listByPage(pageId, startIndex, numberResult);
			page.setPostsWithOrderByTime(posts);
		}
		
		return page;
	}

	public static List<Page> getPagesByCategory(String categoryKey) {
		List<Page> pages = PageDaoUtil.listByCategory(categoryKey);
		return pages;
	}

	public static List<Page> listByCategoryWithPublicPrivacy(String categoryKey) {
		List<Page> pages = PageDaoUtil.listByCategoryWithPublicPrivacy(categoryKey);
		Collections.sort(pages);
		return pages;
	}

	public static List<Page> getPagesByNetwork(long networkId, int startIndex, int numberResult) {
		List<Page> pages = PageDaoUtil.listByNetwork(networkId, startIndex, numberResult);
		return pages;
	}
}
