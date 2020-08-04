package leotech.cdp.model.marketing;

import java.util.ArrayList;
import java.util.List;

/**
 * @author mac
 *
 */
public class FunnelNameStage {

	int orderIndex;
	String name;
	String kind;
	
	static List<FunnelNameStage> eventRetailFunnelStages = new ArrayList<FunnelNameStage>();
	static List<FunnelNameStage> customerRetailFunnelStages = new ArrayList<FunnelNameStage>();
	
	static {
		eventRetailFunnelStages.add(new FunnelNameStage(1, "Content View", "event_retail"));
		eventRetailFunnelStages.add(new FunnelNameStage(2, "Interaction", "event_retail"));
		eventRetailFunnelStages.add(new FunnelNameStage(3, "Purchase Intent", "event_retail"));
		eventRetailFunnelStages.add(new FunnelNameStage(4, "First Purchase", "event_retail"));
		eventRetailFunnelStages.add(new FunnelNameStage(5, "Repeat Purchase", "event_retail"));
		
		customerRetailFunnelStages.add(new FunnelNameStage(1, "Visitor", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelNameStage(2, "Identified Person", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelNameStage(3, "Customer Lead", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelNameStage(4, "First-time Customer", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelNameStage(5, "Repeat Customer", "customer_retail"));
	}
	
	
	public static List<FunnelNameStage> getEventRetailFunnelStages() {
		return eventRetailFunnelStages;
	}

	public static List<FunnelNameStage> getCustomerRetailFunnelStages() {
		return customerRetailFunnelStages;
	}

	public FunnelNameStage(int orderIndex, String name, String kind) {
		super();
		this.orderIndex = orderIndex;
		this.name = name;
		this.kind = kind;
	}
	
	public int getOrderIndex() {
		return orderIndex;
	}
	public void setOrderIndex(int orderIndex) {
		this.orderIndex = orderIndex;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getKind() {
		return kind;
	}
	public void setKind(String kind) {
		this.kind = kind;
	}
	
}
