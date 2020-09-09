package leotech.cdp.service;

import java.util.ArrayList;
import java.util.List;

import leotech.cdp.model.journey.FunnelStage;

public class FunnelDataService {

	static List<FunnelStage> eventRetailFunnelStages = new ArrayList<FunnelStage>();
	static List<FunnelStage> customerRetailFunnelStages = new ArrayList<FunnelStage>();

	static {
		
		//Behavioral Event Funnel
		eventRetailFunnelStages.add(new FunnelStage(1, "Content View", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(2, "Product View", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(3, "Customer Login", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(4, "Purchase Intent", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(5, "First Purchase", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(6, "Product Experience", "event_retail"));
		eventRetailFunnelStages.add(new FunnelStage(7, "Repeat Purchase", "event_retail"));
		
		//Marketing Funnel
		customerRetailFunnelStages.add(new FunnelStage(1, "Visitor", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(2, "Engaged Visitor", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(3, "Customer Lead", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(4, "Prospective Customer", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(5, "First-time Customer", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(7, "Customer Advocate", "customer_retail"));
		customerRetailFunnelStages.add(new FunnelStage(6, "Repeat Customer", "customer_retail"));
		
	}
	
	public static List<FunnelStage> getEventRetailFunnelStages() {
		return eventRetailFunnelStages;
	}

	public static List<FunnelStage> getCustomerRetailFunnelStages() {
		return customerRetailFunnelStages;
	}
}
