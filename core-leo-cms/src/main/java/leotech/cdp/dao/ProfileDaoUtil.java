package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.model.customer.Profile;
import leotech.cdp.query.ProfileMatchingResult;
import leotech.core.config.AqlTemplate;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataTablePayload;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbQuery.CallbackQuery;

public class ProfileDaoUtil  extends BaseLeoCdpDao {

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
		ArangoDatabase db = getCdpDbInstance();
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
		
		ArangoDatabase db = getCdpDbInstance();
		ProfileMatchingResult matchRs = new ArangoDbQuery<ProfileMatchingResult>(db, AQL_GET_PROFILE_BY_KEY_IDENTITIES, bindVars, ProfileMatchingResult.class)
				.getResultsAsObject();
		return matchRs.getBestMatchingProfile();
	}
	
	public static Profile getById(String id) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("id", id);
		Profile p = new ArangoDbQuery<Profile>(db, AQL_GET_PROFILE_BY_ID, bindVars, Profile.class).getResultsAsObject();
		return p;
	}
	
	public static ProfileSingleDataView getSingleViewById(String id) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("id", id);
		CallbackQuery<ProfileSingleDataView> callback = new CallbackQuery<ProfileSingleDataView>() {
			@Override
			public ProfileSingleDataView apply(ProfileSingleDataView obj) {
				obj.unifyDataView();
				return obj;
			}
		};
		ProfileSingleDataView p = new ArangoDbQuery<ProfileSingleDataView>(db, AQL_GET_PROFILE_BY_ID, bindVars, ProfileSingleDataView.class, callback).getResultsAsObject();
		return p;
	}
	
	public static List<Profile> list(int startIndex, int numberResult) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		List<Profile> list = new ArangoDbQuery<Profile>(db, AQL_GET_PROFILES_BY_PAGINATION, bindVars, Profile.class).getResultsAsList();
		return list;
	}
	
	public static List<ProfileSingleDataView> filter(DataFilter filter) {
		ArangoDatabase db = getCdpDbInstance();
		
		//System.out.println("==> before apply DataFilter " + filter);
		
		//TODO dynamic query builder for filtering data
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("startIndex", filter.getStart());
		bindVars.put("numberResult", filter.getLength());
		
		CallbackQuery<ProfileSingleDataView> callback = new CallbackQuery<ProfileSingleDataView>() {
			@Override
			public ProfileSingleDataView apply(ProfileSingleDataView obj) {
				obj.unifyDataView();
				return obj;
			}
		};
		List<ProfileSingleDataView> list = new ArangoDbQuery<ProfileSingleDataView>(db, AQL_GET_PROFILES_BY_PAGINATION, 
				bindVars, ProfileSingleDataView.class, callback).getResultsAsList();
		
		return list;
	}

	public static long countTotalOfProfiles() {
		ArangoDatabase db = getCdpDbInstance();
		long c = db.collection(Profile.COLLECTION_NAME).count().getCount();
		return c;
	}
	

}
