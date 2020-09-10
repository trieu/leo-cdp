package leotech.cdp.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import leotech.cdp.dao.Analytics360Dao;
import leotech.cdp.model.analytics.DashboardReport;
import leotech.cdp.model.analytics.Notebook;
import leotech.cdp.model.analytics.StatisticCollector;

public class Analytics360Service {
	
	static Map<String, Notebook> notebooks = new HashMap<String, Notebook>();
	static {
		//FIXME move to database
		
		Notebook n = new Notebook("analytics", "Customer Analytics with RFM and Visualization");
		n.setAccessToken("12345");
		notebooks.put(n.getId(), n);
		
		n = new Notebook("scoring", "Data Quality Scoring Model");
		n.setAccessToken("12345");
		notebooks.put(n.getId(), n);

		n = new Notebook("processor", "Profile Data Identity Resolution");
		n.setAccessToken("12345");
		notebooks.put(n.getId(), n);
	
		n = new Notebook("scoring", "Customer Lifetime Value Scoring Model");
		n.setAccessToken("12345");
		notebooks.put(n.getId(), n);
	}

	public static List<Notebook> getNotebooks(int startIndex, int numberResult){
		
		return new ArrayList<Notebook>(notebooks.values());
	}
	
	public static String runAndExportToHtmlFile(String id) {
		Notebook notebook = notebooks.get(id);
		//TODO
		String nbName = notebook.getJupyterFileUri();
		String pyName = notebook.getPythonFileUri();
		String htmlName = notebook.getHtmlFileUri();
		
		String outputName = nbName.replace(".ipynb", "-output.ipynb");
		String runNbCommand = "papermill "+nbName+" output.ipynb "+nbName;
		String convertToHtmlCommand = "jupyter nbconvert --to html "+nbName;
		return htmlName;
	}
	
	public static DashboardReport getDashboardReport(String beginFilterDate, String endFilterDate) {
		
		List<StatisticCollector> profileTotalStats = Analytics360Dao.collectProfileTotalStatistics();
		List<StatisticCollector> profileFunnelInDatetimeStats = Analytics360Dao.collectProfileTotalStatistics(beginFilterDate, endFilterDate);
		List<StatisticCollector> profileTimeseriesStats = Analytics360Dao.collectProfileTotalStatisticsTimeseries(beginFilterDate, endFilterDate);
		
		List<StatisticCollector> eventTotalStats = Analytics360Dao.collectTrackingEventTotalStatistics();
		List<StatisticCollector> eventFunnelInDatetimeStats = Analytics360Dao.collectTrackingEventTotalStatistics(beginFilterDate, endFilterDate);
		List<StatisticCollector> eventTimeseriesStats = Analytics360Dao.collectTrackingEventTotalStatisticsTimeseries(beginFilterDate, endFilterDate);
		
		DashboardReport report = new DashboardReport(beginFilterDate, endFilterDate, profileTotalStats, profileFunnelInDatetimeStats, profileTimeseriesStats, eventTotalStats, eventFunnelInDatetimeStats, eventTimeseriesStats);
		
		return report;
	}
	
	
}
