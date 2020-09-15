package leotech.cdp.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import leotech.cdp.dao.Analytics360DaoUtil;
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
		
		List<StatisticCollector> profileTotalStats = Analytics360DaoUtil.collectProfileTotalStatistics();
		
		List<StatisticCollector> profileFunnelData = Analytics360DaoUtil.collectProfileFunnelStatistics(beginFilterDate, endFilterDate);
		
		List<StatisticCollector> profileTimeseriesData;
		if(Analytics360Service.MONTHS.equals(timeUnit)) {
			profileTimeseriesData = Analytics360DaoUtil.collectProfileMonthlyStatistics(beginFilterDate, endFilterDate);
		} 
		else if(Analytics360Service.HOURS.equals(timeUnit)) {
			profileTimeseriesData = Analytics360DaoUtil.collectProfileHourlyStatistics(beginFilterDate, endFilterDate);
		} 
		else if(Analytics360Service.DAYS.equals(timeUnit)) {
			profileTimeseriesData = Analytics360DaoUtil.collectProfileDailyStatistics(beginFilterDate, endFilterDate);
		} 
		else {
			profileTimeseriesData = Analytics360DaoUtil.collectProfileYearlyStatistics(beginFilterDate, endFilterDate);
		}
		
		
		List<StatisticCollector> eventTotalStats = Analytics360DaoUtil.collectTrackingEventTotalStatistics();
		List<StatisticCollector> eventFunnelInDatetimeStats = Analytics360DaoUtil.collectTrackingEventTotalStatistics(beginFilterDate, endFilterDate);
		

		List<StatisticCollector> eventTimeseriesData;
		if(Analytics360Service.MONTHS.equals(timeUnit)) {
			eventTimeseriesData = Analytics360DaoUtil.collectEventMonthlyStatistics(beginFilterDate, endFilterDate);
		} 
		else if(Analytics360Service.HOURS.equals(timeUnit)) {
			eventTimeseriesData = Analytics360DaoUtil.collectEventHourlyStatistics(beginFilterDate, endFilterDate);
		} 
		else if(Analytics360Service.DAYS.equals(timeUnit)) {
			eventTimeseriesData = Analytics360DaoUtil.collectEventDailyStatistics(beginFilterDate, endFilterDate);
		} 
		else {
			eventTimeseriesData = Analytics360DaoUtil.collectEventYearlyStatistics(beginFilterDate, endFilterDate);
		}

		DashboardReport report = new DashboardReport(beginFilterDate, endFilterDate, timeUnit, profileTotalStats, profileFunnelData, profileTimeseriesData, eventTotalStats, eventTimeseriesData);

		return report;
	}
	
	
}
