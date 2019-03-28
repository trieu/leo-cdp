package leotech.cms.dao;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCursor;
import com.arangodb.ArangoDatabase;

import leotech.cms.model.Category;
import leotech.cms.model.Page;
import leotech.cms.model.Post;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class ContentQueryDaoUtil {

    //////// Data Query for Post ///////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    public static Map<String, List<Post>> listPostsByContentClassAndKeywords(String contentClass, String[] keywords, boolean includeProtected, boolean includePrivate,
	    boolean headlineOnly) {
	if (keywords.length == 0) {
	    return new HashMap<>(0);
	}

	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, List<Post>> results = new HashMap<>(keywords.length);

	for (String keyword : keywords) {
	    keyword = keyword.trim();
	    StringBuilder aql = new StringBuilder("FOR p in post FILTER ");
	    Map<String, Object> bindVars = new HashMap<>(2);
	    bindVars.put("keyword", keyword);
	    if (!contentClass.isEmpty()) {
		bindVars.put("contentClass", contentClass);
		aql.append(" p.contentClass == @contentClass AND ");
	    }
	    bindVars.put("keyword", keyword);

	    aql.append(" @keyword IN p.keywords[*] AND (p.privacyStatus == 0 ");

	    if (includeProtected) {
		aql.append(" OR p.privacyStatus == 1 ");
	    }
	    if (includePrivate) {
		aql.append(" OR p.privacyStatus == -1 ");
	    }
	    aql.append(" ) SORT p.modificationTime DESC RETURN p");
	    ArangoDbQuery.CallbackQuery<Post> callback = new ArangoDbQuery.CallbackQuery<Post>() {
		@Override
		public Post apply(Post obj) {
		    obj.compactDataForList(headlineOnly);
		    return obj;
		}

	    };
	    List<Post> list = new ArangoDbQuery<Post>(db, aql.toString(), bindVars, Post.class, callback).getResultsAsList();
	    results.put(keyword, list);
	}

	// System.out.println(aql.toString());

	return results;
    }

    public static Map<String, List<Post>> listPostsByCategoriesAndKeywords(String[] categoryKeys, String[] keywords, boolean includeProtected, boolean includePrivate, boolean headlineOnly) {
	Map<String, List<Post>> results = new HashMap<>(categoryKeys.length);
	if (categoryKeys.length == 0) {
	    return results;
	}
	ArangoCursor<Post> cursor = null;
	try {
	    StringBuilder aql = new StringBuilder("FOR p in post FILTER ");
	    ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	    Map<String, Object> bindVars = new HashMap<>(categoryKeys.length);

	    // category filter
	    Map<String, String> mapCatSlug = new HashMap<>(categoryKeys.length);
	    int c = 0;
	    aql.append("( ");
	    for (String categoryKey : categoryKeys) {
		categoryKey = categoryKey.trim();
		if (!categoryKey.isEmpty() || !categoryKey.contains("@")) {

		    // FIXME use cache here
		    Category cat = CategoryDaoUtil.getByKey(categoryKey);
		    mapCatSlug.put(categoryKey, cat.getSlug().toLowerCase());

		    bindVars.put("categoryKey" + c, categoryKey);
		    aql.append("@categoryKey").append(c).append(" IN p.categoryKeys[*] ");
		    c++;
		    if (c + 1 <= categoryKeys.length) {
			aql.append(" OR ");
		    }
		}
	    }
	    aql.append(") ");

	    // keyword filter
	    if (keywords.length > 0) {
		c = 0;
		aql.append(" AND ( ");
		for (String k : keywords) {
		    String keyword = k.trim();
		    if (!keyword.isEmpty() || !keyword.contains("@")) {
			System.out.println(" keyword: " + keyword);
			bindVars.put("keyword" + c, keyword);
			aql.append("@keyword").append(c).append(" IN p.keywords[*] ");
			c++;
			if (c + 1 <= keywords.length) {
			    aql.append(" OR ");
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
	    aql.append(" ) SORT p.modificationTime DESC RETURN p");

	    System.out.println(aql.toString());
	    cursor = db.query(aql.toString(), bindVars, null, Post.class);
	    while (cursor.hasNext()) {
		Post p = cursor.next();

		// static url update
		p.compactDataForList(headlineOnly);

		String catKey = p.getCategoryKeys().size() > 0 ? p.getCategoryKeys().get(0) : "";
		String catSlug = mapCatSlug.get(catKey);

		if (catSlug != null && !catKey.isEmpty()) {
		    List<Post> posts = results.get(catSlug);
		    if (posts == null) {
			posts = new ArrayList<>();
			results.put(catSlug, posts);
		    }
		    posts.add(p);
		}
	    }
	} catch (Exception e) {
	    e.printStackTrace();
	} finally {
	    try {
		if (cursor != null) {
		    cursor.close();
		}
	    } catch (IOException e) {
	    }
	}
	return results;
    }

    public static List<Post> searchPost(String[] keywords, boolean includeProtected, boolean includePrivate, boolean headlineOnly) {
	List<Post> list;
	if (keywords.length == 0) {
	    return new ArrayList<>(0);
	}

	StringBuilder query = new StringBuilder();
	int c = 0;
	for (String keyword : keywords) {
	    String k = keyword.trim();
	    if (!k.isEmpty()) {
		query.append(k);
		c++;
		if (c + 1 <= keywords.length) {
		    query.append(",|");
		}
	    }

	}

	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(1);

	StringBuilder aql = new StringBuilder("FOR p IN FULLTEXT(post, \"title\", @query) ");

	// filter only public as default
	aql.append(" FILTER (p.privacyStatus == 0 ");
	if (includeProtected) {
	    aql.append(" OR p.privacyStatus == 1 ");
	}
	if (includePrivate) {
	    aql.append(" OR p.privacyStatus == -1 ");
	}
	aql.append(" ) SORT p.modificationTime DESC RETURN p");

	System.out.println(query + " ==> searchPost " + aql.toString());
	bindVars.put("query", query.toString());

	ArangoDbQuery.CallbackQuery<Post> callback = new ArangoDbQuery.CallbackQuery<Post>() {
	    @Override
	    public Post apply(Post obj) {
		obj.compactDataForList(headlineOnly);
		return obj;
	    }
	};
	list = new ArangoDbQuery<Post>(db, aql.toString(), bindVars, Post.class, callback).getResultsAsList();
	return list;
    }

    //////// Data Query for Page ///////////////////////////////////
    ///////////////////////////////////////////////////////////////////

    public static List<Page> listPagesByKeywords(String[] keywords, boolean includeProtected, boolean includePrivate, boolean headlineOnly) {

	if (keywords.length == 0) {
	    return new ArrayList<>(0);
	}

	StringBuilder aql = new StringBuilder("FOR p in page FILTER ( ");
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(keywords.length);

	int c = 0;
	for (String keyword : keywords) {
	    keyword = keyword.trim();
	    if (!keyword.isEmpty() || !keyword.contains("@")) {
		bindVars.put("keyword" + c, keyword);
		aql.append("@keyword").append(c).append(" IN p.keywords[*] ");
		c++;
		if (c + 1 <= keywords.length) {
		    aql.append(" OR ");
		}
	    }
	}
	// filter only public as default
	aql.append(" ) AND (p.privacyStatus == 0 ");

	if (includeProtected) {
	    aql.append(" OR p.privacyStatus == 1 ");
	}
	if (includePrivate) {
	    aql.append(" OR p.privacyStatus == -1 ");
	}
	aql.append(" ) SORT p.modificationTime DESC RETURN p");

	System.out.println(aql.toString());
	ArangoDbQuery.CallbackQuery<Page> callback = new ArangoDbQuery.CallbackQuery<Page>() {
	    @Override
	    public Page apply(Page obj) {
		obj.compactDataForList(headlineOnly);
		return obj;
	    }
	};
	List<Page> list = new ArangoDbQuery<Page>(db, aql.toString(), bindVars, Page.class, callback).getResultsAsList();
	return list;
    }
}
