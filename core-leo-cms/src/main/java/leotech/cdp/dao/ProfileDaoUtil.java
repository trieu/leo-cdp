package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.model.customer.Profile;
import leotech.cdp.query.ProfileMatchingResult;
import leotech.cdp.query.ProfileQuery;
import leotech.system.config.AqlTemplate;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataTablePayload;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbQuery.CallbackQuery;

public class ProfileDaoUtil extends BaseLeoCdpDao {

	
	private static final String AQL_COUNT_TOTAL_ACTIVE_PROFILES = "RETURN LENGTH( FOR p in "+Profile.COLLECTION_NAME+" FILTER  p.status > 0 RETURN p._key)";
	static final String AQL_GET_PROFILES_BY_PAGINATION = AqlTemplate.get("AQL_GET_PROFILES_BY_PAGINATION");
	static final String AQL_GET_ACTIVE_PROFILES_BY_PAGINATION = AqlTemplate.get("AQL_GET_ACTIVE_PROFILES_BY_PAGINATION");
	
	static final String AQL_GET_PROFILE_BY_ID = AqlTemplate.get("AQL_GET_PROFILE_BY_ID");
	static final String AQL_GET_PROFILE_BY_IDENTITY = AqlTemplate.get("AQL_GET_PROFILE_BY_IDENTITY");
	static final String AQL_GET_PROFILE_BY_PRIMARY_EMAIL = AqlTemplate.get("AQL_GET_PROFILE_BY_PRIMARY_EMAIL");
	static final String AQL_GET_PROFILE_BY_KEY_IDENTITIES = AqlTemplate.get("AQL_GET_PROFILE_BY_KEY_IDENTITIES");
	static final String AQL_GET_PROFILE_REAL_TIME_IDENTITY_RESOLUTION = AqlTemplate.get("AQL_GET_PROFILE_REAL_TIME_IDENTITY_RESOLUTION");
	
	// --------------------------------------------------------- //
	static final long FREE_LIMIT = 5000;
	public static boolean checkLimitOfLicense() {
		long limit = FREE_LIMIT;
		//TODO get from server for Paid version
		return limit > 0 && countTotalOfProfiles() <= limit;
	}
	// --------------------------------------------------------- //

	
	public static String create(Profile profile) {
		if (profile.isReadyForSave() && checkLimitOfLicense()) {
			ArangoCollection col = profile.getDbCollection();
			if (col != null) {
				col.insertDocument(profile);
				return profile.getId();
			}
		}
		return null;
	}

	public static String update(Profile profile) {
		if (profile.isReadyForSave()) {
			ArangoCollection col = profile.getDbCollection();
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
	
	public static Profile realTimeIdentityResolution(String visitorId, String email) {
		Map<String, Object> bindVars = new HashMap<>(2);
		
		// deterministic
		bindVars.put("visitorId", visitorId);
		bindVars.put("email", email);
		
		ArangoDatabase db = getCdpDbInstance();
		ProfileMatchingResult matchRs = new ArangoDbQuery<ProfileMatchingResult>(db, AQL_GET_PROFILE_REAL_TIME_IDENTITY_RESOLUTION, bindVars, ProfileMatchingResult.class).getResultsAsObject();
		return matchRs.getProfileByDeterministicProcessing();
	}
	
	public static Profile getById(String id) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("id", id);
		Profile p = new ArangoDbQuery<Profile>(db, AQL_GET_PROFILE_BY_ID, bindVars, Profile.class).getResultsAsObject();
		return p;
	}
	
	public static Profile getByPrimaryEmail(String email) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("email", email);
		Profile p = new ArangoDbQuery<Profile>(db, AQL_GET_PROFILE_BY_PRIMARY_EMAIL, bindVars, Profile.class).getResultsAsObject();
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
	
	public static List<Profile> listAllWithPagination(int startIndex, int numberResult) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		List<Profile> list = new ArangoDbQuery<Profile>(db, AQL_GET_PROFILES_BY_PAGINATION, bindVars, Profile.class).getResultsAsList();
		return list;
	}
	
	public static List<Profile> getProfilesByFilterMap(Map<String, Object> filterMap, String notIncludeId) {
		ArangoDatabase db = getCdpDbInstance();
		
		StringBuffer aql = new StringBuffer("FOR p in ").append(Profile.COLLECTION_NAME);
		aql.append(" FILTER p.status == 1 AND p._key != @id ");
		Set<String> keys = filterMap.keySet();
		for (String key : keys) {
			aql.append(" AND p.").append(key).append(" == @").append(key);
		}
		aql.append(" RETURN p ");
		
		filterMap.put("id", notIncludeId);
		
		List<Profile> list = new ArangoDbQuery<Profile>(db, aql.toString(), filterMap, Profile.class).getResultsAsList();
		return list;
	}
	
	
	public static long getTotalRecordsFiltered(DataFilter filter) {
		//TODO
		return countTotalOfProfiles();
	}
	
	public static JsonDataTablePayload filter(DataFilter filter){
		int draw = filter.getDraw();
		
		List<ProfileSingleDataView> list = runFilterQuery(filter);
		long recordsTotal = ProfileDaoUtil.countTotalOfProfiles();
		long recordsFiltered = getTotalRecordsFiltered(filter);
		
		JsonDataTablePayload payload =  JsonDataTablePayload.data(filter.getUri(), list, recordsTotal, recordsFiltered, draw);
		return payload;
	}

	private static List<ProfileSingleDataView> runFilterQuery(DataFilter filter) {
		ArangoDatabase db = getCdpDbInstance();
		//TODO dynamic query builder for filtering data
		List<ProfileSingleDataView> list = getProfilesByFilter(filter, db);
		return list;
	}
	
	public static List<ProfileSingleDataView> listSingleViewAllWithPagination(int startIndex, int numberResult) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		
		CallbackQuery<ProfileSingleDataView> callback = new CallbackQuery<ProfileSingleDataView>() {
			@Override
			public ProfileSingleDataView apply(ProfileSingleDataView obj) {
				obj.unifyDataView();
				return obj;
			}
		};
		ArangoDbQuery<ProfileSingleDataView> q = new ArangoDbQuery<ProfileSingleDataView>(db, AQL_GET_ACTIVE_PROFILES_BY_PAGINATION, bindVars, ProfileSingleDataView.class, callback);
		List<ProfileSingleDataView> list = q.getResultsAsList();
		return list;
	}

	private static List<ProfileSingleDataView> getProfilesByFilter(DataFilter filter, ArangoDatabase db) {
		
		// FIXME
		
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
		ArangoDbQuery<ProfileSingleDataView> q = new ArangoDbQuery<ProfileSingleDataView>(db, AQL_GET_ACTIVE_PROFILES_BY_PAGINATION, bindVars, ProfileSingleDataView.class, callback);
		List<ProfileSingleDataView> list = q.getResultsAsList();
		return list;
	}
	
	public static long countProfilesByQuery(ProfileQuery profileQuery) {
		ArangoDatabase db = getCdpDbInstance();
		String aql = profileQuery.toArangoCountingQuery();
		
		System.out.println("countProfilesByQuery " + aql);
		long c =  new ArangoDbQuery<Long>(db, aql, Long.class).getResultsAsObject();
		return c;
	}
	
	public static List<ProfileSingleDataView> getProfilesByQuery(ProfileQuery profileQuery) {
		ArangoDatabase db = getCdpDbInstance();
		CallbackQuery<ProfileSingleDataView> callback = new CallbackQuery<ProfileSingleDataView>() {
			@Override
			public ProfileSingleDataView apply(ProfileSingleDataView obj) {
				obj.unifyDataView();
				return obj;
			}
		};
		String aql = profileQuery.toArangoDataQuery();
		
		System.out.println("getProfilesByQuery " + aql);
		
		ArangoDbQuery<ProfileSingleDataView> q = new ArangoDbQuery<ProfileSingleDataView>(db, aql, ProfileSingleDataView.class, callback);
		List<ProfileSingleDataView> list = q.getResultsAsList();
		return list;
	}

	public static long countTotalOfProfiles() {
		ArangoDatabase db = getCdpDbInstance();
		long c =  new ArangoDbQuery<Long>(db, AQL_COUNT_TOTAL_ACTIVE_PROFILES, Long.class).getResultsAsObject();
		return c;
	}
	

}
