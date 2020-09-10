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
	List<StatisticCollector> profileTotalStats;

	@Expose
	List<StatisticCollector> profileFunnelInDatetimeStats;

	@Expose
	List<StatisticCollector> profileTimeseriesStats;

	@Expose
	List<StatisticCollector> eventTotalStats;

	@Expose
	List<StatisticCollector> eventFunnelInDatetimeStats;

	@Expose
	List<StatisticCollector> eventTimeseriesStats;

	public DashboardReport() {

	}

	public DashboardReport(String beginFilterDate, String endFilterDate, List<StatisticCollector> profileTotalStats,
			List<StatisticCollector> profileFunnelInDatetimeStats, List<StatisticCollector> profileTimeseriesStats,
			List<StatisticCollector> eventTotalStats, List<StatisticCollector> eventFunnelInDatetimeStats,
			List<StatisticCollector> eventTimeseriesStats) {
		super();
		this.beginFilterDate = beginFilterDate;
		this.endFilterDate = endFilterDate;
		this.profileTotalStats = profileTotalStats;
		this.profileFunnelInDatetimeStats = profileFunnelInDatetimeStats;
		this.profileTimeseriesStats = profileTimeseriesStats;
		this.eventTotalStats = eventTotalStats;
		this.eventFunnelInDatetimeStats = eventFunnelInDatetimeStats;
		this.eventTimeseriesStats = eventTimeseriesStats;
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

	public List<StatisticCollector> getProfileTotalStats() {
		return profileTotalStats;
	}

	public void setProfileTotalStats(List<StatisticCollector> profileTotalStats) {
		this.profileTotalStats = profileTotalStats;
	}

	public List<StatisticCollector> getProfileFunnelInDatetimeStats() {
		return profileFunnelInDatetimeStats;
	}

	public void setProfileFunnelInDatetimeStats(List<StatisticCollector> profileFunnelInDatetimeStats) {
		this.profileFunnelInDatetimeStats = profileFunnelInDatetimeStats;
	}

	public List<StatisticCollector> getProfileTimeseriesStats() {
		return profileTimeseriesStats;
	}

	public void setProfileTimeseriesStats(List<StatisticCollector> profileTimeseriesStats) {
		this.profileTimeseriesStats = profileTimeseriesStats;
	}

	public List<StatisticCollector> getEventTotalStats() {
		return eventTotalStats;
	}

	public void setEventTotalStats(List<StatisticCollector> eventTotalStats) {
		this.eventTotalStats = eventTotalStats;
	}

	public List<StatisticCollector> getEventFunnelInDatetimeStats() {
		return eventFunnelInDatetimeStats;
	}

	public void setEventFunnelInDatetimeStats(List<StatisticCollector> eventFunnelInDatetimeStats) {
		this.eventFunnelInDatetimeStats = eventFunnelInDatetimeStats;
	}

	public List<StatisticCollector> getEventTimeseriesStats() {
		return eventTimeseriesStats;
	}

	public void setEventTimeseriesStats(List<StatisticCollector> eventTimeseriesStats) {
		this.eventTimeseriesStats = eventTimeseriesStats;
	}

}
