package leotech.cdp.model.analytics;

public class StatisticCollector implements Comparable<StatisticCollector>{

	String collectorKey;
	long collectorCount;
	int orderIndex;

	public StatisticCollector() {
		// TODO Auto-generated constructor stub
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
