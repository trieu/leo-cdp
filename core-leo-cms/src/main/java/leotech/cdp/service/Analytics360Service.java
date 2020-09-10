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
	public static final String YEARS = "years";
	public static final String MONTHS = "months";
	public static final String DAYS = "days";
	public static final String HOURS = "hours";
	
	static Map<String, Notebook> notebooks = new HashMap<String, Notebook>();
	static {
		//FIXME move to database
		
		Notebook n = new Notebook("analytics", "Visual Customer Analytics");
		n.setAccessToken("12345");
		notebooks.put(n.getId(), n);
		
		n = new Notebook("scoring", "Customer Scoring with RFM model");
		n.setAccessToken("12345");
		notebooks.put(n.getId(), n);
		
		n = new Notebook("scoring", "Data Quality Scoring Model");
		n.setAccessToken("12345");
		notebooks.put(n.getId(), n);

		n = new Notebook("processor", "Unified Customer Identity Resolution");
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
	
	public static DashboardReport getDashboardReport(String beginFilterDate, String endFilterDate, String timeUnit) {
		
		List<StatisticCollector> profileTotalStats = Analytics360Dao.collectProfileTotalStatistics();
		
		List<StatisticCollector> profileFunnelInDatetimeStats = Analytics360Dao.collectProfileFunnelStatistics(beginFilterDate, endFilterDate);
		
		List<StatisticCollector> profileTimeseriesStats;
		if(Analytics360Service.MONTHS.equals(timeUnit)) {
			profileTimeseriesStats = Analytics360Dao.collectProfileMonthlyStatistics(beginFilterDate, endFilterDate);
		} 
		else if(Analytics360Service.HOURS.equals(timeUnit)) {
			profileTimeseriesStats = Analytics360Dao.collectProfileHourlyStatistics(beginFilterDate, endFilterDate);
		} 
		else if(Analytics360Service.DAYS.equals(timeUnit)) {
			profileTimeseriesStats = Analytics360Dao.collectProfileDailyStatistics(beginFilterDate, endFilterDate);
		} 
		else {
			profileTimeseriesStats = Analytics360Dao.collectProfileYearlyStatistics(beginFilterDate, endFilterDate);
		}
		
		
		List<StatisticCollector> eventTotalStats = Analytics360Dao.collectTrackingEventTotalStatistics();
		List<StatisticCollector> eventFunnelInDatetimeStats = Analytics360Dao.collectTrackingEventTotalStatistics(beginFilterDate, endFilterDate);
		

		List<StatisticCollector> eventTimeseriesStats;
		if(Analytics360Service.MONTHS.equals(timeUnit)) {
			eventTimeseriesStats = Analytics360Dao.collectEventMonthlyStatistics(beginFilterDate, endFilterDate);
		} 
		else if(Analytics360Service.HOURS.equals(timeUnit)) {
			eventTimeseriesStats = Analytics360Dao.collectEventHourlyStatistics(beginFilterDate, endFilterDate);
		} 
		else if(Analytics360Service.DAYS.equals(timeUnit)) {
			eventTimeseriesStats = Analytics360Dao.collectEventDailyStatistics(beginFilterDate, endFilterDate);
		} 
		else {
			eventTimeseriesStats = Analytics360Dao.collectEventYearlyStatistics(beginFilterDate, endFilterDate);
		}
		
		
		DashboardReport report = new DashboardReport();
		
		
		return report;
	}
	
	
}
