package leotech.cdp.model.customer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;

/**
 * @author Trieu Nguyen
 *
 */
public class Segment extends CdpPersistentObject implements Comparable<Segment> {
	public static final String COLLECTION_NAME = getCollectionName(Segment.class);
	static ArangoCollection instance;

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

		public final static int AD_HOC_QUERY = 9;
	}

	@Override
	public ArangoCollection getCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			instance.ensurePersistentIndex(Arrays.asList("primaryEmail"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("primaryPhone"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("primaryAvatar"),
					new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("rootProfileId"),
					new PersistentIndexOptions().unique(false));
			instance.ensureHashIndex(Arrays.asList("identityAttributes[*]"), new HashIndexOptions());
			instance.ensureHashIndex(Arrays.asList("personaUri"), new HashIndexOptions());
		}
		return instance;
	}

	@DocumentField(Type.KEY)
	@Expose
	private String key;

	@Expose
	String name;

	@Expose
	int type = 0;

	@Expose
	int status = 0;

	@Expose
	long size = 0;

	@Expose
	String queryTemplate;

	@Expose
	Map<String, String> queryParameters = new HashMap<>();

	@Expose
	boolean isPublic = false;

	@Expose
	List<String> keywords = new ArrayList<String>();

	@Expose
	int indexScore = 0;

	@Expose
	String segmenterUri;

	@Expose
	Map<String, String> extData = new HashMap<>();

	@Override
	public int compareTo(Segment o) {
		// TODO Auto-generated method stub
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

	public String getQueryTemplate() {
		return queryTemplate;
	}

	public void setQueryTemplate(String queryTemplate) {
		this.queryTemplate = queryTemplate;
	}

	public Map<String, String> getQueryParameters() {
		return queryParameters;
	}

	public void setQueryParameters(Map<String, String> queryParameters) {
		this.queryParameters = queryParameters;
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

	public String getKey() {
		return key;
	}

}
