package leotech.query.model;

import com.google.gson.Gson;
import com.google.gson.annotations.Expose;

import rfx.core.util.StringUtil;

/**
 * the data model of https://querybuilder.js.org/
 * 
 * @author tantrieuf31
 * @since 2020
 *
 */
public class QueryBuilderRule {

	@Expose
	String id;
	@Expose
	String field;
	@Expose
	String type;
	@Expose
	String input;
	@Expose
	String operator;
	@Expose
	Object value;

	public QueryBuilderRule() {

	}

	public QueryBuilderRule(String id, String field, String type, String input, String operator, Object value) {
		super();
		this.id = id;
		this.field = field;
		this.type = type;
		this.input = input;
		this.operator = operator;
		this.value = value;
	}
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getField() {
		return field;
	}
	
	public void setField(String field) {
		this.field = field;
	}
	
	public String getType() {
		return type;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	public String getInput() {
		return input;
	}
	
	public void setInput(String input) {
		this.input = input;
	}
	
	public String getOperator() {
		return operator;
	}
	
	public void setOperator(String operator) {
		this.operator = operator;
	}
	
	public Object getValue() {
		return value;
	}
	
	public void setValue(Object value) {
		this.value = value;
	}

	public int valueAsInteger() {
		if ("integer".equals(type)) {
			return StringUtil.safeParseInt(value);
		}
		return 0;
	}

	public String valueAsString() {
		if ("string".equals(type)) {
			return StringUtil.safeString(value, "");
		}
		return "";
	}

	public double valueAsDouble() {
		if ("double".equals(type)) {
			return StringUtil.safeParseDouble(StringUtil.safeString(value, "0"));
		}
		return 0;
	}

	@Override
	public String toString() {
		return new Gson().toJson(this);
	}

}
