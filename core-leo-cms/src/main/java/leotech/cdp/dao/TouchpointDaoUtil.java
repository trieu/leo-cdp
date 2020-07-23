package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.marketing.Touchpoint;
import leotech.core.config.AqlTemplate;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataTablePayload;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class TouchpointDaoUtil extends BaseLeoCdpDao {

	static final String AQL_GET_TOUCHPOINT_BY_ID = AqlTemplate.get("AQL_GET_TOUCHPOINT_BY_ID");
	static final String AQL_GET_TOUCHPOINT_BY_URL = AqlTemplate.get("AQL_GET_TOUCHPOINT_BY_URL");
	static final String AQL_GET_TOUCHPOINT_BY_NAME = AqlTemplate.get("AQL_GET_TOUCHPOINT_BY_NAME");
	static final String AQL_GET_TOUCHPOINTS_BY_FILTER  = AqlTemplate.get("AQL_GET_TOUCHPOINTS_BY_FILTER");
	
	static final String AQL_GET_TOUCHPOINTS = AqlTemplate.get("AQL_GET_TOUCHPOINTS");
	static final String AQL_GET_TOP_1000_TOUCHPOINTS_BY_PROFILE  = AqlTemplate.get("AQL_GET_TOP_1000_TOUCHPOINTS_BY_PROFILE");
	static final String AQL_GET_TOUCHPOINT_FLOW_BY_PROFILE  = AqlTemplate.get("AQL_GET_TOUCHPOINT_FLOW_BY_PROFILE");
	

	public static String save(Touchpoint tp) {
		if (tp.isReadyForSave()) {
			ArangoDatabase db = getCdpDbInstance();
			ArangoCollection col = tp.getCollection();
			if (col != null) {
				String id = tp.getId();
				boolean isExisted = ArangoDbUtil.isExistedDocument(db,Touchpoint.COLLECTION_NAME, id);
				if (isExisted) {
					tp.setUpdatedAt(new Date());
					col.updateDocument(id, tp);
				} else {
					col.insertDocument(tp);
				}
				return id;
			}
		}
		return "";
	}

	public static Touchpoint getById(String id) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("id", id);
		Touchpoint p = new ArangoDbQuery<Touchpoint>(db, AQL_GET_TOUCHPOINT_BY_ID, bindVars, Touchpoint.class)
				.getResultsAsObject();
		return p;
	}

	public static Touchpoint getByUrl(String url) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("url", url);
		Touchpoint p = new ArangoDbQuery<Touchpoint>(db, AQL_GET_TOUCHPOINT_BY_URL, bindVars, Touchpoint.class)
				.getResultsAsObject();
		return p;
	}
	
	public static Touchpoint getByName(String name) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("name", name);
		Touchpoint p = new ArangoDbQuery<Touchpoint>(db, AQL_GET_TOUCHPOINT_BY_NAME, bindVars, Touchpoint.class).getResultsAsObject();
		return p;
	}

	public static List<Touchpoint> list(int startIndex, int numberResult) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		List<Touchpoint> list = new ArangoDbQuery<Touchpoint>(db, AQL_GET_TOUCHPOINTS, bindVars, Touchpoint.class).getResultsAsList();
		return list;
	}
	
	public static List<Touchpoint> getTop1000ByProfile(String profileId) {
		ArangoDatabase db = getCdpDbInstance();
		
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("profileId", profileId);
		
		List<Touchpoint> list = new ArangoDbQuery<Touchpoint>(db, AQL_GET_TOP_1000_TOUCHPOINTS_BY_PROFILE, bindVars, Touchpoint.class).getResultsAsList();
		return list;
	}
	
	public static JsonDataTablePayload filter(DataFilter filter) {
		ArangoDatabase db = getCdpDbInstance();
		
		//System.out.println("==> before apply DataFilter " + filter);
		
		//TODO dynamic query builder for filtering data
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("startIndex", filter.getStart());
		bindVars.put("numberResult", filter.getLength());
		
		List<Touchpoint> list = new ArangoDbQuery<Touchpoint>(db, AQL_GET_TOUCHPOINTS_BY_FILTER, bindVars, Touchpoint.class).getResultsAsList();
		
		long recordsTotal = countTotalOfTouchpoints();
		int recordsFiltered = list.size();
		int draw = filter.getDraw();
		JsonDataTablePayload payload =  JsonDataTablePayload.data(filter.getUri(), list, recordsTotal, recordsFiltered, draw);
		return payload;
	}
	
	public static long countTotalOfTouchpoints() {
		ArangoDatabase db = getCdpDbInstance();
		long c = db.collection(Touchpoint.COLLECTION_NAME).count().getCount();
		return c;
	}

}
