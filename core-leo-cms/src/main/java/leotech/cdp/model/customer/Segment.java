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
import com.arangodb.model.FulltextIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.Gson;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;
import leotech.cdp.query.ProfileQuery;
import rfx.core.util.StringUtil;

/**
 * @author tantrieu31
 * @since 2020-08-27
 *
 */
public class Segment extends CdpPersistentObject implements Comparable<Segment> {
	
	public static final int STATUS_REMOVED = -1; // 
	public static final int STATUS_PASSIVE_QUERY = 0;// for reporting and analytics on-demand
	public static final int STATUS_ACTIVE_QUERY = 1;// for actively query into cached profiles
	public static final int STATUS_ACTIVATED = 2; // activated by scheduled campaigns
	
	public static final String COLLECTION_NAME = getCollectionName(Segment.class);
	static ArangoCollection dbCol;

	@Override
	public ArangoCollection getCollection() {
		if (dbCol == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			dbCol = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			dbCol.ensureFulltextIndex(Arrays.asList("name"), new FulltextIndexOptions().inBackground(true).minLength(3) );
			dbCol.ensurePersistentIndex(Arrays.asList("type"), new PersistentIndexOptions().unique(false));
			dbCol.ensurePersistentIndex(Arrays.asList("dataPipelineUrl"),new PersistentIndexOptions().unique(false));
			dbCol.ensurePersistentIndex(Arrays.asList("keywords[*]"),new PersistentIndexOptions().unique(false));
		}
		return dbCol;
	}

	@DocumentField(Type.KEY)
	@Expose
	protected String id;

	@Expose
	String name = ""; // e.g: all profiles is living in Vietnam ?
	
	@Expose
	String description = ""; 
	
	@Expose
	String dataPipelineUrl; // the URI of data pipeline processor for profile scoring and ranking

	@Expose
	int type = SegmentType.AD_HOC_QUERY;

	@Expose
	int status = 0; // -1 is deleted, 0 is inactive, 1 is active, 2 is activated

	@Expose
	// check rules_basic at https://querybuilder.js.org/assets/demo-basic.js
	String jsonQueryRules;

	@Expose
	List<String> selectedFields = Arrays.asList("id", "primaryEmail", "primaryPhone", "createdAt", "firstName","lastName", "age", "gender");
	
	@Expose
	String beginFilterDate;
	
	@Expose
	String endFilterDate;
	
	@Expose
	long totalCount = 0; // how many of profiles from query ?

	@Expose
	boolean activeQuery = false; 

	@Expose
	List<String> keywords = new ArrayList<String>();

	@Expose
	int indexScore = 0; // the important score of segment
	
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
		return StringUtil.isNotEmpty(this.name) && StringUtil.isNotEmpty(this.jsonQueryRules) 
				&& StringUtil.isNotEmpty(this.beginFilterDate) && StringUtil.isNotEmpty(this.endFilterDate)
				&& this.selectedFields != null;
	}
	
	public void buildHashKey() {
		this.id = id(name + jsonQueryRules + beginFilterDate + endFilterDate);
	}
	
	public Segment() {
		
	}
	
	public Segment(String beginFilterDate, String endFilterDate) {
		super();
		this.beginFilterDate = beginFilterDate;
		this.endFilterDate = endFilterDate;
		this.id = "";
		this.selectedFields = new ArrayList<String>(0);
	}
	
	public Segment(String name, String jsonQueryRules, String beginFilterDate, String endFilterDate) {
		super();
		this.name = name;
		this.jsonQueryRules = jsonQueryRules;
		this.beginFilterDate = beginFilterDate;
		this.endFilterDate = endFilterDate;
		if( StringUtil.isNotEmpty(name) ) {
			buildHashKey();
		} else {
			this.id = "";
		}
		this.selectedFields = new ArrayList<String>(0);
	}
	
	public Segment(String name, String jsonQueryRules, List<String> selectedFields, String beginFilterDate, String endFilterDate) {
		super();
		this.name = name;
		this.jsonQueryRules = jsonQueryRules;
		this.selectedFields = selectedFields;
		this.beginFilterDate = beginFilterDate;
		this.endFilterDate = endFilterDate;
		this.id = id(name + jsonQueryRules + selectedFields + beginFilterDate + endFilterDate);
	}
	
	public ProfileQuery toProfileQuery() {
		// default query
		return toProfileQuery(0, 20);
	}

	public ProfileQuery toProfileQuery(int startIndex, int numberResult) {
		// build query
		ProfileQuery profileQuery = new ProfileQuery(beginFilterDate, endFilterDate, jsonQueryRules, selectedFields);
		
		// pagination
		profileQuery.setStartIndex(startIndex);
		profileQuery.setNumberResult(numberResult);
		return profileQuery;
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
	
	public Map<String, String> getExtData() {
		return extData;
	}

	public void setExtData(Map<String, String> extData) {
		this.extData = extData;
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getJsonQueryRules() {
		return jsonQueryRules;
	}

	public void setJsonQueryRules(String jsonQueryRules) {
		this.jsonQueryRules = jsonQueryRules;
	}

	public String getBeginFilterDate() {
		return beginFilterDate;
	}

	public void setBeginFilterDate(String beginFilterDate) {
		this.beginFilterDate = beginFilterDate;
	}

	public String getEndFilterDate() {
		return endFilterDate;
	}

	public void setEndFilterDate(String endFilterDate) {
		this.endFilterDate = endFilterDate;
	}

	public long getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(long totalCount) {
		this.totalCount = totalCount;
	}
	
	public boolean isActiveQuery() {
		return activeQuery;
	}

	public void setActiveQuery(boolean activeQuery) {
		this.activeQuery = activeQuery;
		if(this.activeQuery) {
			this.status = STATUS_ACTIVE_QUERY;
		}
	}

	public String getDataPipelineUrl() {
		return dataPipelineUrl;
	}

	public void setDataPipelineUrl(String dataPipelineUrl) {
		this.dataPipelineUrl = dataPipelineUrl;
	}

	public List<String> getSelectedFields() {
		return selectedFields;
	}

	public void setSelectedFields(List<String> selectedFields) {
		this.selectedFields = selectedFields;
	}
	
	@Override
	public String toString() {
		return new Gson().toJson(this);
	}
}
