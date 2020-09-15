package test.analytics;

import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import leotech.cdp.dao.Analytics360DaoUtil;
import leotech.cdp.model.analytics.StatisticCollector;
import rfx.core.util.Utils;

public class Analytics360Test {

	public static void main(String[] args) {
		String beginFilterDate = "2020-05-05T02:56:12.102Z";
		String endFilterDate = "2020-09-05T02:56:12.102Z";
		
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		//DashboardReport d = Analytics360Service.getDashboardReport("2018-01-05T02:56:12.102Z", "2020-09-05T02:56:12.102Z");
		
		// profile
		
		List<StatisticCollector> statsTotalP = Analytics360DaoUtil.collectProfileTotalStatistics();
		System.out.println(gson.toJson(statsTotalP));
		System.out.println("\n--------\n");
		
		List<StatisticCollector> dailyStatsP = Analytics360DaoUtil.collectProfileFunnelStatistics(beginFilterDate, endFilterDate);
		System.out.println(gson.toJson(dailyStatsP));
		System.out.println("\n--------\n");
		
		List<StatisticCollector> timeseriesDataP = Analytics360DaoUtil.collectProfileDailyStatistics(beginFilterDate, endFilterDate);
		System.out.println(gson.toJson(timeseriesDataP));
		System.out.println("\n--------\n");
		
		// events
		
		List<StatisticCollector> statsTotalE = Analytics360DaoUtil.collectTrackingEventTotalStatistics();
		System.out.println(gson.toJson(statsTotalE));
		System.out.println("\n--------\n");
		
		List<StatisticCollector> dailyStatsE = Analytics360DaoUtil.collectTrackingEventTotalStatistics(beginFilterDate, endFilterDate);
		System.out.println(gson.toJson(dailyStatsE));
		System.out.println("\n--------\n");
		
		List<StatisticCollector> timeseriesDataE = Analytics360DaoUtil.collectEventDailyStatistics(beginFilterDate, endFilterDate);
		System.out.println(gson.toJson(timeseriesDataE));
		Utils.exitSystemAfterTimeout(1000);
	}
}
