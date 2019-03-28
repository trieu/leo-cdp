package test.util;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StoredField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.BooleanQuery.Builder;
import org.apache.lucene.search.FuzzyQuery;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.PhraseQuery;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.WildcardQuery;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;

import com.google.gson.Gson;

import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.MediaInfoUnit;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.Post;
import leotech.system.util.KeywordUtil;
import rfx.core.util.Utils;

public class LuceneSearchPost {

    public static void main(String[] args) {
	//indexData();

	testSearch("Thermatech");

	Utils.exitSystemAfterTimeout(5000);

    }

    public static void testSearch(String keywords) {
	List<Document> docs = searchPost(keywords);
	for (Document doc : docs) {
	    System.out.println("title: " + doc.get("title"));
	    System.out.println(doc.get("id"));
	    // System.out.println(doc.get("data"));
	}
    }

    static Directory getIndexDir() throws IOException {
	File dir = new File("./LUCENE_INDEX/");
	return FSDirectory.open(dir.toPath());
    }

    public static List<Document> searchPost(String keyword) {
	try {

	    String normalizedKeyword = KeywordUtil.normalizeForSearchIndex(keyword);
	    String[] toks = normalizedKeyword.split(" ");
	    System.out.println("searchPost " + keyword);

	    Builder mainQuery = new BooleanQuery.Builder();

	    for (String tok : toks) {
		// builder.add(new Term("title", tok), 0);
		Query title2Query = new TermQuery(new Term("indexedTitle", tok));
		mainQuery.add(title2Query, BooleanClause.Occur.SHOULD);

		Query fulltextQuery2 = new TermQuery(new Term("indexed", tok));
		mainQuery.add(fulltextQuery2, BooleanClause.Occur.SHOULD);
	    }

	    Directory memoryIndex = getIndexDir();
	    IndexReader indexReader = DirectoryReader.open(memoryIndex);
	    IndexSearcher searcher = new IndexSearcher(indexReader);
	    TopDocs topDocs = searcher.search(mainQuery.build(), 25);
	    List<Document> documents = new ArrayList<>();
	    for (ScoreDoc scoreDoc : topDocs.scoreDocs) {
		documents.add(searcher.doc(scoreDoc.doc));
	    }
	    return documents;
	} catch (Exception e) {
	    e.printStackTrace();
	}
	return new ArrayList<>();
    }

    public static void indexData() {
	try {

	    Directory memoryIndex = getIndexDir();
	    StandardAnalyzer analyzer = new StandardAnalyzer();
	    IndexWriterConfig indexWriterConfig = new IndexWriterConfig(analyzer);
	    IndexWriter writter = new IndexWriter(memoryIndex, indexWriterConfig);

	    List<Post> posts = PostDaoUtil.listByNetwork(MediaNetwork.DEFAULT_ID, 0, 10000);

	    for (Post post : posts) {
		System.out.println(post.getTitle());
		Document document = new Document();
		StringBuilder indexed = new StringBuilder();

		indexed.append(post.getTitle()).append(" ");
		indexed.append(post.getDescription()).append(" ");
		indexed.append(post.getMediaInfo()).append(" ");

		List<MediaInfoUnit> mediaUnits = post.getMediaInfoUnits();
		for (MediaInfoUnit mediaInfoUnit : mediaUnits) {
		    indexed.append(mediaInfoUnit.getHeadline()).append(" ");
		    indexed.append(mediaInfoUnit.getContent()).append(" ");
		}

		document.add(new TextField("id", post.getId(), Field.Store.YES));
		String indexedTitle = KeywordUtil.normalizeForSearchIndex(post.getTitle());

		document.add(new TextField("title", post.getTitle(), Field.Store.YES));
		document.add(new TextField("indexedTitle", indexedTitle, Field.Store.YES));
		String indexedData = KeywordUtil.normalizeForSearchIndex(indexed.toString());
		System.out.println(indexedData);
		document.add(new TextField("indexed", indexedData, Field.Store.NO));

		String json = new Gson().toJson(post);
		document.add(new StoredField("data", json));
		writter.addDocument(document);
	    }

	    //writter.updateDocument(term, doc);

	    writter.close();
	} catch (Exception e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
}
