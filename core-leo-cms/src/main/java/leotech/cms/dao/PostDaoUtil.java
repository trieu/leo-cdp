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

import leotech.cms.model.ContentClassPostQuery;
import leotech.cms.model.Post;
import leotech.system.config.AqlTemplate;
import leotech.system.model.AppMetadata;
import leotech.system.model.DataPrivacy;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbQuery.CallbackQuery;
import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.StringUtil;

public class PostDaoUtil {

	static long limitTotalPosts = 100000;

	private static final String AQL_FIND_KEY_AQL = ArangoDbUtil.contentFindKeyAql(Post.COLLECTION_NAME);
	static final String AQL_GET_POSTS_BY_NETWORK = AqlTemplate.get("AQL_GET_POSTS_BY_NETWORK");
	static final String AQL_GET_POSTS_BY_PAGE = AqlTemplate.get("AQL_GET_POSTS_BY_PAGE");
	static final String AQL_GET_VIEWABLE_POSTS_BY_PAGE = AqlTemplate.get("AQL_GET_VIEWABLE_POSTS_BY_PAGE");
	static final String AQL_GET_POST_BY_ID = AqlTemplate.get("AQL_GET_POST_BY_ID");
	static final String AQL_GET_POST_BY_SLUG = AqlTemplate.get("AQL_GET_POST_BY_SLUG");

	static final String AQL_GET_ALL_POSTS_BY_PAGE = AqlTemplate.get("AQL_GET_ALL_POSTS_BY_PAGE");

	static final String AQL_GET_ALL_POSTS_BY_CATEGORY_OR_PAGE = AqlTemplate
			.get("AQL_GET_ALL_POSTS_BY_CATEGORY_OR_PAGE");
	static final String AQL_GET_KEYWORDS_OF_ALL_POSTS = AqlTemplate.get("AQL_GET_KEYWORDS_OF_ALL_POSTS");

	public static boolean checkLimitOfLicense() {
		return limitTotalPosts > 0 && countTotalOfPostCollection() < limitTotalPosts;
	}

	public static String save(Post post) {
		if (post.isReadyForSave() && checkLimitOfLicense()) {
			ArangoCollection col = post.getDbCollection();
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

	public static Post getById(String id, boolean headlineOnly) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("id", id);
		Post p = new ArangoDbQuery<Post>(db, AQL_GET_POST_BY_ID, bindVars, Post.class, new CallbackQuery<Post>() {
			public Post apply(Post obj) {
				obj.buildDefaultHeadlineImage();
				obj.compactDataForList(headlineOnly);
				return obj;
			}
		}).getResultsAsObject();
		return p;
	}

	public static Post getById(String id) {
		return getById(id, false);
	}

	public static Post getBySlug(String slug) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
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
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(3);
		bindVars.put("networkId", networkId);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		List<Post> list = new ArangoDbQuery<Post>(db, AQL_GET_POSTS_BY_NETWORK, bindVars, Post.class,
				new CallbackQuery<Post>() {
					public Post apply(Post obj) {
						obj.compactDataForList(true);
						return obj;
					}
				}).getResultsAsList();
		return list;
	}

	public static List<Post> listByPage(String pageId, int startIndex, int numberResult) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(3);
		bindVars.put("pageId", pageId);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		List<Post> list = new ArangoDbQuery<Post>(db, AQL_GET_POSTS_BY_PAGE, bindVars, Post.class,
				new CallbackQuery<Post>() {
					public Post apply(Post obj) {
						obj.compactDataForList(true);
						return obj;
					}
				}).getResultsAsList();
		return list;
	}

	public static List<Post> listPostsByMediaNetwork(AppMetadata app, boolean includeProtected,
			boolean includePrivate, int startIndex, int numberResult) {
		return listAllByContentClassAndKeywords(app.getContentCategoryId(),
				app.getPublicContentClassList(), new String[]{}, includeProtected, includePrivate, false,
				startIndex, numberResult);
	}

	public static List<Post> listAllByContentClass(String contentCategoryId, List<String> contentClasses,
			boolean includeProtected, boolean includePrivate, int startIndex, int numberResult) {
		return listAllByContentClassAndKeywords(contentCategoryId, contentClasses, new String[]{}, includeProtected,
				includePrivate, false, startIndex, numberResult);
	}

	public static List<Post> listAllByContentClassAndKeywords(String contentCategoryId, List<String> publicContentClasses,
			String[] keywords, boolean includeProtected, boolean includePrivate, boolean joinResultByAnd,
			int startIndex, int numberResult) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		
		StringBuilder aql = new StringBuilder();
		aql.append("FOR p in ").append(Post.COLLECTION_NAME).append(" FILTER ");
		aql.append(" p.privacyStatus == ").append(DataPrivacy.PUBLIC);
		
		Map<String, Object> bindVars = new HashMap<>();
		
		// content class
		int c = 0;
		int sizeContentClasses = publicContentClasses.size();
		if(sizeContentClasses > 0) {
			aql.append(" AND ( ");
			for (String contentClass : publicContentClasses) {
				if (!contentClass.isEmpty()) {
					bindVars.put("contentClass"+c, contentClass);
					aql.append(" p.contentClass == @contentClass").append(c).append(" ");
					c++;
					if (c + 1 <= sizeContentClasses) {
						aql.append(" OR ");
					}
				}
			}
			aql.append(" ) ");
		}

		System.out.println("contentCategoryId " + contentCategoryId);
		if (StringUtil.isNotEmpty(contentCategoryId)) {
			aql.append(" AND @contentCategoryId IN p.categoryKeys[*] ");
			bindVars.put("contentCategoryId", contentCategoryId);
		}

		// keyword filter
		if (keywords.length > 0) {
			c = 0;
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

		List<Post> list = new ArangoDbQuery<Post>(db, aql.toString(), bindVars, Post.class,
				new CallbackQuery<Post>() {
					public Post apply(Post obj) {
						obj.compactDataForList(true);
						return obj;
					}
				}).getResultsAsList();
		return list;
	}

	public static List<Post> listAllByPage(String pageId) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("pageId", pageId);
		List<Post> list = new ArangoDbQuery<Post>(db, AQL_GET_ALL_POSTS_BY_PAGE, bindVars, Post.class,
				new CallbackQuery<Post>() {
					public Post apply(Post obj) {
						obj.compactDataForList(true);
						return obj;
					}
				}).getResultsAsList();
		return list;
	}

	public static List<Post> listAllByCategoryOrPage(String categoryKey, String pageId) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("categoryKey", categoryKey);
		bindVars.put("pageId", pageId);
		List<Post> list = new ArangoDbQuery<Post>(db, AQL_GET_ALL_POSTS_BY_CATEGORY_OR_PAGE, bindVars, Post.class,
				new CallbackQuery<Post>() {
					public Post apply(Post obj) {
						obj.compactDataForList(true);
						return obj;
					}
				}).getResultsAsList();
		return list;
	}

	public static List<Post> listViewablePostsByPage(String pageId, long ownerId, int startIndex,
			int numberResult) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(4);
		bindVars.put("pageId", pageId);
		bindVars.put("ownerId", ownerId);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		List<Post> list = new ArangoDbQuery<Post>(db, AQL_GET_VIEWABLE_POSTS_BY_PAGE, bindVars, Post.class,
				new CallbackQuery<Post>() {
					public Post apply(Post obj) {
						obj.compactDataForList(true);
						return obj;
					}
				}).getResultsAsList();
		return list;
	}

	public static List<Post> list(long networkId, int startIndex, int numberResult, int privacyStatus,
			String pageId, int status) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(3);
		bindVars.put("networkId", networkId);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		List<Post> list = new ArangoDbQuery<Post>(db, AQL_GET_POSTS_BY_NETWORK, bindVars, Post.class,
				new CallbackQuery<Post>() {
					public Post apply(Post obj) {
						obj.compactDataForList(true);
						return obj;
					}
				}).getResultsAsList();
		return list;
	}

	public static String buildContentClassPostQuery(List<ContentClassPostQuery> ccpQueries) {
		StringBuilder aql = new StringBuilder();
		String returnSingle = " RETURN {title: p.title, headlineImageUrl: p.headlineImageUrl, id: p.id, description: p.description, contentClass: p.contentClass, creationTime: p.creationTime, modificationTime : p.modificationTime, headlineImages: p.headlineImages , slug : p.slug }  ) ";
		List<String> keys = new ArrayList<>(ccpQueries.size());
		for (ContentClassPostQuery query : ccpQueries) {
			String ccpQueryKey = query.getKey();
			keys.add(ccpQueryKey);
			String categoryKey = query.getCategoryKey();
			int startIndex = query.getStartIndex();
			int limit = query.getLimit();
			aql.append("LET ").append(ccpQueryKey).append(" = (FOR p in ").append(Post.COLLECTION_NAME)
					.append(" FILTER ( \"").append(categoryKey)
					.append("\" IN p.categoryKeys[*]) AND (p.privacyStatus == 0 OR p.privacyStatus == 1 ) ")
					.append(" AND (p.contentClass == \"news\")").append("SORT p.modificationTime DESC LIMIT  ")
					.append(startIndex).append(",").append(limit).append(returnSingle).append("\n");

		}
		aql.append(" RETURN {").append(StringUtil.joinFromList(",", keys)).append("}");
		return aql.toString();
	}

	public static Map<String, Object> getPostsOfDefaultHomepage(List<ContentClassPostQuery> ccpQueries) {
		Map<String, Object> map = new HashMap<>();
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		ArangoCursor<BaseDocument> cursor = null;
		String aql = buildContentClassPostQuery(ccpQueries);
		cursor = db.query(aql, new HashMap<>(0), null, BaseDocument.class);
		while (cursor.hasNext()) {
			BaseDocument doc = cursor.next();
			map = doc.getProperties();
			break;
		}
		return map;
	}

	@SuppressWarnings("unchecked")
	public static List<String> getAllKeywords() {
		List<String> list = null;
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		ArangoCursor<BaseDocument> cursor = db.query(AQL_GET_KEYWORDS_OF_ALL_POSTS, new HashMap<>(0), null,
				BaseDocument.class);
		while (cursor.hasNext()) {
			BaseDocument doc = cursor.next();
			System.out.println(doc.getProperties());
			list = (List<String>) doc.getProperties().getOrDefault("keywords", new ArrayList<String>(0));
			list = list.stream().distinct().filter(s -> {
				return !s.isEmpty();
			}).collect(Collectors.toList());
			break;
		}
		return list == null ? new ArrayList<>(0) : list;
	}

	public static List<Post> listPublicPostsByKeywords(String[] categoryKeys, List<String> publicContentClasses,
			String[] keywords, int startIndex, int numberResult) {
		if (keywords.length == 0 || categoryKeys.length == 0) {
			return new ArrayList<>(0);
		}

		List<Post> list = new ArrayList<>();
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>();

		StringBuilder aql = new StringBuilder();
		aql.append("FOR p in ").append(Post.COLLECTION_NAME).append(" FILTER ");

		// content class
		int c = 0;
		int sizeContentClasses = publicContentClasses.size();
		if(sizeContentClasses > 0) {
			aql.append(" ( ");
			for (String contentClass : publicContentClasses) {
				if (!contentClass.isEmpty()) {
					bindVars.put("contentClass"+c, contentClass);
					aql.append(" p.contentClass == @contentClass").append(c).append(" ");
					c++;
					if (c + 1 <= sizeContentClasses) {
						aql.append(" OR ");
					}
				}
			}
			aql.append(" ) ");
		}
		

		// category filter
		aql.append(" AND ( ");
		c = 0;
		for (String categoryKey : categoryKeys) {
			categoryKey = categoryKey.trim();
			if (!categoryKey.isEmpty()) {

				bindVars.put("categoryKey" + c, categoryKey);
				aql.append("@categoryKey").append(c).append(" IN p.categoryKeys[*] ");
				c++;
				if (c + 1 <= categoryKeys.length) {
					aql.append(" OR ");
				}
			}
		}
		aql.append(") AND ( ");

		// keywords filter
		int i = 0;
		for (String keyword : keywords) {
			keyword = keyword.trim();
			if (!keyword.isEmpty()) {
				String key = "keyword" + i;
				bindVars.put(key, keyword);
				aql.append("@").append(key).append(" IN p.keywords[*] ");
				i++;
			}
			int lastIndex = keywords.length;
			if (i < lastIndex) {
				aql.append(" OR ");
			} else {
				aql.append(" ) ");
			}
		}

		aql.append(" AND p.privacyStatus == 0 SORT p.modificationTime DESC LIMIT @startIndex,@numberResult RETURN p ");
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);

		ArangoDbQuery.CallbackQuery<Post> callback = new ArangoDbQuery.CallbackQuery<Post>() {
			@Override
			public Post apply(Post obj) {
				obj.compactDataForList(true);
				return obj;
			}
		};
		System.out.println("listPublicPostsByKeywords " + aql.toString());
		list.addAll(new ArangoDbQuery<Post>(db, aql.toString(), bindVars, Post.class, callback).getResultsAsList());

		// System.out.println(aql.toString());
		return list;
	}

	public static long countTotalOfPostCollection() {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		long c = db.collection(Post.COLLECTION_NAME).count().getCount();
		return c;
	}

}
