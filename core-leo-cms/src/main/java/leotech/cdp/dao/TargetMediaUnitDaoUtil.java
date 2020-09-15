package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.activation.TargetMediaUnit;
import leotech.system.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class TargetMediaUnitDaoUtil extends AbstractCdpDatabaseUtil {
	
	static final String AQL_GET_TARGET_MEDIA_UNIT_BY_ID = AqlTemplate.get("AQL_GET_TARGET_MEDIA_UNIT_BY_ID");
	static final String AQL_GET_TARGET_MEDIA_UNIT_BY_PROFILE_ID = AqlTemplate.get("AQL_GET_TARGET_MEDIA_UNIT_BY_PROFILE_ID");
	
	public static String save(TargetMediaUnit m) {
		if (m.isReadyForSave()) {
			ArangoDatabase db = getCdpDbInstance();
			ArangoCollection col = m.getDbCollection();
			if (col != null) {
				String id = m.getId();
				boolean isExisted = ArangoDbUtil.isExistedDocument(db, TargetMediaUnit.COLLECTION_NAME, id);
				if (isExisted) {
					m.setUpdatedAt(new Date());
					col.updateDocument(id, m);
				} else {
					col.insertDocument(m);
				}
				return id;
			}
		}
		System.err.println("is not ReadyForSave " + m);
		return "";
	}

	public static TargetMediaUnit getById(String id) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("id", id);
		TargetMediaUnit p = new ArangoDbQuery<TargetMediaUnit>(db, AQL_GET_TARGET_MEDIA_UNIT_BY_ID, bindVars, TargetMediaUnit.class).getResultsAsObject();
		return p;
	}

	public static TargetMediaUnit getByProfileId(String targetProfileId) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("targetProfileId", targetProfileId);
		TargetMediaUnit p = new ArangoDbQuery<TargetMediaUnit>(db, AQL_GET_TARGET_MEDIA_UNIT_BY_PROFILE_ID, bindVars, TargetMediaUnit.class)
				.getResultsAsObject();
		return p;
	}

	public static void main(String[] args) {
		String targetProfileId = "66WTjXnpk7WqnrXlDuuUBJ";
		
		String landingPageUrl = "https://demobookshop.leocdp.com/product/introducing-data-science-big-data-machine-learning-and-more-using-python-tools/";
		String landingPageName = "Introducing Data Science: Big Data, Machine Learning, and more, using Python tools";
		String rs = TargetMediaUnitDaoUtil.save(new TargetMediaUnit(targetProfileId, landingPageUrl, landingPageName,"web-notification-click"));
		System.out.println(rs);
		
	}
}
