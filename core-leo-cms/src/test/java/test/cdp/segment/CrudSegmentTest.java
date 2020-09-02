package test.cdp.segment;

import java.io.IOException;

import org.junit.Test;
import org.testng.Assert;

import leotech.cdp.model.customer.Segment;
import leotech.cdp.service.SegmentDataService;



public class CrudSegmentTest {
	
	static String jsonQueryRules = "{\n" + 
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
			"        35\n" + 
			"      ]\n" + 
			"    }\n" + 
			"  ],\n" + 
			"  \"valid\": true\n" + 
			"}";
	static String beginFilterDate = "2020-01-27T00:00:00+07:00";
	static String endFilterDate =  "2020-08-29T00:00:00+07:00";
	
	
    @Test
    public void testCreateNew() throws IOException {
    	Segment sm = new Segment("profiles with age between 18 to 35", jsonQueryRules, beginFilterDate, endFilterDate);
    	System.out.println(sm.getId());
    	Segment s = SegmentDataService.create(sm);
    	Assert.assertEquals(s.getId(), sm.getId());
    }
}
