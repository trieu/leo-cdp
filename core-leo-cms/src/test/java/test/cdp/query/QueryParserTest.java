package test.cdp.query;

import java.io.IOException;

import com.itfsw.query.builder.ArangoDbBuilderFactory;
import com.itfsw.query.builder.exception.ParserNotFoundException;
import com.itfsw.query.builder.support.builder.ArangoDbBuilder;
import com.itfsw.query.builder.support.model.result.ArangoDbQueryResult;

public class QueryParserTest {

	public static void main(String[] args) throws ParserNotFoundException, Exception {
		ArangoDbBuilderFactory factory = new ArangoDbBuilderFactory();
		ArangoDbBuilder builder = factory.builder();

		String json = "{\n" + 
				"  \"condition\": \"OR\",\n" + 
				"  \"rules\": [\n" + 
				"    {\n" + 
				"      \"id\": \"rate\",\n" + 
				"      \"field\": \"rate\",\n" + 
				"      \"type\": \"integer\",\n" + 
				"      \"input\": \"number\",\n" + 
				"      \"operator\": \"equal\",\n" + 
				"      \"value\": 22\n" + 
				"    },\n" + 
				"    {\n" + 
				"      \"id\": \"category\",\n" + 
				"      \"field\": \"category\",\n" + 
				"      \"type\": \"string\",\n" + 
				"      \"input\": \"text\",\n" + 
				"      \"operator\": \"equal\",\n" + 
				"      \"value\": \"38\"\n" + 
				"    },\n" + 
				"    {\n" + 
				"      \"condition\": \"AND\",\n" + 
				"      \"rules\": [\n" + 
				"        {\n" + 
				"          \"id\": \"coord\",\n" + 
				"          \"field\": \"coord\",\n" + 
				"          \"type\": \"string\",\n" + 
				"          \"operator\": \"equal\",\n" + 
				"          \"value\": \"B.3\"\n" + 
				"        },\n" + 
				"        {\n" + 
				"          \"condition\": \"AND\",\n" + 
				"          \"rules\": [\n" + 
				"            {\n" + 
				"              \"id\": \"coord\",\n" + 
				"              \"field\": \"coord\",\n" + 
				"              \"type\": \"string\",\n" + 
				"              \"operator\": \"equal\",\n" + 
				"              \"value\": \"A.1\"\n" + 
				"            },\n" + 
				"            {\n" + 
				"              \"id\": \"coord\",\n" + 
				"              \"field\": \"coord\",\n" + 
				"              \"type\": \"string\",\n" + 
				"              \"operator\": \"equal\",\n" + 
				"              \"value\": \"C.5\"\n" + 
				"            }\n" + 
				"          ]\n" + 
				"        }\n" + 
				"      ]\n" + 
				"    }\n" + 
				"  ],\n" + 
				"  \"valid\": true\n" + 
				"}";
		ArangoDbQueryResult result = builder.build(json );

		System.out.println(result.getQuery());
	}
}
