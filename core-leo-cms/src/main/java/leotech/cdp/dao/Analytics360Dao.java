package leotech.cdp.dao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.SortedMap;
import java.util.TreeMap;

import com.arangodb.ArangoDatabase;

import leotech.cdp.model.analytics.StatisticCollector;
import leotech.cdp.model.journey.FunnelStage;
import leotech.cdp.service.FunnelDataService;
import leotech.cdp.service.ProfileDataService;
import leotech.cdp.service.SegmentDataService;
import leotech.system.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbQuery.CallbackQuery;

public class Analytics360Dao extends BaseLeoCdpDao {
	
	private static final String CUSTOMER_SEGMENTS = "Customer Segment";
	private static final String HUMAN_PROFILES = "Customer Profile";
	
	// profile statistics
	static final String AQL_PROFILE_COLLECTOR_TOTAL = AqlTemplate.get("AQL_PROFILE_COLLECTOR_TOTAL");
	static final String AQL_PROFILE_COLLECTOR_IN_DATE_RANGE = AqlTemplate.get("AQL_PROFILE_COLLECTOR_IN_DATE_RANGE");
	static final String AQL_PROFILE_TIMESERIES_COLLECTOR = AqlTemplate.get("AQL_PROFILE_TIMESERIES_COLLECTOR");
	
	// event statistics
	static final String AQL_EVENT_COLLECTOR_TOTAL = AqlTemplate.get("AQL_EVENT_COLLECTOR_TOTAL");
	static final String AQL_EVENT_COLLECTOR_TOTAL_IN_DATE_RANGE = AqlTemplate.get("AQL_EVENT_COLLECTOR_TOTAL_IN_DATE_RANGE");
	static final String AQL_EVENT_TIMESERIES_COLLECTOR = AqlTemplate.get("AQL_EVENT_TIMESERIES_COLLECTOR");
	
	
	// ---- Profile Statistics ---- //
	public static List<StatisticCollector> collectProfileTotalStatistics(){
		String aql = AQL_PROFILE_COLLECTOR_TOTAL;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackProfileStatisticCollector();
		List<StatisticCollector> list = collectTotalStatistics(aql,callback);
		
		for (StatisticCollector statisticCollector1 : list) {
			for (StatisticCollector statisticCollector2 : list) {
				if(statisticCollector1.getOrderIndex() < statisticCollector2.getOrderIndex()) {
					statisticCollector1.unionSetCollectorCount(statisticCollector2.getCollectorCount());
				}
			}
		}
		
		List<StatisticCollector> profileStats = new ArrayList<StatisticCollector>(list.size() + 2);
		long totalHumanProfile = ProfileDataService.countTotalOfProfiles();
		long totalSegments = SegmentDataService.countTotalOfSegments();
		
		profileStats.add(new StatisticCollector(HUMAN_PROFILES, totalHumanProfile, -2));
		profileStats.add(new StatisticCollector(CUSTOMER_SEGMENTS, totalSegments, -1));
		profileStats.addAll(list);
		
		return profileStats;
	}
	
	public static List<StatisticCollector> collectProfileTotalStatistics(String beginFilterDate, String endFilterDate){
		String aql = AQL_PROFILE_COLLECTOR_IN_DATE_RANGE;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackProfileStatisticCollector();
		
		List<StatisticCollector> queriedList =  collectTotalStatisticsInDateRange(beginFilterDate, endFilterDate, aql, callback);
		for (StatisticCollector statisticCollector1 : queriedList) {
			for (StatisticCollector statisticCollector2 : queriedList) {
				if(statisticCollector1.getOrderIndex() < statisticCollector2.getOrderIndex()) {
					statisticCollector1.unionSetCollectorCount(statisticCollector2.getCollectorCount());
				}
			}
		}
		
		// seeding empty data from defined funnel
		List<FunnelStage> stages = FunnelDataService.getCustomerFunnelStages();
		Map<String, StatisticCollector> funnelData = new HashMap<>(stages.size());
		for (FunnelStage stage : stages) {
			StatisticCollector defC = new StatisticCollector(stage.getName(), 0, stage.getOrderIndex());
			funnelData.put(defC.getCollectorKey(), defC);
		}
		
		// set real data from queried stats collector
		for (StatisticCollector collector : queriedList) {
			StatisticCollector c = funnelData.get(collector.getCollectorKey());
			if(c != null) {
				c.setCollectorCount(collector.getCollectorCount());
			}
		}
		
		//sorting for ordered stage in funnel
		List<StatisticCollector> finalResults = new ArrayList<StatisticCollector>(funnelData.values());
		Collections.sort(finalResults);
		return finalResults;
	}
	
	public static List<StatisticCollector> collectProfileTotalStatisticsTimeseries(String beginFilterDate, String endFilterDate){
		String aql = AQL_PROFILE_TIMESERIES_COLLECTOR;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackProfileStatisticCollector();
		return collectTotalStatisticsTimeseries(beginFilterDate, endFilterDate, aql, callback);
	}
	// ---- Profile Statistics ---- //
	
	
	
	// ---- Tracking Event Statistics ---- //
	public static List<StatisticCollector> collectTrackingEventTotalStatistics(){
		String aql = AQL_EVENT_COLLECTOR_TOTAL;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackEventStatisticCollector();
		return collectTotalStatistics(aql,callback);
	}
	
	public static List<StatisticCollector> collectTrackingEventTotalStatistics(String beginFilterDate, String endFilterDate){
		String aql = AQL_EVENT_COLLECTOR_TOTAL_IN_DATE_RANGE;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackEventStatisticCollector();
		return collectTotalStatisticsInDateRange(beginFilterDate, endFilterDate, aql, callback);
	}
	
	public static List<StatisticCollector> collectTrackingEventTotalStatisticsTimeseries(String beginFilterDate, String endFilterDate){
		String aql = AQL_EVENT_TIMESERIES_COLLECTOR;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackEventStatisticCollector();
		return collectTotalStatisticsTimeseries(beginFilterDate, endFilterDate, aql, callback);
	}
	// ---- Tracking Event Statistics ---- //
	
	
	
	
	

	public static List<StatisticCollector> collectTotalStatistics(String aql, CallbackQuery<StatisticCollector> callback){
		ArangoDatabase db = getCdpDbInstance();
		ArangoDbQuery<StatisticCollector> q = new ArangoDbQuery<StatisticCollector>(db, aql, StatisticCollector.class, callback);
		List<StatisticCollector> list = q.getResultsAsList();
		Collections.sort(list);
		return list;
	}
	
	public static List<StatisticCollector> collectTotalStatisticsInDateRange(String beginFilterDate, String endFilterDate, String aql, CallbackQuery<StatisticCollector> callback){
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("beginFilterDate", beginFilterDate);
		bindVars.put("endFilterDate", endFilterDate);
		ArangoDbQuery<StatisticCollector> q = new ArangoDbQuery<StatisticCollector>(db, aql, bindVars, StatisticCollector.class,callback);
		List<StatisticCollector> list = q.getResultsAsList();
		Collections.sort(list);
		return list;
	}
	
	public static List<StatisticCollector> collectTotalStatisticsTimeseries(String beginFilterDate, String endFilterDate, String aql, CallbackQuery<StatisticCollector> callback){
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(3);
		bindVars.put("beginFilterDate", beginFilterDate);
		bindVars.put("endFilterDate", endFilterDate);
		bindVars.put("truncatedUnit","days");// https://www.arangodb.com/docs/3.7/aql/functions-date.html#date_trunc
		ArangoDbQuery<StatisticCollector> q = new ArangoDbQuery<StatisticCollector>(db, aql, bindVars, StatisticCollector.class,callback);
		List<StatisticCollector> list = q.getResultsAsList();
		Collections.sort(list);
		return list;
	}
}
