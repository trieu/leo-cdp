package leotech.cdp.model.analytics;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.annotations.Expose;

public class DashboardReport {

	@Expose
	String beginFilterDate;

	@Expose
	String endFilterDate;

	@Expose
	Map<String, Long> totalCustomerStatistics = new HashMap<String, Long>();

	@Expose
	Map<String, Long> totalEventStatistics = new HashMap<String, Long>();

	@Expose
	List<ReportUnit> behavioralEventFunnel = new ArrayList<ReportUnit>(10);

	@Expose
	List<ReportUnit> customerEventFunnel = new ArrayList<ReportUnit>(10);

	public DashboardReport() {

	}

	public DashboardReport(String beginFilterDate, String endFilterDate, Map<String, Long> totalCustomerStatistics,
			Map<String, Long> totalEventStatistics, List<ReportUnit> behavioralEventFunnel,
			List<ReportUnit> customerEventFunnel) {
		super();

		this.beginFilterDate = beginFilterDate;
		this.endFilterDate = endFilterDate;

		this.totalCustomerStatistics = totalCustomerStatistics;
		this.totalEventStatistics = totalEventStatistics;

		this.behavioralEventFunnel = behavioralEventFunnel;
		Collections.sort(this.behavioralEventFunnel);

		this.customerEventFunnel = customerEventFunnel;
		Collections.sort(this.customerEventFunnel);
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

	public Map<String, Long> getTotalCustomerStatistics() {
		return totalCustomerStatistics;
	}

	public void setTotalCustomerStatistics(Map<String, Long> totalCustomerStatistics) {
		this.totalCustomerStatistics = totalCustomerStatistics;
	}

	public Map<String, Long> getTotalEventStatistics() {
		return totalEventStatistics;
	}

	public void setTotalEventStatistics(Map<String, Long> totalEventStatistics) {
		this.totalEventStatistics = totalEventStatistics;
	}

	public List<ReportUnit> getBehavioralEventFunnel() {
		return behavioralEventFunnel;
	}

	public void setBehavioralEventFunnel(List<ReportUnit> behavioralEventFunnel) {
		this.behavioralEventFunnel = behavioralEventFunnel;
	}

	public List<ReportUnit> getCustomerEventFunnel() {
		return customerEventFunnel;
	}

	public void setCustomerEventFunnel(List<ReportUnit> customerEventFunnel) {
		this.customerEventFunnel = customerEventFunnel;
	}

	@Override
	public String toString() {
		return new Gson().toJson(this);
	}

}
