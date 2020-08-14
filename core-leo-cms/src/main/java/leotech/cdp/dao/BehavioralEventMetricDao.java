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
		eventRetailMetrics.put("pageview", new BehavioralEventMetric("pageview", 1, EventMetric.FIRST_PARTY_DATA,
				"39RJ0oyaOgaUywqQCSvxJz", "4Q8KMy5sSwq0e2znNSirS2"));
		eventRetailMetrics.put("itemclick", new BehavioralEventMetric("itemclick", 2, EventMetric.FIRST_PARTY_DATA,
				"73RsJme3NQ3FvYuYxpAJXh", "4Q8KMy5sSwq0e2znNSirS2"));
		eventRetailMetrics.put("login", new BehavioralEventMetric("login", 3, EventMetric.FIRST_PARTY_DATA,
				"73RsJme3NQ3FvYuYxpAJXh", "6KNyimHlHZceZlrnh0rSsh"));
		eventRetailMetrics.put("add2cart", new BehavioralEventMetric("add2cart", 10, EventMetric.FIRST_PARTY_DATA,
				"4IQmTmiJYHXrsKWcciO80o", "10xtpPtiy4cV0UDfx3HPU0"));
		eventRetailMetrics.put("buy", new BehavioralEventMetric("buy", 20, EventMetric.FIRST_PARTY_DATA,
				"7T7fNeIJySe1GpTnjVq6Cu", "5802G0gQXv4hquzbhQdxiK"));
		eventRetailMetrics.put("rebuy", new BehavioralEventMetric("rebuy", 30, EventMetric.FIRST_PARTY_DATA,
				"J0tY7jLSQsaeq1q5oy92T", "1FkRlAwAYratu3vG93HxRf"));
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
