package leotech.cdp.model.customer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;

/**
 * @author tantrieu31
 * @since 2020-08-27
 *
 */
public class Segment extends CdpPersistentObject implements Comparable<Segment> {
	public static final String COLLECTION_NAME = getCollectionName(Segment.class);
	static ArangoCollection dbCollection;

	public static class SegmentationType {
		// https://learn.g2.com/market-segmentation
		public final static int GEOGRAPHIC = 1;
		public final static int DEMOGRAPHIC = 2;
		public final static int PSYCHOGRAPHIC = 3;
		public final static int BEHAVIORAL = 4;

		// common segment type for customer acquisition
		public final static int FIRST_RETARGETING = 5;
		public final static int LOOKALIKE = 6;

		// common segment type for customer retention
		public final static int RFM_ANALYSIS = 7; // https://clevertap.com/blog/rfm-analysis/
		public final static int CHURN = 8;

		// custom query
		public final static int AD_HOC_QUERY = 9;
	}

	@Override
	public ArangoCollection getCollection() {
		if (dbCollection == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			dbCollection = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			dbCollection.ensurePersistentIndex(Arrays.asList("name"), new PersistentIndexOptions().unique(true));
			dbCollection.ensurePersistentIndex(Arrays.asList("type"), new PersistentIndexOptions().unique(true));
			dbCollection.ensurePersistentIndex(Arrays.asList("segmenterUri"),new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("keywords[*]"),
					new PersistentIndexOptions().unique(false));
		}
		return dbCollection;
	}

	@DocumentField(Type.KEY)
	@Expose
	protected String id;

	@Expose
	String name; // e.g: all profiles is living in Vietnam ?

	@Expose
	int type = SegmentationType.AD_HOC_QUERY;

	@Expose
	int status = 0; // -1 is deleted, 0 is default, 1 is active

	@Expose
	// check rules_basic at https://querybuilder.js.org/assets/demo-basic.js
	String jsonStringRules;

	@Expose
	// https://github.com/USPA-Technology/QueryBuilder
	String queryFilter;
	
	@Expose
	long size = 0; // how many of profiles from query ?

	@Expose
	boolean isPublic = false; // anyone can see and run the query ?

	@Expose
	List<String> keywords = new ArrayList<String>();

	@Expose
	int indexScore = 0; // the important score of segment

	@Expose
	String segmenterUri; // data processor URI (e.g: notebooks name, akka name)
	
	@Expose
	protected Date createdAt = new Date();

	@Expose
	protected Date updatedAt;

	@Expose
	Map<String, String> extData = new HashMap<>(); // extra attributes

	@Override
	public int compareTo(Segment o) {
		
		return 0;
	}

	@Override
	public boolean isReadyForSave() {
		// TODO Auto-generated method stub
		return false;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public long getSize() {
		return size;
	}

	public void setSize(long size) {
		this.size = size;
	}

	public boolean isPublic() {
		return isPublic;
	}

	public void setPublic(boolean isPublic) {
		this.isPublic = isPublic;
	}

	public List<String> getKeywords() {
		return keywords;
	}

	public void setKeywords(List<String> keywords) {
		this.keywords = keywords;
	}

	public int getIndexScore() {
		return indexScore;
	}

	public void setIndexScore(int indexScore) {
		this.indexScore = indexScore;
	}

	public String getSegmenterUri() {
		return segmenterUri;
	}

	public void setSegmenterUri(String segmenterUri) {
		this.segmenterUri = segmenterUri;
	}

	public Map<String, String> getExtData() {
		return extData;
	}

	public void setExtData(Map<String, String> extData) {
		this.extData = extData;
	}

	public String getJsonStringRules() {
		return jsonStringRules;
	}

	public void setJsonStringRules(String jsonStringRules) {
		this.jsonStringRules = jsonStringRules;
	}

	public String getQueryFilter() {
		return queryFilter;
	}

	public void setQueryFilter(String queryFilter) {
		this.queryFilter = queryFilter;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getId() {
		return id;
	}
	
	

}
