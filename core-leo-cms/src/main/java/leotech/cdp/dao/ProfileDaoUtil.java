package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.devskiller.friendly_id.FriendlyId;

import leotech.cdp.model.Profile;
import leotech.cms.model.Page;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class ProfileDaoUtil {

    static long limitTotalProfiles = 7000;
    static final String AQL_GET_PROFILE_BY_ID = AqlTemplate.get("AQL_GET_PROFILE_BY_ID");

    public static boolean checkLimitOfLicense() {
	return limitTotalProfiles > 0 && countTotalOfProfiles() < limitTotalProfiles;
    }

    public static String create(Profile profile) {
	if (profile.isReadyForSave() && checkLimitOfLicense()) {
	    ArangoCollection col = profile.getCollection();
	    if (col != null) {
		String id = FriendlyId.createFriendlyId();
		profile.setId(id);
		col.insertDocument(profile);
		return id;
	    }
	}
	return null;
    }

    public static String update(Profile profile) {
	if (profile.isReadyForSave()) {
	    ArangoCollection col = profile.getCollection();
	    if (col != null) {
		String k = profile.getKey();

		if (k != null) {
		    profile.setUpdatedAt(new Date());
		    col.updateDocument(k, profile);
		}
		return profile.getId();
	    }
	}
	return null;
    }

    public static Profile getById(String id) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(1);
	bindVars.put("id", id);
	Profile p = new ArangoDbQuery<Profile>(db, AQL_GET_PROFILE_BY_ID, bindVars, Profile.class).getResultsAsObject();
	return p;
    }

    public static long countTotalOfProfiles() {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	long c = db.collection(Profile.COLLECTION_NAME).count().getCount();
	return c;
    }

}