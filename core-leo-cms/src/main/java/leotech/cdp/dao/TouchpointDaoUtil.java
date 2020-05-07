package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.Touchpoint;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class TouchpointDaoUtil {

	static final String AQL_GET_TOUCHPOINT_BY_ID = AqlTemplate.get("AQL_GET_TOUCHPOINT_BY_ID");
	static final String AQL_GET_TOUCHPOINT_BY_URL = AqlTemplate.get("AQL_GET_TOUCHPOINT_BY_URL");
	static final String AQL_GET_TOUCHPOINTS = AqlTemplate.get("AQL_GET_TOUCHPOINTS");

	

	public static String save(Touchpoint tp) {
		if (tp.isReadyForSave()) {
			ArangoCollection col = tp.getCollection();
			if (col != null) {
				String id = tp.getId();
				boolean isExisted = ArangoDbUtil.isExistedDocument(Touchpoint.COLLECTION_NAME, id);
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
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("id", id);
		Touchpoint p = new ArangoDbQuery<Touchpoint>(db, AQL_GET_TOUCHPOINT_BY_ID, bindVars, Touchpoint.class)
				.getResultsAsObject();
		return p;
	}

	public static Touchpoint getByUrl(String url) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("url", url);
		Touchpoint p = new ArangoDbQuery<Touchpoint>(db, AQL_GET_TOUCHPOINT_BY_URL, bindVars, Touchpoint.class)
				.getResultsAsObject();
		return p;
	}

	public static List<Touchpoint> list(int startIndex, int numberResult) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		List<Touchpoint> list = new ArangoDbQuery<Touchpoint>(db, AQL_GET_TOUCHPOINTS, bindVars, Touchpoint.class)
				.getResultsAsList();
		return list;
	}

}
