package leotech.cdp.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import leotech.cdp.model.journey.BehavioralEventMetric;
import leotech.cdp.model.journey.EventMetaData;
import leotech.cdp.model.journey.FunnelStage;

public class FunnelDataService {

	
	public static final FunnelStage CUSTOMER_PROFILE_FUNNEL_STAGE = new FunnelStage(0, "Customer Profile", "");
	
	public static final BehavioralEventMetric UNCLASSIFIED_EVENT = new BehavioralEventMetric("unclassified-event","Unclassified Event", 0, EventMetaData.FIRST_PARTY_DATA,
			"unclassified-event", CUSTOMER_PROFILE_FUNNEL_STAGE.getId());
	
	static List<FunnelStage> eventFunnelStages = new ArrayList<FunnelStage>();
	static List<FunnelStage> customerFunnelStages = new ArrayList<FunnelStage>();
	
	static HashMap<String, FunnelStage> funnelDataCache = new HashMap<String, FunnelStage>();
	
	// local cache for all event metric definition
	static final Map<String, BehavioralEventMetric> eventMetaDataList = new HashMap<>(10);

	static {
		
		//Behavioral Event Funnel
		eventFunnelStages.add(new FunnelStage(0, "Content View", "event_retail"));
		eventFunnelStages.add(new FunnelStage(1, "Product View", "event_retail"));
		eventFunnelStages.add(new FunnelStage(2, "Customer Login", "event_retail"));
		eventFunnelStages.add(new FunnelStage(3, "Purchase Intent", "event_retail"));
		eventFunnelStages.add(new FunnelStage(4, "First Purchase", "event_retail"));
		eventFunnelStages.add(new FunnelStage(5, "Product Experience", "event_retail"));
		eventFunnelStages.add(new FunnelStage(6, "Customer Feedback", "event_retail"));
		eventFunnelStages.add(new FunnelStage(7, "Repeat Purchase", "event_retail"));
		
		for (FunnelStage funnelStage : eventFunnelStages) {
			funnelDataCache.put(funnelStage.getId(), funnelStage);
		}
		
		//Customer Data Funnel
		customerFunnelStages.add(CUSTOMER_PROFILE_FUNNEL_STAGE);
		customerFunnelStages.add(new FunnelStage(1, "New Visitor", "customer_retail"));
		customerFunnelStages.add(new FunnelStage(2, "Engaged Visitor", "customer_retail"));
		customerFunnelStages.add(new FunnelStage(3, "Customer Lead", "customer_retail"));
		customerFunnelStages.add(new FunnelStage(4, "Prospective Customer", "customer_retail"));
		customerFunnelStages.add(new FunnelStage(5, "First-time Customer", "customer_retail"));
		customerFunnelStages.add(new FunnelStage(6, "Customer Advocate", "customer_retail"));
		customerFunnelStages.add(new FunnelStage(7, "Repeat Customer", "customer_retail"));
		
		for (FunnelStage funnelStage : customerFunnelStages) {
			funnelDataCache.put(funnelStage.getId(), funnelStage);
		}
		
		// TODO remove hard-code data later
		eventMetaDataList.put("content-view", new BehavioralEventMetric("content-view","Content View", 1, EventMetaData.FIRST_PARTY_DATA,
				"content-view", "new-visitor"));
		
		eventMetaDataList.put("product-view", new BehavioralEventMetric("product-view","Product View", 2, EventMetaData.FIRST_PARTY_DATA,
				"product-view", "engaged-visitor"));
		
		eventMetaDataList.put("play-prvideo", new BehavioralEventMetric("play-prvideo","Play PR Video", 3, EventMetaData.FIRST_PARTY_DATA,
				"product-view", "engaged-visitor"));
		
		eventMetaDataList.put("social-login", new BehavioralEventMetric("social-login","Social Login", 4, EventMetaData.FIRST_PARTY_DATA,
				"customer-login", "engaged-visitor"));
		
		eventMetaDataList.put("submit-contact", new BehavioralEventMetric("submit-contact","Submit Contact", 20, EventMetaData.FIRST_PARTY_DATA,
				"purchase-intent", "customer-lead"));
		
		eventMetaDataList.put("add-to-cart", new BehavioralEventMetric("add-to-cart", "Purchase Intent", 30, EventMetaData.FIRST_PARTY_DATA,
				"purchase-intent", "prospective-customer"));
		
		eventMetaDataList.put("buy", new BehavioralEventMetric("buy", "First Purchase", 50, EventMetaData.FIRST_PARTY_DATA,
				"first-purchase", "first-time-customer"));
		
		eventMetaDataList.put("feedback-1st", new BehavioralEventMetric("feedback-1st","First-time Feedback", 70, EventMetaData.FIRST_PARTY_DATA,
				"customer-feedback", "first-time-customer"));
		
		eventMetaDataList.put("social-sharing", new BehavioralEventMetric("social-sharing","Social Sharing", 75, EventMetaData.FIRST_PARTY_DATA,
				"customer-feedback", "customer-advocate"));
		
		eventMetaDataList.put("rebuy", new BehavioralEventMetric("rebuy", "Repeat Purchase", 100, EventMetaData.FIRST_PARTY_DATA,
				"repeat-purchase", "repeat-customer"));
		
		eventMetaDataList.put("feedback-2nd", new BehavioralEventMetric("feedback-2nd","Second-time Feedback", 120, EventMetaData.FIRST_PARTY_DATA,
				"customer-feedback", "repeat-customer"));
	}
	
	public static List<FunnelStage> getEventFunnelStages() {
		return eventFunnelStages;
	}

	public static List<FunnelStage> getCustomerFunnelStages() {
		return customerFunnelStages;
	}
	
	public static FunnelStage getFunnelStageById(String id) {
		return funnelDataCache.getOrDefault(id, CUSTOMER_PROFILE_FUNNEL_STAGE);
	}
	
	public static BehavioralEventMetric getBehavioralEventMetric(String id) {
		return eventMetaDataList.getOrDefault(id, UNCLASSIFIED_EVENT);
	}

	public static Collection<BehavioralEventMetric> getEventRetailMetrics() {

		Comparator<BehavioralEventMetric> compareByScore = new Comparator<BehavioralEventMetric>() {
			@Override
			public int compare(BehavioralEventMetric o1, BehavioralEventMetric o2) {
				if (o1.getScore() > o2.getScore()) {
					return 1;
				} else if (o1.getScore() < o2.getScore()) {
					return -1;
				}
				return 0;
			}
		};
		List<BehavioralEventMetric> list = new ArrayList<>(eventMetaDataList.values());
		Collections.sort(list, compareByScore);
		return list;
	}

	public static Map<String, BehavioralEventMetric> getEventRetailMetricsMap() {
		return eventMetaDataList;
	}

	public static BehavioralEventMetric getBehavioralEventMetricByName(String name) {
		return eventMetaDataList.get(name);
	}
}
