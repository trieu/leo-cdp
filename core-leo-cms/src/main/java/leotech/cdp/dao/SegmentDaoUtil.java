package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.devskiller.friendly_id.FriendlyId;

import leotech.cdp.model.audience.Profile;
import leotech.cdp.model.audience.TrackingEvent;
import leotech.cms.model.Page;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class SegmentDaoUtil {

   
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
	ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
	Map<String, Object> bindVars = new HashMap<>(1);
	bindVars.put("refProfileId", refProfileId);
	List<TrackingEvent> list = new ArangoDbQuery<TrackingEvent>(db, AQL_GET_TRACKING_EVENTS_BY_PROFILE_ID, bindVars, TrackingEvent.class).getResultsAsList();
	return list;
    }

}
