package leotech.cdp.dao;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import leotech.cdp.model.journey.BehavioralEventMetric;
import leotech.cdp.model.journey.EventMetric;

public class BehavioralEventMetricDao {

	// local cache for all event metric definition
	static final Map<String, BehavioralEventMetric> eventRetailMetrics = new HashMap<>(10);

	static {
		// TODO remove hard-code data later
		eventRetailMetrics.put("content_view", new BehavioralEventMetric("content_view","Content View", 1, EventMetric.FIRST_PARTY_DATA,
				"39RJ0oyaOgaUywqQCSvxJz", "4Q8KMy5sSwq0e2znNSirS2"));
		
		eventRetailMetrics.put("product_view", new BehavioralEventMetric("product_view","Product View", 2, EventMetric.FIRST_PARTY_DATA,
				"5h7YUqx85hZfUE6DTAMdkd", "6WATzqgDF1RvlrqA9N4k0d"));
		
		eventRetailMetrics.put("play_prvideo", new BehavioralEventMetric("play_prvideo","Play Promotional Video", 3, EventMetric.FIRST_PARTY_DATA,
				"5h7YUqx85hZfUE6DTAMdkd", "6WATzqgDF1RvlrqA9N4k0d"));
		
		eventRetailMetrics.put("social_login", new BehavioralEventMetric("social_login","Social Login", 10, EventMetric.FIRST_PARTY_DATA,
				"1vuNx3edtc7LFnpInCiEhl", "10xtpPtiy4cV0UDfx3HPU0"));
		
		eventRetailMetrics.put("submit_contact", new BehavioralEventMetric("submit_contact","Submit Contact", 15, EventMetric.FIRST_PARTY_DATA,
				"1vuNx3edtc7LFnpInCiEhl", "10xtpPtiy4cV0UDfx3HPU0"));
		
		eventRetailMetrics.put("add_to_cart", new BehavioralEventMetric("add_to_cart", "Purchase Intent", 30, EventMetric.FIRST_PARTY_DATA,
				"3G7FtkjPh4suPgCUJ4M9vJ", "4LvqenEeCIxWqv2J2ysHKx"));
		
		eventRetailMetrics.put("buy", new BehavioralEventMetric("buy", "First Purchase", 50, EventMetric.FIRST_PARTY_DATA,
				"4RcUaTNhZPs1ihxIFSPt7D", "2bzvrSqL4XQGamAHOh9ULw"));
		
		eventRetailMetrics.put("feedback_1st", new BehavioralEventMetric("feedback_1st","First-time Feedback", 70, EventMetric.FIRST_PARTY_DATA,
				"1aSmwF2IDIAWIx1xGa5chI", "2bzvrSqL4XQGamAHOh9ULw"));
		
		eventRetailMetrics.put("social_sharing", new BehavioralEventMetric("social_sharing","Social Sharing", 75, EventMetric.FIRST_PARTY_DATA,
				"1aSmwF2IDIAWIx1xGa5chI", "3mMU0KfIJvXowmEM0WAfUP"));
		
		eventRetailMetrics.put("rebuy", new BehavioralEventMetric("rebuy", "Repeat Purchase", 100, EventMetric.FIRST_PARTY_DATA,
				"6H7Lle2ifokQfmXCPlpTAx", "izqcqnxdqn4wsJx6SGjrO"));
		
		eventRetailMetrics.put("feedback_2nd", new BehavioralEventMetric("feedback_2nd","Second-time Feedback", 120, EventMetric.FIRST_PARTY_DATA,
				"1aSmwF2IDIAWIx1xGa5chI", "izqcqnxdqn4wsJx6SGjrO"));
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
		List<BehavioralEventMetric> list = new ArrayList<>(eventRetailMetrics.values());
		Collections.sort(list, compareByScore);
		return list;
	}

	public static Map<String, BehavioralEventMetric> getEventRetailMetricsMap() {
		return eventRetailMetrics;
	}

	public static BehavioralEventMetric getBehavioralEventMetricByName(String name) {
		return eventRetailMetrics.get(name);
	}
}
