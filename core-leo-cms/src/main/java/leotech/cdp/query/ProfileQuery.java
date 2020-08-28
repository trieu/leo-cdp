package leotech.cdp.query;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import com.itfsw.query.builder.ArangoDbBuilderFactory;
import com.itfsw.query.builder.support.model.result.ArangoDbQueryResult;

public class ProfileQuery {

	boolean filterCreateAt = true;
	boolean pagination = true;
	boolean countingTotal = false;;

	// default is 86400, number of seconds in Day
	String beginFilterDate = Instant.now().minusSeconds(86400).toString();
	String endFilterDate = Instant.now().toString();

	String jsonQueryRules = "{}";
	String parsedFilterAql = "";

	int startIndex = 0;
	int numberResult = 20;
	List<String> profileFields = Arrays.asList("id", "primaryEmail", "createdAt", "firstName", "age");

	// ----- BEGIN query builder
	
	public String toArangoDataQuery() {
		String aql = ProfileQueryBuilder.buildAqlString(filterCreateAt, beginFilterDate, endFilterDate,
				parsedFilterAql, startIndex, numberResult, profileFields);
		return aql;
	}
	
	public String toArangoCountingQuery() {
		String aql = ProfileQueryBuilder.buildAqlString(filterCreateAt, beginFilterDate, endFilterDate,parsedFilterAql);
		return aql;
	}
	
	public String updateStartIndexAndGetDataQuery(int startIndex) {
		this.startIndex = startIndex;
		return toArangoDataQuery();
	}
	
	// ----- END query builder
	
	public ProfileQuery() {
		
	}
	public ProfileQuery(String jsonQueryRules) {
		super();
		this.jsonQueryRules = jsonQueryRules;
		setJsonQueryRules(jsonQueryRules);
	}

	public ProfileQuery(boolean filterCreateAt, boolean pagination, boolean countingTotal, String beginFilterDate,
			String endFilterDate, String jsonQueryRules, int startIndex, int numberResult,
			List<String> profileFields) {
		super();
		this.filterCreateAt = filterCreateAt;
		this.pagination = pagination;
		this.countingTotal = countingTotal;
		this.beginFilterDate = beginFilterDate;
		this.endFilterDate = endFilterDate;
		this.jsonQueryRules = jsonQueryRules;
		this.startIndex = startIndex;
		this.numberResult = numberResult;
		this.profileFields = profileFields;
	}

	public boolean isFilterCreateAt() {
		return filterCreateAt;
	}

	public void setFilterCreateAt(boolean filterCreateAt) {
		this.filterCreateAt = filterCreateAt;
	}

	public boolean isPagination() {
		return pagination;
	}

	public void setPagination(boolean pagination) {
		this.pagination = pagination;
	}

	public boolean isCountingTotal() {
		return countingTotal;
	}

	public void setCountingTotal(boolean countingTotal) {
		this.countingTotal = countingTotal;
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

	public String getJsonQueryRules() {
		return jsonQueryRules;
	}

	public void setJsonQueryRules(String jsonQueryRules) {
		this.jsonQueryRules = jsonQueryRules;
		try {
			ArangoDbQueryResult result = new ArangoDbBuilderFactory().builder().build(jsonQueryRules);
			this.parsedFilterAql = result.getQuery();
		}  catch (Exception e) {
			e.printStackTrace();
		}
	}

	public String getParsedFilterAql() {
		return parsedFilterAql;
	}

	public int getStartIndex() {
		return startIndex;
	}

	public void setStartIndex(int startIndex) {
		this.startIndex = startIndex;
	}

	public int getNumberResult() {
		return numberResult;
	}

	public void setNumberResult(int numberResult) {
		this.numberResult = numberResult;
	}

	public List<String> getProfileFields() {
		return profileFields;
	}

	public void setProfileFields(List<String> profileFields) {
		this.profileFields = profileFields;
	}

}
