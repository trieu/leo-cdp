package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDBException;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.audience.ContextSession;
import leotech.cdp.model.business.Touchpoint;
import leotech.cms.model.Post;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class ContextSessionDaoUtil {

	static final String AQL_GET_CONTEXT_SESSIONS_BY_VISITOR_ID = AqlTemplate
			.get("AQL_GET_CONTEXT_SESSIONS_BY_VISITOR_ID");
	static final String AQL_GET_CONTEXT_SESSIONS_BY_PROFILE_ID = AqlTemplate
			.get("AQL_GET_CONTEXT_SESSIONS_BY_PROFILE_ID");
	static final String AQL_GET_CONTEXT_SESSION_BY_KEY = AqlTemplate.get("AQL_GET_CONTEXT_SESSION_BY_KEY");
	private static final String AQL_FIND_KEY_AQL = ArangoDbUtil.contentFindKeyAql(ContextSession.COLLECTION_NAME);

	public static ContextSession create(ContextSession s) {
		if (s.isReadyForSave()) {
			ArangoCollection col = s.getCollection();
			if (col != null) {
				try {
					col.insertDocument(s);
					return s;
				} catch (ArangoDBException e) {
				}
			}
		}
		return null;
	}
	
	public static ContextSession update(ContextSession s) {
		if (s.isReadyForSave()) {
			ArangoCollection col = s.getCollection();
			if (col != null) {
				try {
					//String _key = ArangoDbUtil.findKey(AQL_FIND_KEY_AQL, "id", id);
					s.setUpdatedAt(new Date());
					col.updateDocument(s.getSessionKey(), s);
					return s;
				} catch (ArangoDBException e) {
				}
			}
		}
		return null;
	}

	public static ContextSession getByKey(String sessionKey) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("sessionKey", sessionKey);
		ContextSession s = new ArangoDbQuery<ContextSession>(db, AQL_GET_CONTEXT_SESSION_BY_KEY, bindVars,
				ContextSession.class).getResultsAsObject();
		return s;
	}

	public static List<ContextSession> getSessionsByVisitorId(String visitorId) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("visitorId", visitorId);
		List<ContextSession> list = new ArangoDbQuery<ContextSession>(db, AQL_GET_CONTEXT_SESSIONS_BY_VISITOR_ID,
				bindVars, ContextSession.class).getResultsAsList();
		return list;
	}

	public static List<ContextSession> geSessionsByProfileId(String profileId) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("profileId", profileId);
		List<ContextSession> list = new ArangoDbQuery<ContextSession>(db, AQL_GET_CONTEXT_SESSIONS_BY_PROFILE_ID,
				bindVars, ContextSession.class).getResultsAsList();
		return list;
	}

}
