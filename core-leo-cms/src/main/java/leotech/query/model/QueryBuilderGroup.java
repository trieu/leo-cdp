package leotech.query.model;

import java.util.ArrayList;
import java.util.List;

public class QueryBuilderGroup {

	String condition;
	List<Object> rules;
	
	public QueryBuilderGroup(String condition) {
		this.condition = condition;
		this.rules = new ArrayList<Object>();
	}
	
	public String getCondition() {
		return condition;
	}
	public void setCondition(String condition) {
		this.condition = condition;
	}
	public List<Object> getRules() {
		return rules;
	}
	public void setRules(List<Object> rules) {
		this.rules = rules;
	}
	public void addRule(QueryBuilderRule ruleElement) {
		this.rules.add(ruleElement);
	}
	
	public void addRule(QueryBuilderGroup ruleGroup) {
		this.rules.add(ruleGroup);
	}
	
}
