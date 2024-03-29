package leotech.cdp.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.google.gson.Gson;

import leotech.cdp.dao.singleview.EventSingleDataView;
import leotech.cdp.model.analytics.TrackingEvent;
import leotech.system.config.AqlTemplate;
import leotech.system.model.DataFilter;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbQuery.CallbackQuery;
import rfx.core.util.LogUtil;

public class TrackingEventDao extends AbstractCdpDatabaseUtil {

	private static final String CLASS_NAME = TrackingEventDao.class.getSimpleName();
	
	static final String AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID = AqlTemplate.get("AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID");
	static final String AQL_GET_UNPROCESSED_EVENTS_BY_PROFILE_ID = AqlTemplate.get("AQL_GET_UNPROCESSED_EVENTS_BY_PROFILE_ID");
	
	static final String AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID_AND_METRIC_NAME = AqlTemplate.get("AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID_AND_METRIC_NAME");
	
	static final String AQL_GET_TRACKING_EVENTS_FOR_REPORTING_BY_PROFILE_ID = AqlTemplate.get("AQL_GET_TRACKING_EVENTS_FOR_REPORTING_BY_PROFILE_ID");
	static final String AQL_UPDATE_TRACKING_EVENT_STATE_PROCESSED = AqlTemplate.get("AQL_UPDATE_TRACKING_EVENT_STATE_PROCESSED");
	static final String AQL_GET_CONVERSION_EVENTS_BY_PROFILE_ID = AqlTemplate.get("AQL_GET_CONVERSION_EVENTS_BY_PROFILE_ID");
	
	
	/**
	 * record any event of profile
	 * 
	 * @param e
	 * @return
	 */
	public static boolean record(TrackingEvent e) {
		if (e.isReadyForSave()) {
			ArangoCollection col = e.getDbCollection();
			if (col != null) {
				col.insertDocument(e);
				System.out.println("record OK " + e.getMetricName() + " " + e.getId());
				return true;
			}
		} else {
			String json = new Gson().toJson(e);
			System.err.println("invalid TrackingEvent \n" + json);

		}
		return false;
	}
	
	
	public static List<EventSingleDataView> getEventsByProfileIdAndPagination(String refProfileId, int startIndex, int numberResult) {
		ArangoDatabase db = getCdpDbInstance();
		
		Map<String, Object> bindVars = new HashMap<>(3);
		bindVars.put("refProfileId", refProfileId);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		
		CallbackQuery<EventSingleDataView> callback = new CallbackQuery<EventSingleDataView>() {
			@Override
			public EventSingleDataView apply(EventSingleDataView obj) {
				obj.unifyData();
				return obj;
			}
		};
		List<EventSingleDataView> list = new ArangoDbQuery<EventSingleDataView>(db, AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID,bindVars, 
				EventSingleDataView.class, callback).getResultsAsList();
		return list;
	}
	
	public static List<EventSingleDataView> getConversionEventsByProfileId(String refProfileId, DataFilter filter) {
		ArangoDatabase db = getCdpDbInstance();
		
		Map<String, Object> bindVars = new HashMap<>(3);
		bindVars.put("refProfileId", refProfileId);
		bindVars.put("startIndex", filter.getStart());
		bindVars.put("numberResult", filter.getLength());
		
		CallbackQuery<EventSingleDataView> callback = new CallbackQuery<EventSingleDataView>() {
			@Override
			public EventSingleDataView apply(EventSingleDataView obj) {
				obj.unifyData();
				return obj;
			}
		};
		List<EventSingleDataView> list = new ArangoDbQuery<EventSingleDataView>(db, AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID,bindVars, 
				EventSingleDataView.class, callback).getResultsAsList();
		return list;
	}
	
	public static List<EventSingleDataView> getTrackedEventsByProfileIdAndMetricName(String refProfileId, String metricName, DataFilter filter) {
		ArangoDatabase db = getCdpDbInstance();
		
		Map<String, Object> bindVars = new HashMap<>(3);
		bindVars.put("refProfileId", refProfileId);
		bindVars.put("metricName", metricName);
		bindVars.put("startIndex", filter.getStart());
		bindVars.put("numberResult", filter.getLength());
		
		CallbackQuery<EventSingleDataView> callback = new CallbackQuery<EventSingleDataView>() {
			@Override
			public EventSingleDataView apply(EventSingleDataView obj) {
				obj.unifyData();
				return obj;
			}
		};
		List<EventSingleDataView> list = new ArangoDbQuery<EventSingleDataView>(db, AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID_AND_METRIC_NAME,bindVars, 
				EventSingleDataView.class, callback).getResultsAsList();
		return list;
	}
	
	
	// for log processing methods
	
	public static boolean updateProcessedState(TrackingEvent e) {
		if (e.isReadyForSave()) {
			ArangoDatabase db = getCdpDbInstance();
			Map<String, Object> bindVars = new HashMap<>(1);
			bindVars.put("id", e.getId());
			new ArangoDbQuery<TrackingEvent>(db, AQL_UPDATE_TRACKING_EVENT_STATE_PROCESSED, bindVars).update();
		} else {
			String json = new Gson().toJson(e);
			LogUtil.e(CLASS_NAME, "invalid TrackingEvent \n" + json);

		}
		return false;
	}

	public static List<EventSingleDataView> getEventsByProfileId(String refProfileId, DataFilter filter) {
		int startIndex = filter.getStart();
		int numberResult = filter.getLength();
		return getEventsByProfileIdAndPagination(refProfileId, startIndex, numberResult);
	}
	
	public static List<EventSingleDataView> getUnprocessedEventsByProfileId(String refProfileId, DataFilter filter) {
		int startIndex = filter.getStart();
		int numberResult = filter.getLength();
		ArangoDatabase db = getCdpDbInstance();
		
		Map<String, Object> bindVars = new HashMap<>(3);
		bindVars.put("refProfileId", refProfileId);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		
		CallbackQuery<EventSingleDataView> callback = new CallbackQuery<EventSingleDataView>() {
			@Override
			public EventSingleDataView apply(EventSingleDataView obj) {
				obj.unifyData();
				return obj;
			}
		};
		Class<EventSingleDataView> clazz = EventSingleDataView.class;
		List<EventSingleDataView> list = new ArangoDbQuery<EventSingleDataView>(db, AQL_GET_UNPROCESSED_EVENTS_BY_PROFILE_ID, bindVars, clazz, callback).getResultsAsList();
		return list;
	}
	
	public static EventSingleDataView getLastTrackingEventsByProfileId(String refProfileId) {
		List<EventSingleDataView> events = getEventsByProfileIdAndPagination(refProfileId, 0, 1);
		if(events.size() > 0) {
			return events.get(0);
		}
		return null;
	}

}
