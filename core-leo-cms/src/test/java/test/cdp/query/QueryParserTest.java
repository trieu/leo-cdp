package test.cdp.query;

import com.itfsw.query.builder.ArangoDbBuilderFactory;
import com.itfsw.query.builder.exception.ParserNotFoundException;
import com.itfsw.query.builder.support.builder.ArangoDbBuilder;
import com.itfsw.query.builder.support.model.result.ArangoDbQueryResult;

public class QueryParserTest {

	public static void main(String[] args) throws ParserNotFoundException, Exception {
		ArangoDbBuilderFactory factory = new ArangoDbBuilderFactory();
		ArangoDbBuilder builder = factory.builder();

		String json = "{\"condition\":\"OR\",\"rules\":[{\"id\":\"name\",\"field\":\"username\",\"type\":\"string\",\"input\":\"text\",\"operator\":\"equal\",\"value\":\"Mistic\"}],\"not\":false,\"valid\":true}";

		ArangoDbQueryResult result = builder.build(json );

		System.out.println(result.getQuery());
	}
}
