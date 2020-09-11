package leotech.cdp.model.analytics;

import java.util.List;

import com.google.gson.Gson;
import com.google.gson.annotations.Expose;

/**
 * the data object for primary default reporting
 * 
 * @author tantrieuf31
 * @since 2020
 *
 */
public class DashboardReport {

	@Expose
	String beginFilterDate;

	@Expose
	String endFilterDate;

	@Expose
	String timeUnit;

	@Expose
	List<StatisticCollector> profileTotalStats;

	@Expose
	List<StatisticCollector> profileFunnelData;

	@Expose
	List<StatisticCollector> profileTimeseriesData;

	@Expose
	List<StatisticCollector> eventTotalStats;

	@Expose
	List<StatisticCollector> eventTimeseriesData;

	public DashboardReport() {

	}
	
	
	

	public DashboardReport(String beginFilterDate, String endFilterDate, String timeUnit,
			List<StatisticCollector> profileTotalStats, List<StatisticCollector> profileFunnelData,
			List<StatisticCollector> profileTimeseriesData, List<StatisticCollector> eventTotalStats,
			List<StatisticCollector> eventTimeseriesData) {
		super();
		this.beginFilterDate = beginFilterDate;
		this.endFilterDate = endFilterDate;
		this.timeUnit = timeUnit;
		this.profileTotalStats = profileTotalStats;
		this.profileFunnelData = profileFunnelData;
		this.profileTimeseriesData = profileTimeseriesData;
		this.eventTotalStats = eventTotalStats;
		this.eventTimeseriesData = eventTimeseriesData;
	}




	@Override
	public String toString() {
		return new Gson().toJson(this);
	}

	public String getBeginFilterDate() {
		return beginFilterDate;
	}

	public void setBeginFilterDate(String beginFilterDate) {
		this.beginFilterDate = beginFilterDate;
	}

	public String getEndFilterDate() {
		return endFilterDate;
	}

	public void setEndFilterDate(String endFilterDate) {
		this.endFilterDate = endFilterDate;
	}

	public String getTimeUnit() {
		return timeUnit;
	}

	public void setTimeUnit(String timeUnit) {
		this.timeUnit = timeUnit;
	}

	public List<StatisticCollector> getProfileTotalStats() {
		return profileTotalStats;
	}

	public void setProfileTotalStats(List<StatisticCollector> profileTotalStats) {
		this.profileTotalStats = profileTotalStats;
	}

	public List<StatisticCollector> getProfileFunnelData() {
		return profileFunnelData;
	}

	public void setProfileFunnelData(List<StatisticCollector> profileFunnelData) {
		this.profileFunnelData = profileFunnelData;
	}

	public List<StatisticCollector> getProfileTimeseriesData() {
		return profileTimeseriesData;
	}

	public void setProfileTimeseriesData(List<StatisticCollector> profileTimeseriesData) {
		this.profileTimeseriesData = profileTimeseriesData;
	}

	public List<StatisticCollector> getEventTotalStats() {
		return eventTotalStats;
	}

	public void setEventTotalStats(List<StatisticCollector> eventTotalStats) {
		this.eventTotalStats = eventTotalStats;
	}

	

	public List<StatisticCollector> getEventTimeseriesData() {
		return eventTimeseriesData;
	}

	public void setEventTimeseriesData(List<StatisticCollector> eventTimeseriesData) {
		this.eventTimeseriesData = eventTimeseriesData;
	}

}
