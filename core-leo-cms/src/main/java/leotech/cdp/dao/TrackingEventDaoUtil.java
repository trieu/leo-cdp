package leotech.cdp.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.google.gson.Gson;

import leotech.cdp.model.audience.TrackingEvent;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.LogUtil;

public class TrackingEventDaoUtil {

	private static final String CLASS_NAME = TrackingEventDaoUtil.class.getSimpleName();
	static final String AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID = AqlTemplate
			.get("AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID");
	static final String AQL_GET_TRACKING_EVENTS_FOR_REPORTING_BY_PROFILE_ID = AqlTemplate
			.get("AQL_GET_TRACKING_EVENTS_FOR_REPORTING_BY_PROFILE_ID");

	public static boolean record(TrackingEvent e) {
		if (e.isReadyForSave()) {
			ArangoCollection col = e.getCollection();
			if (col != null) {
				col.insertDocument(e);
				return true;
			}
		} else {
			String json = new Gson().toJson(e);
			LogUtil.e(CLASS_NAME, "invalid TrackingEvent \n" + json);

		}
		return false;
	}

	public static List<TrackingEvent> getEventsByProfileId(String refProfileId) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("refProfileId", refProfileId);
		List<TrackingEvent> list = new ArangoDbQuery<TrackingEvent>(db, AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID,
				bindVars, TrackingEvent.class).getResultsAsList();
		return list;
	}

}
