package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.devskiller.friendly_id.FriendlyId;

import leotech.cdp.model.audience.ConversionEvent;
import leotech.cdp.model.audience.Profile;
import leotech.cdp.model.audience.TrackingEvent;
import leotech.cms.model.Page;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class ConversionEventDaoUtil  extends BaseLeoCdpDao {

	static final String AQL_GET_CONVERSION_EVENTS_BY_PROFILE_ID = AqlTemplate
			.get("AQL_GET_CONVERSION_EVENTS_BY_PROFILE_ID");

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

	public static List<ConversionEvent> getEventsByProfileId(String refProfileId) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("refProfileId", refProfileId);
		List<ConversionEvent> list = new ArangoDbQuery<ConversionEvent>(db, AQL_GET_CONVERSION_EVENTS_BY_PROFILE_ID,
				bindVars, ConversionEvent.class).getResultsAsList();
		return list;
	}

}
