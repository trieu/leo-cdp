package leotech.cdp.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.analytics.TrackingEvent;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;

public class SegmentDaoUtil extends BaseLeoCdpDao {

	static final String AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID = AqlTemplate.get("AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID");

	public static boolean record(TrackingEvent e) {
		if (e.isReadyForSave()) {
			ArangoCollection col = e.getCollection();
			if (col != null) {
				col.insertDocument(e);
				return true;
			}
		}
		return false;
	}

	public static List<TrackingEvent> getEventsByProfileId(String refProfileId) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("refProfileId", refProfileId);
		List<TrackingEvent> list = new ArangoDbQuery<TrackingEvent>(db, AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID,
				bindVars, TrackingEvent.class).getResultsAsList();
		return list;
	}

}
