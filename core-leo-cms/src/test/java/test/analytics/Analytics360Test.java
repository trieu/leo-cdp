package test.analytics;

import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import leotech.cdp.dao.Analytics360Dao;
import leotech.cdp.model.analytics.StatisticCollector;
import rfx.core.util.Utils;

public class Analytics360Test {

	public static void main(String[] args) {
		String beginFilterDate = "2020-05-05T02:56:12.102Z";
		String endFilterDate = "2020-09-05T02:56:12.102Z";
		
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		//DashboardReport d = Analytics360Service.getDashboardReport("2018-01-05T02:56:12.102Z", "2020-09-05T02:56:12.102Z");
		
		// profile
		
		List<StatisticCollector> statsTotalP = Analytics360Dao.collectProfileTotalStatistics();
		System.out.println(gson.toJson(statsTotalP));
		System.out.println("\n--------\n");
		
		List<StatisticCollector> dailyStatsP = Analytics360Dao.collectProfileTotalStatistics(beginFilterDate, endFilterDate);
		System.out.println(gson.toJson(dailyStatsP));
		System.out.println("\n--------\n");
		
		List<StatisticCollector> timeseriesDataP = Analytics360Dao.collectProfileTotalStatisticsTimeseries(beginFilterDate, endFilterDate);
		System.out.println(gson.toJson(timeseriesDataP));
		System.out.println("\n--------\n");
		
		// events
		
		List<StatisticCollector> statsTotalE = Analytics360Dao.collectTrackingEventTotalStatistics();
		System.out.println(gson.toJson(statsTotalE));
		System.out.println("\n--------\n");
		
		List<StatisticCollector> dailyStatsE = Analytics360Dao.collectTrackingEventTotalStatistics(beginFilterDate, endFilterDate);
		System.out.println(gson.toJson(dailyStatsE));
		System.out.println("\n--------\n");
		
		List<StatisticCollector> timeseriesDataE = Analytics360Dao.collectTrackingEventTotalStatisticsTimeseries(beginFilterDate, endFilterDate);
		System.out.println(gson.toJson(timeseriesDataE));
		Utils.exitSystemAfterTimeout(1000);
	}
}
