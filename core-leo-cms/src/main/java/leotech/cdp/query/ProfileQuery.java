package leotech.cdp.query;

import java.time.Instant;
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
	List<String> selectedFields;

	// ----- BEGIN query builder
	
	public String toArangoDataQuery() {
		String aql = ProfileQueryBuilder.buildAqlString(filterCreateAt, beginFilterDate, endFilterDate,parsedFilterAql, startIndex, numberResult, selectedFields);
		return aql;
	}
	
	public String toArangoCountingQuery() {
		String aql = ProfileQueryBuilder.buildCoutingQuery(filterCreateAt, beginFilterDate, endFilterDate,parsedFilterAql);
		return aql;
	}
	
	public String updateStartIndexAndGetDataQuery(int startIndex) {
		this.startIndex = startIndex;
		return toArangoDataQuery();
	}
	
	// ----- END query builder
	
	protected ProfileQuery() {
		
	}
	
	public ProfileQuery(String beginFilterDate, String endFilterDate, String jsonQueryRules, List<String> selectedFields) {
		super();
		this.beginFilterDate = beginFilterDate;
		this.endFilterDate = endFilterDate;
		this.selectedFields = selectedFields;
		
		setJsonQueryRules(jsonQueryRules);
	}

	public ProfileQuery(boolean filterCreateAt, boolean pagination, boolean countingTotal, String beginFilterDate,
			String endFilterDate, String jsonQueryRules, int startIndex, int numberResult,
			List<String> selectedFields) {
		super();
		this.filterCreateAt = filterCreateAt;
		this.pagination = pagination;
		this.countingTotal = countingTotal;
		this.beginFilterDate = beginFilterDate;
		this.endFilterDate = endFilterDate;
		
		this.startIndex = startIndex;
		this.numberResult = numberResult;
		this.selectedFields = selectedFields;
		
		setJsonQueryRules(jsonQueryRules);
		
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
	
	protected void setParsedFilterAql(String parsedFilterAql) {
		this.parsedFilterAql = parsedFilterAql;
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

	public List<String> getSelectedFields() {
		return selectedFields;
	}

	public void setSelectedFields(List<String> selectedFields) {
		this.selectedFields = selectedFields;
	}

}
