package leotech.cdp.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import leotech.cdp.dao.Analytics360Dao;
import leotech.cdp.model.analytics.DashboardReport;
import leotech.cdp.model.analytics.Notebook;
import leotech.cdp.model.analytics.ReportUnit;
import leotech.cdp.model.analytics.StatisticCollector;
import rfx.core.util.Utils;

public class Analytics360Service {
	
	static Map<String, Notebook> notebooks = new HashMap<String, Notebook>();
	static {
		//FIXME move to database
		
		Notebook n = new Notebook("analytics", "Customer Analytics with RFM and Visualization");
		n.setAccessToken("12345");
		notebooks.put(n.getId(), n);
		
//		n = new Notebook("scoring", "Data Quality Scoring Model");
//		n.setAccessToken("12345");
//		notebooks.put(n.getId(), n);
//		
//		n = new Notebook("scoring", "Lead Scoring Model");
//		n.setAccessToken("12345");
//		notebooks.put( n.getId(), n);
//		
//		n = new Notebook("processor", "Profile Data Identity Resolution");
//		n.setAccessToken("12345");
//		notebooks.put(n.getId(), n);
//		
//		n = new Notebook("scoring", "Customer Lifetime Value Scoring Model");
//		n.setAccessToken("12345");
//		notebooks.put(n.getId(), n);
	}

	public static List<Notebook> getNotebooks(int startIndex, int numberResult){
		
		return new ArrayList<Notebook>(notebooks.values());
	}
	
	public static String runAndExportToHtmlFile(String id) {
		Notebook notebook = notebooks.get(id);
		String nbName = notebook.getJupyterFileUri();
		String pyName = notebook.getPythonFileUri();
		String htmlName = notebook.getHtmlFileUri();
		
		String outputName = nbName.replace(".ipynb", "-output.ipynb");
		String runNbCommand = "papermill "+nbName+" output.ipynb "+nbName;
		String convertToHtmlCommand = "jupyter nbconvert --to html "+nbName;
		return htmlName;
	}
	
	public static DashboardReport getDashboardReport(String beginFilterDate, String endFilterDate) {
		Map<String, Long> totalCustomerStatistics = new HashMap<String, Long>();
		totalCustomerStatistics.put("human profiles", ProfileDataService.countTotalOfProfiles());
		totalCustomerStatistics.put("customer segments", SegmentDataService.countTotalOfSegments());
		
		
		Map<String, Long> totalEventStatistics = new HashMap<String, Long>();
		
		List<ReportUnit> customerEventFunnel = new ArrayList<ReportUnit>();
		
		List<ReportUnit> behavioralEventFunnel = new ArrayList<ReportUnit>();
		
		DashboardReport report = new DashboardReport(beginFilterDate, endFilterDate, totalCustomerStatistics, totalEventStatistics, behavioralEventFunnel, customerEventFunnel);
		
		return report;
	}
	
	public static void main(String[] args) {
		String beginFilterDate = "2020-05-05T02:56:12.102Z";
		String endFilterDate = "2020-09-05T02:56:12.102Z";
		
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		//DashboardReport d = Analytics360Service.getDashboardReport("2018-01-05T02:56:12.102Z", "2020-09-05T02:56:12.102Z");
		
		List<StatisticCollector> statsTotalP = Analytics360Dao.collectProfileTotalStatistics();
		System.out.println(gson.toJson(statsTotalP));
		System.out.println("\n--------\n");
		
		List<StatisticCollector> dailyStatsP = Analytics360Dao.collectProfileTotalStatistics(beginFilterDate, endFilterDate);
		System.out.println(gson.toJson(dailyStatsP));
		System.out.println("\n--------\n");
		
		List<StatisticCollector> timeseriesDataP = Analytics360Dao.collectProfileTotalStatisticsTimeseries(beginFilterDate, endFilterDate);
		System.out.println(gson.toJson(timeseriesDataP));
		System.out.println("\n--------\n");
		
		
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
