package leotech.cms.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cms.model.Page;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class PageDaoUtil {

	private static final String AQL_FIND_KEY_AQL = ArangoDbUtil.contentFindKeyAql(Page.COLLECTION_NAME);
	static final String AQL_GET_PAGE_BY_ID = AqlTemplate.get("AQL_GET_PAGE_BY_ID");
	static final String AQL_GET_PAGE_BY_SLUG = AqlTemplate.get("AQL_GET_PAGE_BY_SLUG");

	static final String AQL_GET_PAGES_BY_NETWORK = AqlTemplate.get("AQL_GET_PAGES_BY_NETWORK");
	static final String AQL_GET_ALL_PAGES_BY_CATEGORY = AqlTemplate.get("AQL_GET_ALL_PAGES_BY_CATEGORY");
	static final String AQL_GET_PUBLIC_PAGES_BY_CATEGORY = AqlTemplate.get("AQL_GET_PUBLIC_PAGES_BY_CATEGORY");

	public static String save(Page page) {
		if (page.isReadyForSave()) {
			ArangoCollection col = page.getCollection();
			if (col != null) {
				String id = page.getId();

				String _key = ArangoDbUtil.findKey(AQL_FIND_KEY_AQL, "id", id);
				System.out.println("findKey " + _key);
				if (_key == null) {
					col.insertDocument(page);
				} else {
					page.setModificationTime(System.currentTimeMillis());
					col.updateDocument(_key, page);
				}
				return id;
			}
		}
		return null;
	}

	public static boolean deletePage(String pageId) {
		Page page = getById(pageId);
		ArangoCollection col = page.getCollection();
		if (col != null) {
			String _key = ArangoDbUtil.findKey(AQL_FIND_KEY_AQL, "id", pageId);
			col.deleteDocument(_key);
			return true;
		}
		return false;
	}

	public static String saveMediaContent(String pageId, int type, String mediaContent) {
		Page page = getById(pageId);
		page.setType(type);
		page.setMediaInfo(mediaContent);
		return pageId;
	}

	public static Page getById(String id) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("id", id);
		Page p = new ArangoDbQuery<Page>(db, AQL_GET_PAGE_BY_ID, bindVars, Page.class).getResultsAsObject();
		return p;
	}

	public static Page getBySlug(String slug) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("slug", slug);
		Page p = new ArangoDbQuery<Page>(db, AQL_GET_PAGE_BY_SLUG, bindVars, Page.class).getResultsAsObject();
		return p;
	}

	public static List<Page> listByNetwork(long networkId, int startIndex, int numberResult) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(3);
		bindVars.put("networkId", networkId);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		List<Page> list = new ArangoDbQuery<Page>(db, AQL_GET_PAGES_BY_NETWORK, bindVars, Page.class)
				.getResultsAsList();
		return list;
	}

	public static List<Page> listByCategory(String categoryKey) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("categoryKey", categoryKey);
		List<Page> list = new ArangoDbQuery<Page>(db, AQL_GET_ALL_PAGES_BY_CATEGORY, bindVars, Page.class)
				.getResultsAsList();
		return list;
	}

	public static List<Page> listByCategoryWithPublicPrivacy(String categoryKey) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("categoryKey", categoryKey);
		List<Page> list = new ArangoDbQuery<Page>(db, AQL_GET_PUBLIC_PAGES_BY_CATEGORY, bindVars, Page.class)
				.getResultsAsList();
		return list;
	}

}
