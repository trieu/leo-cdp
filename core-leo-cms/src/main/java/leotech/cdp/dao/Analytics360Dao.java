package leotech.cdp.dao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoDatabase;

import leotech.cdp.model.analytics.StatisticCollector;
import leotech.cdp.model.journey.DataFlowStage;
import leotech.cdp.service.Analytics360Service;
import leotech.cdp.service.FunnelDataService;
import leotech.cdp.service.ProfileDataService;
import leotech.cdp.service.SegmentDataService;
import leotech.system.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbQuery.CallbackQuery;

public class Analytics360Dao extends BaseLeoCdpDao {
	
	
	
	static final String CUSTOMER_SEGMENT = "Customer Segment";
	static final String CUSTOMER_PROFILE = "Customer Profile";
	
	// profile statistics
	static final String AQL_PROFILE_COLLECTOR_TOTAL = AqlTemplate.get("AQL_PROFILE_COLLECTOR_TOTAL");
	static final String AQL_PROFILE_COLLECTOR_IN_DATE_RANGE = AqlTemplate.get("AQL_PROFILE_COLLECTOR_IN_DATE_RANGE");
	static final String AQL_PROFILE_TIMESERIES_COLLECTOR = AqlTemplate.get("AQL_PROFILE_TIMESERIES_COLLECTOR");
	
	// event statistics
	static final String AQL_EVENT_COLLECTOR_TOTAL = AqlTemplate.get("AQL_EVENT_COLLECTOR_TOTAL");
	static final String AQL_EVENT_COLLECTOR_TOTAL_IN_DATE_RANGE = AqlTemplate.get("AQL_EVENT_COLLECTOR_TOTAL_IN_DATE_RANGE");
	static final String AQL_EVENT_TIMESERIES_COLLECTOR = AqlTemplate.get("AQL_EVENT_TIMESERIES_COLLECTOR");
	
	
	// ---- Profile Statistics ---- //
	
	/**
	 * @return data for Total Customer Statistics box
	 */
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
		
		long totalHumanProfile = ProfileDataService.countTotalOfProfiles();
		long totalSegments = SegmentDataService.countTotalOfSegments();
		
		List<StatisticCollector> profileStats = new ArrayList<StatisticCollector>(list.size() + 2);
		profileStats.add(new StatisticCollector(CUSTOMER_PROFILE, totalHumanProfile, -2));
		profileStats.add(new StatisticCollector(CUSTOMER_SEGMENT, totalSegments, -1));
		profileStats.addAll(list);
		
		return profileStats;
	}
	
	/**
	 * @param beginFilterDate
	 * @param endFilterDate
	 * @return data for 
	 */
	public static List<StatisticCollector> collectProfileFunnelStatistics(String beginFilterDate, String endFilterDate){
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
		List<DataFlowStage> stages = FunnelDataService.getCustomerFunnelStages();
		Map<String, StatisticCollector> funnelData = new HashMap<>(stages.size());
		for (DataFlowStage stage : stages) {
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
	
	public static List<StatisticCollector> collectProfileHourlyStatistics(String beginFilterDate, String endFilterDate){
		String aql = AQL_PROFILE_TIMESERIES_COLLECTOR;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackProfileStatisticCollector();
		return collectTimeseriesData(Analytics360Service.HOURS,beginFilterDate, endFilterDate, aql, callback);
	}
	
	public static List<StatisticCollector> collectProfileDailyStatistics(String beginFilterDate, String endFilterDate){
		String aql = AQL_PROFILE_TIMESERIES_COLLECTOR;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackProfileStatisticCollector();
		return collectTimeseriesData(Analytics360Service.DAYS,beginFilterDate, endFilterDate, aql, callback);
	}
	
	public static List<StatisticCollector> collectProfileMonthlyStatistics(String beginFilterDate, String endFilterDate){
		String aql = AQL_PROFILE_TIMESERIES_COLLECTOR;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackProfileStatisticCollector();
		return collectTimeseriesData(Analytics360Service.MONTHS,beginFilterDate, endFilterDate, aql, callback);
	}
	
	public static List<StatisticCollector> collectProfileYearlyStatistics(String beginFilterDate, String endFilterDate){
		String aql = AQL_PROFILE_TIMESERIES_COLLECTOR;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackProfileStatisticCollector();
		return collectTimeseriesData(Analytics360Service.YEARS,beginFilterDate, endFilterDate, aql, callback);
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
	
	public static List<StatisticCollector> collectEventHourlyStatistics(String beginFilterDate, String endFilterDate){
		String aql = AQL_EVENT_TIMESERIES_COLLECTOR;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackEventStatisticCollector();
		return collectTimeseriesData(Analytics360Service.HOURS,beginFilterDate, endFilterDate, aql, callback);
	}
	
	public static List<StatisticCollector> collectEventDailyStatistics(String beginFilterDate, String endFilterDate){
		String aql = AQL_EVENT_TIMESERIES_COLLECTOR;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackEventStatisticCollector();
		return collectTimeseriesData(Analytics360Service.DAYS,beginFilterDate, endFilterDate, aql, callback);
	}
	
	public static List<StatisticCollector> collectEventMonthlyStatistics(String beginFilterDate, String endFilterDate){
		String aql = AQL_EVENT_TIMESERIES_COLLECTOR;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackEventStatisticCollector();
		return collectTimeseriesData(Analytics360Service.MONTHS,beginFilterDate, endFilterDate, aql, callback);
	}
	
	public static List<StatisticCollector> collectEventYearlyStatistics(String beginFilterDate, String endFilterDate){
		String aql = AQL_EVENT_TIMESERIES_COLLECTOR;
		CallbackQuery<StatisticCollector> callback = StatisticCollector.callbackEventStatisticCollector();
		return collectTimeseriesData(Analytics360Service.YEARS,beginFilterDate, endFilterDate, aql, callback);
	}
	
	// ---- Tracking Event Statistics ---- //
	
	

	protected static List<StatisticCollector> collectTotalStatistics(String aql, CallbackQuery<StatisticCollector> callback){
		ArangoDatabase db = getCdpDbInstance();
		ArangoDbQuery<StatisticCollector> q = new ArangoDbQuery<StatisticCollector>(db, aql, StatisticCollector.class, callback);
		List<StatisticCollector> list = q.getResultsAsList();
		Collections.sort(list);
		return list;
	}
	
	protected static List<StatisticCollector> collectTotalStatisticsInDateRange(String beginFilterDate, String endFilterDate, String aql, CallbackQuery<StatisticCollector> callback){
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("beginFilterDate", beginFilterDate);
		bindVars.put("endFilterDate", endFilterDate);
		ArangoDbQuery<StatisticCollector> q = new ArangoDbQuery<StatisticCollector>(db, aql, bindVars, StatisticCollector.class,callback);
		List<StatisticCollector> list = q.getResultsAsList();
		Collections.sort(list);
		return list;
	}
	
	protected static List<StatisticCollector> collectTimeseriesData(String truncatedTimeUnit, String beginFilterDate, String endFilterDate, String aql, CallbackQuery<StatisticCollector> callback){
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(3);
		bindVars.put("beginFilterDate", beginFilterDate);
		bindVars.put("endFilterDate", endFilterDate);
		bindVars.put("truncatedUnit",truncatedTimeUnit);// https://www.arangodb.com/docs/3.7/aql/functions-date.html#date_trunc
		ArangoDbQuery<StatisticCollector> q = new ArangoDbQuery<StatisticCollector>(db, aql, bindVars, StatisticCollector.class,callback);
		List<StatisticCollector> list = q.getResultsAsList();
		Collections.sort(list);
		return list;
	}
}
