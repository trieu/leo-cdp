package leotech.cms.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoCursor;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.BaseDocument;

import leotech.cms.model.Post;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbQuery.CallbackQuery;
import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.StringUtil;

public class PostDaoUtil {
    
    //for
    static long limitTotalPosts = 9000;// free = 9000, $9 = 90000, $99 = 900000, $999 = 9000000, $9999 = no limit

    private static final String AQL_FIND_KEY_AQL = Post.contentFindKeyAql(Post.COLLECTION_NAME);
    static final String AQL_GET_POSTS_BY_NETWORK = AqlTemplate.get("AQL_GET_POSTS_BY_NETWORK");
    static final String AQL_GET_POSTS_BY_PAGE = AqlTemplate.get("AQL_GET_POSTS_BY_PAGE");
    static final String AQL_GET_VIEWABLE_POSTS_BY_PAGE = AqlTemplate.get("AQL_GET_VIEWABLE_POSTS_BY_PAGE");
    static final String AQL_GET_POST_BY_ID = AqlTemplate.get("AQL_GET_POST_BY_ID");
    static final String AQL_GET_POST_BY_SLUG = AqlTemplate.get("AQL_GET_POST_BY_SLUG");

    static final String AQL_GET_ALL_POSTS_BY_PAGE = AqlTemplate.get("AQL_GET_ALL_POSTS_BY_PAGE");

    static final String AQL_GET_POSTS_OF_DEFAULT_HOME_PAGE = AqlTemplate.get("AQL_GET_POSTS_OF_DEFAULT_HOME_PAGE");
    static final String AQL_GET_ALL_POSTS_BY_CATEGORY_OR_PAGE = AqlTemplate.get("AQL_GET_ALL_POSTS_BY_CATEGORY_OR_PAGE");
    static final String AQL_GET_KEYWORDS_OF_ALL_POSTS = AqlTemplate.get("AQL_GET_KEYWORDS_OF_ALL_POSTS");
    
    public static boolean checkLimitOfLicense() {
	return limitTotalPosts > 0 && countTotalOfPostCollection() < limitTotalPosts;
    }

    public static String save(Post post) {
	if (post.isReadyForSave() && checkLimitOfLicense()) {
	    ArangoCollection col = post.getCollection();
	    if (col != null) {
		String id = post.getId();
		String _key = ArangoDbUtil.findKey(AQL_FIND_KEY_AQL, "id", id);
		if (_key == null) {
		    col.insertDocument(post);
		} else {
		    post.setModificationTime(System.currentTimeMillis());
		    col.deleteDocument(_key);
		    col.insertDocument(post);
		}
		return id;

	    }
	}
	return "";
    }

    public static boolean deletePost(String id) {
	ArangoCollection col = Post.theCollection();
	if (col != null) {
	    String _key = ArangoDbUtil.findKey(AQL_FIND_KEY_AQL, "id", id);
	    col.deleteDocument(_key);
	    return true;
	}
	return false;
    }

    public static Post getById(String id) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(1);
	bindVars.put("id", id);
	Post p = new ArangoDbQuery<Post>(db, AQL_GET_POST_BY_ID, bindVars, Post.class, new CallbackQuery<Post>() {
	    public Post apply(Post obj) {
		obj.buildDefaultHeadlineImage();
		return obj;
	    }
	}).getResultsAsObject();
	return p;
    }

    public static Post getBySlug(String slug) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(1);
	bindVars.put("slug", slug);
	Post p = new ArangoDbQuery<Post>(db, AQL_GET_POST_BY_SLUG, bindVars, Post.class, new CallbackQuery<Post>() {
	    public Post apply(Post obj) {
		obj.buildDefaultHeadlineImage();
		return obj;
	    }
	}).getResultsAsObject();
	return p;
    }

    public static List<Post> listByNetwork(long networkId, int startIndex, int numberResult) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(3);
	bindVars.put("networkId", networkId);
	bindVars.put("startIndex", startIndex);
	bindVars.put("numberResult", numberResult);
	List<Post> list = new ArangoDbQuery<Post>(db, AQL_GET_POSTS_BY_NETWORK, bindVars, Post.class, new CallbackQuery<Post>() {
	    public Post apply(Post obj) {
		obj.compactDataForList(true);
		return obj;
	    }
	}).getResultsAsList();
	return list;
    }

    public static List<Post> listByPage(String pageId, int startIndex, int numberResult) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(3);
	bindVars.put("pageId", pageId);
	bindVars.put("startIndex", startIndex);
	bindVars.put("numberResult", numberResult);
	List<Post> list = new ArangoDbQuery<Post>(db, AQL_GET_POSTS_BY_PAGE, bindVars, Post.class, new CallbackQuery<Post>() {
	    public Post apply(Post obj) {
		obj.compactDataForList(true);
		return obj;
	    }
	}).getResultsAsList();
	return list;
    }

    public static List<Post> listAllByContentClass(String contentClass, boolean includeProtected, boolean includePrivate, int startIndex, int numberResult) {
	return listAllByContentClassAndKeywords(contentClass, new String[] {}, includeProtected, includePrivate, false, startIndex, numberResult);
    }

    public static List<Post> listAllByContentClassAndKeywords(String contentClass, String[] keywords, boolean includeProtected, boolean includePrivate, boolean joinResultByAnd,
	    int startIndex, int numberResult) {
	if (StringUtil.isEmpty(contentClass)) {
	    return new ArrayList<Post>(0);
	}
	StringBuilder aql = new StringBuilder("FOR p in post FILTER p.contentClass == @contentClass AND p.privacyStatus == 0 ");
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(1);
	bindVars.put("contentClass", contentClass);

	// keyword filter
	if (keywords.length > 0) {
	    int c = 0;
	    aql.append(" AND ( ");

	    String keywordLogicOperator;
	    if (joinResultByAnd) {
		keywordLogicOperator = " AND ";
	    } else {
		keywordLogicOperator = " OR ";
	    }

	    for (String k : keywords) {
		String keyword = k.trim();
		if (!keyword.isEmpty() || !keyword.contains("@")) {
		    System.out.println(" keyword: " + keyword);
		    bindVars.put("keyword" + c, keyword);
		    aql.append("@keyword").append(c).append(" IN p.keywords[*] ");
		    c++;
		    if (c + 1 <= keywords.length) {
			aql.append(keywordLogicOperator);
		    }
		}
	    }
	    aql.append(") ");
	}

	// filter only public as default
	aql.append(" AND (p.privacyStatus == 0 ");

	if (includeProtected) {
	    aql.append(" OR p.privacyStatus == 1 ");
	}
	if (includePrivate) {
	    aql.append(" OR p.privacyStatus == -1 ");
	}
	aql.append(" ) SORT p.modificationTime DESC LIMIT @startIndex,@numberResult RETURN p");
	bindVars.put("startIndex", startIndex);
	bindVars.put("numberResult", numberResult);

	List<Post> list = new ArangoDbQuery<Post>(db, aql.toString(), bindVars, Post.class, new CallbackQuery<Post>() {
	    public Post apply(Post obj) {
		obj.compactDataForList(true);
		return obj;
	    }
	}).getResultsAsList();
	return list;
    }

    public static List<Post> listAllByPage(String pageId) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(1);
	bindVars.put("pageId", pageId);
	List<Post> list = new ArangoDbQuery<Post>(db, AQL_GET_ALL_POSTS_BY_PAGE, bindVars, Post.class, new CallbackQuery<Post>() {
	    public Post apply(Post obj) {
		obj.compactDataForList(true);
		return obj;
	    }
	}).getResultsAsList();
	return list;
    }

    public static List<Post> listAllByCategoryOrPage(String categoryKey, String pageId) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(1);
	bindVars.put("categoryKey", categoryKey);
	bindVars.put("pageId", pageId);
	List<Post> list = new ArangoDbQuery<Post>(db, AQL_GET_ALL_POSTS_BY_CATEGORY_OR_PAGE, bindVars, Post.class, new CallbackQuery<Post>() {
	    public Post apply(Post obj) {
		obj.compactDataForList(true);
		return obj;
	    }
	}).getResultsAsList();
	return list;
    }

    public static List<Post> listViewablePostsByPage(String pageId, long ownerId, int startIndex, int numberResult) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(4);
	bindVars.put("pageId", pageId);
	bindVars.put("ownerId", ownerId);
	bindVars.put("startIndex", startIndex);
	bindVars.put("numberResult", numberResult);
	List<Post> list = new ArangoDbQuery<Post>(db, AQL_GET_VIEWABLE_POSTS_BY_PAGE, bindVars, Post.class, new CallbackQuery<Post>() {
	    public Post apply(Post obj) {
		obj.compactDataForList(true);
		return obj;
	    }
	}).getResultsAsList();
	return list;
    }

    public static List<Post> list(long networkId, int startIndex, int numberResult, int privacyStatus, String pageId, int status) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(3);
	bindVars.put("networkId", networkId);
	bindVars.put("startIndex", startIndex);
	bindVars.put("numberResult", numberResult);
	List<Post> list = new ArangoDbQuery<Post>(db, AQL_GET_POSTS_BY_NETWORK, bindVars, Post.class, new CallbackQuery<Post>() {
	    public Post apply(Post obj) {
		obj.compactDataForList(true);
		return obj;
	    }
	}).getResultsAsList();
	return list;
    }

    public static Map<String, Object> getPostsOfDefaultHomepage() {
	Map<String, Object> map = new HashMap<>();
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	ArangoCursor<BaseDocument> cursor = null;
	cursor = db.query(AQL_GET_POSTS_OF_DEFAULT_HOME_PAGE, new HashMap<>(0), null, BaseDocument.class);
	while (cursor.hasNext()) {
	    BaseDocument doc = cursor.next();
	    map = doc.getProperties();
	    break;
	}
	return map;
    }

    public static List<String> getAllKeywords() {
	List<String> list = null;
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	ArangoCursor<BaseDocument> cursor = db.query(AQL_GET_KEYWORDS_OF_ALL_POSTS, new HashMap<>(0), null, BaseDocument.class);
	while (cursor.hasNext()) {
	    BaseDocument doc = cursor.next();
	    System.out.println(doc.getProperties());
	    list = (List<String>) doc.getProperties().getOrDefault("keywords", new ArrayList<>(0));
	    list = list.stream().distinct().filter(s -> {
		return !s.isEmpty();
	    }).collect(Collectors.toList());
	    break;
	}
	return list == null ? new ArrayList<>(0) : list;
    }

    public static long countTotalOfPostCollection() {

	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	long c = db.collection("post").count().getCount();
	return c;
    }

}
