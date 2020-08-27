package leotech.query.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class QueryBuilderFilter {

	String id;
	String label;
	String type;
	String input;
	
	String validation;
	String placeholder;
	
	Map<Integer, String> values = new HashMap<Integer, String>();
	
	public QueryBuilderFilter() {
	}
	
	public QueryBuilderFilter(String id, String label, String type, String input) {
		super();
		this.id = id;
		this.label = label;
		this.type = type;
		this.input = input;
	}

	public static QueryBuilderFilter newFilterInputString(String id, String label) {
		QueryBuilderFilter f = new QueryBuilderFilter(id, label, "string", "text");
		return f;
	}
	
	public static QueryBuilderFilter newFilterInputDouble(String id, String label) {
		QueryBuilderFilter f = new QueryBuilderFilter(id, label, "double", "number");
		return f;
	}
	
	
	
	
	
}
