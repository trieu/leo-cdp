package leotech.cdp.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.customer.ConversionEvent;
import leotech.core.config.AqlTemplate;
import leotech.system.model.DataFilter;
import leotech.system.util.database.ArangoDbQuery;

public class ConversionEventDaoUtil  extends BaseLeoCdpDao {

	static final String AQL_GET_CONVERSION_EVENTS_BY_PROFILE_ID = AqlTemplate.get("AQL_GET_CONVERSION_EVENTS_BY_PROFILE_ID");

	public static boolean record(ConversionEvent e) {
		if (e.isReadyForSave()) {
			ArangoCollection col = e.getCollection();
			if (col != null) {
				col.insertDocument(e);
				return true;
			}
		}
		return false;
	}

	public static List<ConversionEvent> getEventsByProfileId(String refProfileId, DataFilter filter) {
		ArangoDatabase db = getCdpDbInstance();
		
		Map<String, Object> bindVars = new HashMap<>(3);
		bindVars.put("refProfileId", refProfileId);
		bindVars.put("startIndex", filter.getStart());
		bindVars.put("numberResult", filter.getLength());
		
		List<ConversionEvent> list = new ArangoDbQuery<ConversionEvent>(db, AQL_GET_CONVERSION_EVENTS_BY_PROFILE_ID,
				bindVars, ConversionEvent.class).getResultsAsList();
		return list;
	}

}
