package test.cdp.query;

import static org.junit.Assert.assertSame;

import java.util.Arrays;
import java.util.List;

import com.itfsw.query.builder.ArangoDbBuilderFactory;
import com.itfsw.query.builder.exception.ParserNotFoundException;
import com.itfsw.query.builder.support.model.result.ArangoDbQueryResult;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.query.ProfileQuery;
import leotech.cdp.service.SegmentDataService;

public class QueryParserTest {

	public static void main(String[] args) throws ParserNotFoundException, Exception {

		String jsonQueryRules = "{\n" + 
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
				"        40\n" + 
				"      ]\n" + 
				"    }\n" + 
				"  ],\n" + 
				"  \"valid\": true\n" + 
				"}";
		
		ArangoDbQueryResult result = new ArangoDbBuilderFactory().builder().build(jsonQueryRules);
		String parsedFilterAql = result.getQuery();
		System.out.println(parsedFilterAql);
		

		String beginFilterDate = "2020-01-27T00:00:00+07:00";
		String endFilterDate =  "2020-04-29T00:00:00+07:00";
		int startIndex = 0;
		int numberResult = 5;
		
		List<String> selectedFields = Arrays.asList("id","primaryEmail","createdAt","firstName","age");
		
		// build query
		ProfileQuery profileQuery = new ProfileQuery(beginFilterDate, endFilterDate, jsonQueryRules, selectedFields);
		
		// pagination
		profileQuery.setStartIndex(startIndex);
		profileQuery.setNumberResult(numberResult);
		
		System.out.println(profileQuery.toArangoDataQuery());
		System.out.println(profileQuery.toArangoCountingQuery());
		System.out.println(profileQuery.updateStartIndexAndGetDataQuery(20));
		
		long count  = ProfileDaoUtil.countProfilesByQuery(profileQuery);
		
		long count2 = SegmentDataService.computeSegmentSize( jsonQueryRules,  beginFilterDate, endFilterDate);
		
		System.out.println(count);
		System.out.println(count2);
		assertSame(count, count2);
		
		List<ProfileSingleDataView> profiles = SegmentDataService.previewTopProfilesSegment("test", jsonQueryRules, selectedFields, beginFilterDate, endFilterDate);
		for (ProfileSingleDataView profile : profiles) {
			System.out.println(profile.getPrimaryEmail() + " " + profile.getAge());
		}
		
	}
}
