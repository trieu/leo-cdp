package leotech.cdp.model.marketing;

import java.util.ArrayList;
import java.util.List;

import rfx.core.util.HashUtil;

/**
 * @author mac
 *
 */
public class FunnelStage {

	String id;
	int orderIndex;
	String name;
	String type;
	
	static List<FunnelStage> eventRetailFunnelStages = new ArrayList<FunnelStage>();
	static List<FunnelStage> customerRetailFunnelStages = new ArrayList<FunnelStage>();
	
	static {
		eventRetailFunnelStages.add(new FunnelStage(1, "Content View", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(2, "Interaction", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(3, "Purchase Intent", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(4, "First Purchase", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(5, "Repeat Purchase", "event_retail"));
		
		customerRetailFunnelStages.add(new FunnelStage(1, "Visitor", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(2, "Identified Person", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(3, "Customer Lead", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(4, "First-time Customer", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(5, "Repeat Customer", "customer_retail"));
	}
	
	
	public static List<FunnelStage> getEventRetailFunnelStages() {
		return eventRetailFunnelStages;
	}

	public static List<FunnelStage> getCustomerRetailFunnelStages() {
		return customerRetailFunnelStages;
	}
	
	public FunnelStage() {
		// TODO Auto-generated constructor stub
	}

	public FunnelStage(int orderIndex, String name, String type) {
		super();
		this.orderIndex = orderIndex;
		this.name = name;
		this.type = type;
		this.id = HashUtil.md5(orderIndex + name + type);
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	
}
