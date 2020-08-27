package test.cdp.query;

import com.itfsw.query.builder.ArangoDbBuilderFactory;
import com.itfsw.query.builder.exception.ParserNotFoundException;
import com.itfsw.query.builder.support.builder.ArangoDbBuilder;
import com.itfsw.query.builder.support.model.enums.EnumOperator;
import com.itfsw.query.builder.support.model.result.ArangoDbQueryResult;

public class QueryParserTest {

	public static void main(String[] args) throws ParserNotFoundException, Exception {
		

		String jsonRules = "{\"condition\":\"OR\",\"rules\":[{\"id\":\"name\",\"field\":\"username\",\"type\":\"string\",\"input\":\"text\",\"operator\":\"equal\",\"value\":\"Mistic\"}],\"not\":false,\"valid\":true}";

		jsonRules = "{\n" + 
				"  \"condition\": \"AND\",\n" + 
				"  \"rules\": [\n" + 
				"    {\n" + 
				"      \"id\": \"price\",\n" + 
				"      \"field\": \"price\",\n" + 
				"      \"type\": \"double\",\n" + 
				"      \"input\": \"number\",\n" + 
				"      \"operator\": \"less\",\n" + 
				"      \"value\": 10.25\n" + 
				"    },\n" + 
				"    {\n" + 
				"      \"condition\": \"OR\",\n" + 
				"      \"rules\": [\n" + 
				"        {\n" + 
				"          \"id\": \"category\",\n" + 
				"          \"field\": \"category\",\n" + 
				"          \"type\": \"integer\",\n" + 
				"          \"input\": \"select\",\n" + 
				"          \"operator\": \"equal\",\n" + 
				"          \"value\": 2\n" + 
				"        },\n" + 
				"        {\n" + 
				"          \"id\": \"category\",\n" + 
				"          \"field\": \"category\",\n" + 
				"          \"type\": \"integer\",\n" + 
				"          \"input\": \"select\",\n" + 
				"          \"operator\": \"equal\",\n" + 
				"          \"value\": 1\n" + 
				"        },\n" + 
				"        {\n" + 
				"          \"id\": \"name\",\n" + 
				"          \"field\": \"name\",\n" + 
				"          \"type\": \"string\",\n" + 
				"          \"input\": \"text\",\n" + 
				"          \"operator\": \"contains\",\n" + 
				"          \"value\": \"demo\"\n" + 
				"        }\n" + 
				"      ]\n" + 
				"    }\n" + 
				"  ],\n" + 
				"  \"valid\": true\n" + 
				"}";
		ArangoDbQueryResult result = new ArangoDbBuilderFactory().builder().build(jsonRules);
		

		System.out.println(EnumOperator.EQUAL.getValue());
		System.out.println(result.getQuery());
	}
}
