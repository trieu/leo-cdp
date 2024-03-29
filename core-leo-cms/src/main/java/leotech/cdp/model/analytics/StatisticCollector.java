package leotech.cdp.model.analytics;

import java.util.Date;

import leotech.cdp.model.journey.BehavioralEventMetric;
import leotech.cdp.model.journey.DataFlowStage;
import leotech.cdp.service.FunnelDataService;
import leotech.system.util.database.ArangoDbQuery.CallbackQuery;
import rfx.core.util.StringUtil;

public class StatisticCollector implements Comparable<StatisticCollector>{
	
	public static CallbackQuery<StatisticCollector> callbackProfileStatisticCollector() {
		CallbackQuery<StatisticCollector> cb = new CallbackQuery<StatisticCollector>() {
			@Override
			public StatisticCollector apply(StatisticCollector obj) {
				DataFlowStage funnelStage = FunnelDataService.getFunnelStageById(obj.getCollectorKey());
				int index = funnelStage.getOrderIndex();
				obj.setOrderIndex(index);
				obj.setCollectorKey(funnelStage.getName());
				return obj;
			}
		};
		return cb;
	}
	
	public static CallbackQuery<StatisticCollector> callbackEventStatisticCollector() {
		CallbackQuery<StatisticCollector> cb = new CallbackQuery<StatisticCollector>() {
			@Override
			public StatisticCollector apply(StatisticCollector obj) {
				BehavioralEventMetric metric = FunnelDataService.getBehavioralEventMetric(obj.getCollectorKey());
				int index = metric.getScore();
				obj.setOrderIndex(index);
				obj.setCollectorKey(metric.getEventLabel());
				return obj;
			}
		};
		return cb;
	}

	String collectorKey = "";
	long collectorCount = 0;
	int orderIndex = 0;
	Date dateTime = null;

	public StatisticCollector() {
		
	}

	public StatisticCollector(String collectorKey, long collectorCount, int orderIndex) {
		super();
		this.collectorKey = collectorKey;
		this.collectorCount = collectorCount;
		this.orderIndex = orderIndex;
	}

	public int getOrderIndex() {
		return orderIndex;
	}

	public void setOrderIndex(int orderIndex) {
		this.orderIndex = orderIndex;
	}

	public String getCollectorKey() {
		return collectorKey;
	}
	public void setCollectorKey(String collectorKey) {
		this.collectorKey = collectorKey;
	}
	public long getCollectorCount() {
		return collectorCount;
	}

	public void setCollectorCount(long collectorCount) {
		this.collectorCount = collectorCount;
	}
	
	public void unionSetCollectorCount(long collectorCount) {
		this.collectorCount += collectorCount;
	}

	public Date getDateTime() {
		return dateTime;
	}
	public void setDateTime(Date dateTime) {
		this.dateTime = dateTime;
	}
	
	@Override
	public boolean equals(Object obj) {
		return this.hashCode() == obj.hashCode();
	}
	
	@Override
	public int hashCode() {
		if(StringUtil.isNotEmpty(collectorKey)) {
			return this.collectorKey.hashCode();
		}
		return 0;
	}

	@Override
	public int compareTo(StatisticCollector o) {
		if(this.orderIndex > o.getOrderIndex()) {
			return 1;
		}
		else if(this.orderIndex < o.getOrderIndex()) {
			return -1;
		}
		return 0;
	}

}
