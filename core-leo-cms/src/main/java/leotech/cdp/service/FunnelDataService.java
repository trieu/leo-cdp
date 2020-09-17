package leotech.cdp.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import leotech.cdp.model.journey.BehavioralEventMetric;
import leotech.cdp.model.journey.DataFlowStage;
import leotech.cdp.model.journey.EventMetaData;

/**
 * Metadata for event flow and customer flow
 * 
 * @author tantrieuf31
 * @since 2020
 *
 */
public class FunnelDataService {
	private static final int MAX_CACHE_SIZE = 200;
	
	//TODO move to database in Enterprise version
	private static final String FLOW_CUSTOMER_RETAIL = "customer_retail";
	private static final String FLOW_RETAIL_INDUSTRY = "event_retail";

	public static final DataFlowStage CUSTOMER_PROFILE_FUNNEL_STAGE = new DataFlowStage(0, "Customer Profile", "", "default_data_flow");
	
	public static final BehavioralEventMetric UNCLASSIFIED_EVENT = new BehavioralEventMetric("unclassified-event","Unclassified Event", 0, EventMetaData.FIRST_PARTY_DATA,
			"unclassified-event", CUSTOMER_PROFILE_FUNNEL_STAGE.getId());
	
	static final List<DataFlowStage> eventFlowStages = new ArrayList<DataFlowStage>();
	static final List<DataFlowStage> customerFunnelStages = new ArrayList<DataFlowStage>();
	
	static final Map<String, DataFlowStage> dataFlowCache = new ConcurrentHashMap<String, DataFlowStage>(MAX_CACHE_SIZE);
	
	// local cache for all event metric definition
	static final Map<String, BehavioralEventMetric> eventMetaDataCache = new ConcurrentHashMap<String, BehavioralEventMetric>(MAX_CACHE_SIZE);

	static {
		initFunnelDataCache();
		initEventMetaDataCache();
	}

	public static void initFunnelDataCache() {
		//Behavioral Event Funnel
		eventFlowStages.add(new DataFlowStage(0, "Content View", FLOW_RETAIL_INDUSTRY, "retail_event_flow"));
		eventFlowStages.add(new DataFlowStage(1, "Product View", FLOW_RETAIL_INDUSTRY, "retail_event_flow"));
		eventFlowStages.add(new DataFlowStage(2, "Customer Login", FLOW_RETAIL_INDUSTRY, "retail_event_flow"));
		eventFlowStages.add(new DataFlowStage(3, "Purchase Intent", FLOW_RETAIL_INDUSTRY, "retail_event_flow"));
		eventFlowStages.add(new DataFlowStage(4, "First Purchase", FLOW_RETAIL_INDUSTRY, "retail_event_flow"));
		eventFlowStages.add(new DataFlowStage(5, "Product Experience", FLOW_RETAIL_INDUSTRY, "retail_event_flow"));
		eventFlowStages.add(new DataFlowStage(6, "Customer Feedback", FLOW_RETAIL_INDUSTRY, "retail_event_flow"));
		eventFlowStages.add(new DataFlowStage(7, "Repeat Purchase", FLOW_RETAIL_INDUSTRY, "retail_event_flow"));
		
		// put to cache
		for (DataFlowStage funnelStage : eventFlowStages) {
			dataFlowCache.put(funnelStage.getId(), funnelStage);
		}
		
		//Customer Data Funnel
		//customerFunnelStages.add(CUSTOMER_PROFILE_FUNNEL_STAGE);
		customerFunnelStages.add(new DataFlowStage(1, "New Visitor", FLOW_CUSTOMER_RETAIL, "retail_customer_flow"));
		customerFunnelStages.add(new DataFlowStage(2, "Engaged Visitor", FLOW_CUSTOMER_RETAIL, "retail_customer_flow"));
		customerFunnelStages.add(new DataFlowStage(3, "Customer Lead", FLOW_CUSTOMER_RETAIL, "retail_customer_flow"));
		customerFunnelStages.add(new DataFlowStage(4, "Prospective Customer", FLOW_CUSTOMER_RETAIL, "retail_customer_flow"));
		customerFunnelStages.add(new DataFlowStage(5, "First-time Customer", FLOW_CUSTOMER_RETAIL, "retail_customer_flow"));
		customerFunnelStages.add(new DataFlowStage(6, "Customer Advocate", FLOW_CUSTOMER_RETAIL, "retail_customer_flow"));
		customerFunnelStages.add(new DataFlowStage(7, "Repeat Customer", FLOW_CUSTOMER_RETAIL, "retail_customer_flow"));
		
		for (DataFlowStage funnelStage : customerFunnelStages) {
			dataFlowCache.put(funnelStage.getId(), funnelStage);
		}
	}

	public static void initEventMetaDataCache() {
		// TODO remove hard-code data later
		eventMetaDataCache.put("content-view", new BehavioralEventMetric("content-view","Content View", 1, EventMetaData.FIRST_PARTY_DATA,
				"content-view", "new-visitor"));
		
		eventMetaDataCache.put("product-view", new BehavioralEventMetric("product-view","Product View", 2, EventMetaData.FIRST_PARTY_DATA,
				"product-view", "engaged-visitor"));
		
		eventMetaDataCache.put("play-prvideo", new BehavioralEventMetric("play-prvideo","Play PR Video", 3, EventMetaData.FIRST_PARTY_DATA,
				"product-view", "engaged-visitor"));
		
		eventMetaDataCache.put("social-login", new BehavioralEventMetric("social-login","Social Login", 4, EventMetaData.FIRST_PARTY_DATA,
				"customer-login", "engaged-visitor"));
		
		eventMetaDataCache.put("submit-contact", new BehavioralEventMetric("submit-contact","Submit Contact", 20, EventMetaData.FIRST_PARTY_DATA,
				"purchase-intent", "customer-lead"));
		
		eventMetaDataCache.put("short-link-click", new BehavioralEventMetric("short-link-click","Short Link Click", 21, EventMetaData.FIRST_PARTY_DATA,
				"purchase-intent", "prospective-customer"));
		
		eventMetaDataCache.put("web-notification-click", new BehavioralEventMetric("web-notification-click","Web Notification Click", 23, EventMetaData.FIRST_PARTY_DATA,
				"purchase-intent", "prospective-customer"));
		
		eventMetaDataCache.put("app-notification-click", new BehavioralEventMetric("app-notification-click","App Notification Click", 24, EventMetaData.FIRST_PARTY_DATA,
				"purchase-intent", "prospective-customer"));
		
		eventMetaDataCache.put("email-click", new BehavioralEventMetric("email-click","Email Link Click", 25, EventMetaData.FIRST_PARTY_DATA,
				"purchase-intent", "prospective-customer"));
		
		eventMetaDataCache.put("like-product", new BehavioralEventMetric("like-product","Like a product", 30, EventMetaData.FIRST_PARTY_DATA,
				"purchase-intent", "prospective-customer"));
		
		eventMetaDataCache.put("add-to-cart", new BehavioralEventMetric("add-to-cart", "Purchase Intent", 40, EventMetaData.FIRST_PARTY_DATA,
				"purchase-intent", "prospective-customer"));
		
		eventMetaDataCache.put("buy", new BehavioralEventMetric("buy", "First Purchase", 50, EventMetaData.FIRST_PARTY_DATA,
				"first-purchase", "first-time-customer"));
		
		eventMetaDataCache.put("feedback-1st", new BehavioralEventMetric("feedback-1st","First-time Feedback", 70, EventMetaData.FIRST_PARTY_DATA,
				"customer-feedback", "first-time-customer"));
		
		eventMetaDataCache.put("social-sharing", new BehavioralEventMetric("social-sharing","Social Sharing", 75, EventMetaData.FIRST_PARTY_DATA,
				"customer-feedback", "customer-advocate"));
		
		eventMetaDataCache.put("rebuy", new BehavioralEventMetric("rebuy", "Repeat Purchase", 100, EventMetaData.FIRST_PARTY_DATA,
				"repeat-purchase", "repeat-customer"));
		
		eventMetaDataCache.put("feedback-2nd", new BehavioralEventMetric("feedback-2nd","Second-time Feedback", 120, EventMetaData.FIRST_PARTY_DATA,
				"customer-feedback", "repeat-customer"));
	}
	
	public static List<DataFlowStage> getEventFunnelStages() {
		return eventFlowStages;
	}

	public static List<DataFlowStage> getCustomerFunnelStages() {
		return customerFunnelStages;
	}
	
	public static DataFlowStage getFunnelStageById(String id) {
		return dataFlowCache.getOrDefault(id, CUSTOMER_PROFILE_FUNNEL_STAGE);
	}
	
	public static BehavioralEventMetric getBehavioralEventMetric(String id) {
		if(id != null) {
			return eventMetaDataCache.getOrDefault(id, UNCLASSIFIED_EVENT);
		}
		return UNCLASSIFIED_EVENT;
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
		List<BehavioralEventMetric> list = new ArrayList<>(eventMetaDataCache.values());
		Collections.sort(list, compareByScore);
		return list;
	}

	public static BehavioralEventMetric getBehavioralEventMetricByName(String name) {
		return eventMetaDataCache.get(name);
	}
}
