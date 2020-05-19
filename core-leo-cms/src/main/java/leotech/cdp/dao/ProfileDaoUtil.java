package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.audience.Profile;
import leotech.cdp.model.business.Touchpoint;
import leotech.cdp.query.ProfileMatchingResult;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class ProfileDaoUtil {

	static long limitTotalProfiles = 5000;
	
	static final String AQL_GET_PROFILES_BY_PAGINATION = AqlTemplate.get("AQL_GET_PROFILES_BY_PAGINATION");
	static final String AQL_GET_PROFILE_BY_ID = AqlTemplate.get("AQL_GET_PROFILE_BY_ID");
	static final String AQL_GET_PROFILE_BY_IDENTITY = AqlTemplate.get("AQL_GET_PROFILE_BY_IDENTITY");
	static final String AQL_GET_PROFILE_BY_KEY_IDENTITIES = AqlTemplate.get("AQL_GET_PROFILE_BY_KEY_IDENTITIES");

	public static boolean checkLimitOfLicense() {
		return limitTotalProfiles > 0 && countTotalOfProfiles() < limitTotalProfiles;
	}

	public static String create(Profile profile) {
		if (profile.isReadyForSave() && checkLimitOfLicense()) {
			ArangoCollection col = profile.getCollection();
			if (col != null) {
				col.insertDocument(profile);
				return profile.getId();
			}
		}
		return null;
	}

	public static String update(Profile profile) {
		if (profile.isReadyForSave()) {
			ArangoCollection col = profile.getCollection();
			if (col != null) {
				String k = profile.getId();
				if (k != null) {
					profile.setUpdatedAt(new Date());
					col.updateDocument(k, profile);
				}
				return profile.getId();
			}
		}
		return null;
	}

	public static Profile getByVisitorId(String visitorId) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("visitorId", visitorId);
		Profile p = new ArangoDbQuery<Profile>(db, AQL_GET_PROFILE_BY_IDENTITY, bindVars, Profile.class).getResultsAsObject();
		return p;
	}
	
	public static Profile getByKeyIdentities(String visitorId, String email, String phone, String userDeviceId, String fingerprintId) {
		System.out.println("==> getByKeyIdentities visitorId:" + visitorId + " email:" + email + " phone:" + phone + " userDeviceId:" + userDeviceId+ " fingerprintId:" + fingerprintId);
		
		Map<String, Object> bindVars = new HashMap<>(4);
		bindVars.put("visitorId", visitorId);
		bindVars.put("email", email);
		bindVars.put("phone", phone);
		bindVars.put("userDeviceId", userDeviceId);
		bindVars.put("fingerprintId", fingerprintId);
		
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		ProfileMatchingResult matchRs = new ArangoDbQuery<ProfileMatchingResult>(db, AQL_GET_PROFILE_BY_KEY_IDENTITIES, bindVars, ProfileMatchingResult.class)
				.getResultsAsObject();
		return matchRs.getBestMatchingProfile();
	}
	
	public static Profile getById(String id) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("id", id);
		Profile p = new ArangoDbQuery<Profile>(db, AQL_GET_PROFILE_BY_ID, bindVars, Profile.class).getResultsAsObject();
		return p;
	}
	
	public static List<Profile> list(int startIndex, int numberResult) {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		List<Profile> list = new ArangoDbQuery<Profile>(db, AQL_GET_PROFILES_BY_PAGINATION, bindVars, Profile.class).getResultsAsList();
		return list;
	}

	public static long countTotalOfProfiles() {
		ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
		long c = db.collection(Profile.COLLECTION_NAME).count().getCount();
		return c;
	}
	

}
