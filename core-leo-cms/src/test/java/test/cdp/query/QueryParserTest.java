package test.cdp.query;

import java.util.Arrays;
import java.util.List;

import com.itfsw.query.builder.ArangoDbBuilderFactory;
import com.itfsw.query.builder.exception.ParserNotFoundException;
import com.itfsw.query.builder.support.model.result.ArangoDbQueryResult;

import leotech.cdp.query.ProfileQueryBuilder;

public class QueryParserTest {

	public static void main(String[] args) throws ParserNotFoundException, Exception {
		

		String jsonRules = "{\n" + 
				"  \"condition\": \"AND\",\n" + 
				"  \"rules\": [\n" + 
				"    {\n" + 
				"      \"id\": \"age\",\n" + 
				"      \"field\": \"age\",\n" + 
				"      \"type\": \"integer\",\n" + 
				"      \"input\": \"number\",\n" + 
				"      \"operator\": \"between\",\n" + 
				"      \"value\": [\n" + 
				"        18,\n" + 
				"        30\n" + 
				"      ]\n" + 
				"    }\n" + 
				"  ],\n" + 
				"  \"valid\": true\n" + 
				"}";
		
		ArangoDbQueryResult result = new ArangoDbBuilderFactory().builder().build(jsonRules);
		

		boolean filterCreateAt = true;
		String beginFilterDate = "'2020-04-27T00:00:00+07:00'";
		String endFilterDate =  "'2020-04-29T00:00:00+07:00'";
		String parsedFilterAql = result.getQuery();
		
		int startIndex = 0;
		int numberResult = 5;
		List<String> profileFields = Arrays.asList("id","primaryEmail","createdAt","firstName","age");
		String aql = ProfileQueryBuilder.buildAqlString(filterCreateAt, beginFilterDate, endFilterDate, parsedFilterAql, startIndex, numberResult, profileFields);
		System.out.println(aql);
	}
}
