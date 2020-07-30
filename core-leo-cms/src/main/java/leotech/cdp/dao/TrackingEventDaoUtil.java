package leotech.cdp.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.google.gson.Gson;

import leotech.cdp.dao.singleview.EventSingleDataView;
import leotech.cdp.model.customer.TrackingEvent;
import leotech.core.config.AqlTemplate;
import leotech.system.model.DataFilter;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbQuery.CallbackQuery;
import rfx.core.util.LogUtil;

public class TrackingEventDaoUtil  extends BaseLeoCdpDao{

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

	public static List<EventSingleDataView> getEventsByProfileId(String refProfileId, DataFilter filter) {
		ArangoDatabase db = getCdpDbInstance();
		
		Map<String, Object> bindVars = new HashMap<>(3);
		bindVars.put("refProfileId", refProfileId);
		bindVars.put("startIndex", filter.getStart());
		bindVars.put("numberResult", filter.getLength());
		
		CallbackQuery<EventSingleDataView> callback = new CallbackQuery<EventSingleDataView>() {
			@Override
			public EventSingleDataView apply(EventSingleDataView obj) {
				obj.unifyDataView();
				return obj;
			}
		};
		List<EventSingleDataView> list = new ArangoDbQuery<EventSingleDataView>(db, AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID,bindVars, 
				EventSingleDataView.class, callback).getResultsAsList();
		return list;
	}

}
