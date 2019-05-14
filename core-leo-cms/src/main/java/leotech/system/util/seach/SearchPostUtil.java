package leotech.system.util.seach;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StoredField;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.BooleanQuery.Builder;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.TopScoreDocCollector;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;

import com.google.gson.Gson;

import leotech.cms.model.MediaInfoUnit;
import leotech.cms.model.Post;
import leotech.cms.service.PostDataService;
import leotech.system.util.KeywordUtil;
import rfx.core.util.StringUtil;

public class SearchPostUtil {
    private static final String SPACE_STR = " ";
    private static final String KEYWORDS = "keywords";
    private static final String CATEGORY_KEY = "cat_key";
    private static final String JSON_DATA = "json_data";
    private static final String TITLE = "title";
    private static final String PRIVACY = "privacy";
    private static final String INDEXED = "indexed";
    private static final String INDEXED_TITLE = "indexedTitle";
    private static final String CONTENT_ID = "ctid";
    private static final String CONTENT_ID_PREFIX = "ctid:";
    public static final String LUCENE_INDEX_FOLDER_NAME = "./LUCENE_INDEX/";

    protected static Directory getIndexDir() throws IOException {
	File dir = new File(LUCENE_INDEX_FOLDER_NAME);
	return FSDirectory.open(dir.toPath());
    }

    protected static IndexWriter getIndexWriter() throws IOException {
	StandardAnalyzer analyzer = new StandardAnalyzer();
	IndexWriterConfig indexWriterConfig = new IndexWriterConfig(analyzer);
	IndexWriter writter = new IndexWriter(getIndexDir(), indexWriterConfig);
	return writter;
    }

    protected static Document documentBuilder(Post post) {
	Document document = new Document();
	StringBuilder indexed = new StringBuilder();
	
	List<String> keywords = post.getKeywords();
	for (String keyword : keywords) {
	    indexed.append(keyword).append(SPACE_STR);
	}

	indexed.append(post.getTitle()).append(SPACE_STR);
	indexed.append(post.getDescription()).append(SPACE_STR);
	indexed.append(post.getMediaInfo()).append(SPACE_STR);

	List<MediaInfoUnit> mediaUnits = post.getMediaInfoUnits();
	for (MediaInfoUnit mediaInfoUnit : mediaUnits) {
	    indexed.append(mediaInfoUnit.getHeadline()).append(SPACE_STR);
	    indexed.append(mediaInfoUnit.getContent()).append(SPACE_STR);
	}

	document.add(new StringField(CONTENT_ID, post.getId(), Field.Store.YES));

	String indexedTitle = KeywordUtil.normalizeForSearchIndex(post.getTitle());
	String indexedData = KeywordUtil.normalizeForSearchIndex(indexed.toString());

	document.add(new TextField(TITLE, post.getTitle(), Field.Store.YES));
	document.add(new TextField(CATEGORY_KEY, post.getCategoryKeys().get(0), Field.Store.YES));
	document.add(new TextField(PRIVACY, post.getPrivacyStatus() + "", Field.Store.YES));
	document.add(new TextField(KEYWORDS, StringUtil.joinFromList(",", post.getKeywords()), Field.Store.YES));
	document.add(new TextField(INDEXED_TITLE, indexedTitle, Field.Store.YES));
	document.add(new TextField(INDEXED, indexedData, Field.Store.NO));

	// store json as cached data
	post.compactDataForList(true);
	String json = new Gson().toJson(post);
	document.add(new StoredField(JSON_DATA, json));
	return document;
    }

    ///////////////////////////////////////////////////////////////////

    public static void doIndexingPost(Post post) {
	doIndexingPosts(Arrays.asList(post));
    }

    public static void updateIndexedPost(Post post) {
	try {
	    Term docId = new Term(CONTENT_ID, post.getId());
	    IndexWriter writter = getIndexWriter();

	    Document document = documentBuilder(post);
	    writter.updateDocument(docId, document);

	    writter.flush();
	    writter.close();
	} catch (Exception e) {
	    e.printStackTrace();
	}
    }

    public static void deleteIndexedPost(String ctid) {
	try {
	    IndexWriter writter = getIndexWriter();

	    Term docId = new Term(CONTENT_ID, ctid);
	    writter.deleteDocuments(docId);

	    writter.flush();
	    writter.close();
	} catch (Exception e) {
	    e.printStackTrace();
	}
    }

    public static void doIndexingPosts(List<Post> posts) {
	try {
	    IndexWriter writter = getIndexWriter();

	    for (Post post : posts) {
		Document document = documentBuilder(post);
		writter.addDocument(document);
	    }
	    writter.flush();
	    writter.close();
	} catch (Exception e) {
	    e.printStackTrace();
	}
    }

    public static List<Post> searchPublicPost(String[] keywords, int startIndex, int numberResult) {
	return searchPost(keywords, false, false, true, startIndex, numberResult);
    }

    public static List<Post> searchPost(String[] keywords, boolean includeProtected, boolean includePrivate, boolean headlineOnly, int startIndex, int numberResult) {
	List<Post> list = null;
	try {

	    for (String keyword : keywords) {
		keyword = keyword.trim();
		if (!keyword.isEmpty()) {

		    String normalizedKeyword = KeywordUtil.normalizeForSearchIndex(keyword);
		    String[] toks = normalizedKeyword.split(SPACE_STR);
		    System.out.println("SearchPostUtil.searchPost " + keyword);

		    Builder mainQuery = new BooleanQuery.Builder();

		    if (keyword.startsWith(CONTENT_ID_PREFIX)) {
			String id = keyword.replace(CONTENT_ID_PREFIX, "");
			mainQuery.add(new TermQuery(new Term(CONTENT_ID, id)), BooleanClause.Occur.MUST);
		    } else {
			for (String tok : toks) {
			    // Query title2Query = new TermQuery(new Term(INDEXED, tok));
			    // mainQuery.add(title2Query, BooleanClause.Occur.SHOULD);

			    Query title2Query = new TermQuery(new Term(INDEXED_TITLE, tok));
			    mainQuery.add(title2Query, BooleanClause.Occur.SHOULD);

			    Query fulltextQuery2 = new TermQuery(new Term(INDEXED, tok));
			    mainQuery.add(fulltextQuery2, BooleanClause.Occur.SHOULD);
			}
		    }
		    Query searchQuery = mainQuery.build();
		    IndexReader indexReader = DirectoryReader.open(getIndexDir());
		    IndexSearcher searcher = new IndexSearcher(indexReader);

		    TopScoreDocCollector collector = TopScoreDocCollector.create(1000);
		    searcher.search(searchQuery, collector);

		    //int startIndex = (pageNumber - 1) * pageResults;
		    TopDocs topDocs = collector.topDocs(startIndex, numberResult);

		    ScoreDoc[] scoreDocs = topDocs.scoreDocs;
		    list = new ArrayList<>(scoreDocs.length);
		    for (ScoreDoc scoreDoc : scoreDocs) {
			Document document = searcher.doc(scoreDoc.doc);
			// System.out.println("searchPost " + document.get(CONTENT_ID));
			String id = document.get(CONTENT_ID);
			if (id != null) {
			    String json = document.get(JSON_DATA);
			    Post post = new Gson().fromJson(json, Post.class);// PostDataService.getById(id, true);
			    if (post != null) {
				list.add(post);
			    }
			}
		    }
		    indexReader.close();
		}
	    }
	} catch (Exception e) {
	    e.printStackTrace();
	}
	return list != null ? list : new ArrayList<>(0);
    }

}
