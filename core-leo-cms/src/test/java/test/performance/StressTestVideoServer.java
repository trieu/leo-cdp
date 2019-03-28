package test.performance;

import org.databene.contiperf.PerfTest;
import org.databene.contiperf.Required;
import org.databene.contiperf.junit.ContiPerfRule;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;

import rfx.core.util.HttpClientUtil;



public class StressTestVideoServer {
	
	@Rule
	public ContiPerfRule i = new ContiPerfRule();
	
	
	
	@Test
	@PerfTest(invocations = 1000, threads = 10)
	@Required(max = 4000, average = 2000)
	public void testBidRequest(){		
		String url = "http://leocms.dev";
		String rs = HttpClientUtil.executeGet(url);		
		Assert.assertTrue(rs.length()>3);
	}
}
