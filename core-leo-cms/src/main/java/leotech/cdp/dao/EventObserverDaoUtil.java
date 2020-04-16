package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.EventObserver;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class EventObserverDaoUtil {

    static final String AQL_GET_OBSERVER_BY_ID = AqlTemplate.get("AQL_GET_OBSERVER_BY_ID");
    static final String AQL_GET_OBSERVERS = AqlTemplate.get("AQL_GET_OBSERVERS");

    private static final String AQL_FIND_KEY_AQL = ArangoDbUtil.contentFindKeyAql(EventObserver.COLLECTION_NAME);

    public static String save(EventObserver e) {
	if (e.isReadyForSave()) {
	    ArangoCollection col = e.getCollection();
	    if (col != null) {
		String id = e.getId();
		String _key = ArangoDbUtil.findKey(AQL_FIND_KEY_AQL, "id", id);
		if (_key == null) {
		    col.insertDocument(e);
		} else {
		    e.setUpdatedAt(new Date());
		    col.updateDocument(_key, e);
		}
		return id;
	    }
	}
	return "";
    }

    public static EventObserver getById(String id) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(1);
	bindVars.put("id", id);
	EventObserver p = new ArangoDbQuery<EventObserver>(db, AQL_GET_OBSERVER_BY_ID, bindVars, EventObserver.class).getResultsAsObject();
	return p;
    }

    public static List<EventObserver> list(int startIndex, int numberResult) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(2);
	bindVars.put("startIndex", startIndex);
	bindVars.put("numberResult", numberResult);
	List<EventObserver> list = new ArangoDbQuery<EventObserver>(db, AQL_GET_OBSERVERS, bindVars, EventObserver.class).getResultsAsList();
	return list;
    }

}
