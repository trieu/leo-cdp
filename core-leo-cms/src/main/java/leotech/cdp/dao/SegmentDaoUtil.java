package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.customer.Profile;
import leotech.cdp.model.customer.Segment;
import leotech.cdp.query.ProfileQuery;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;

/**
 * Segment Data Access Object
 * 
 * @author tantrieuf31
 * @since 2020
 *
 */
public class SegmentDaoUtil extends BaseLeoCdpDao {
	
	static final String AQL_GET_SEGMENTS_BY_PAGINATION = AqlTemplate.get("AQL_GET_SEGMENTS_BY_PAGINATION");
	static final String AQL_GET_SEGMENT_BY_ID = AqlTemplate.get("AQL_GET_SEGMENT_BY_ID");

	// update total size of segment
	private static void setSizeOfSegment(Segment segment) {
		ProfileQuery profileQuery = segment.toProfileQuery();
		long count  = ProfileDaoUtil.countProfilesByQuery(profileQuery);
		segment.setTotalCount(count);
	}
	
	public static String create(Segment segment) {
		if (segment.isReadyForSave() ) {
			ArangoCollection col = segment.getCollection();
			if (col != null) {
				setSizeOfSegment(segment);
				col.insertDocument(segment);
				return segment.getId();
			}
		}
		return null;
	}

	public static String update(Segment segment) {
		if (segment.isReadyForSave()) {
			ArangoCollection col = segment.getCollection();
			if (col != null) {
				String k = segment.getId();
				if (k != null) {
					segment.setUpdatedAt(new Date());
					setSizeOfSegment(segment);
					col.updateDocument(k, segment);
				}
				return segment.getId();
			}
		}
		return null;
	}

	public static Segment getById(String id) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("id", id);
		Segment s = new ArangoDbQuery<Segment>(db, AQL_GET_SEGMENT_BY_ID, bindVars, Segment.class).getResultsAsObject();
		return s;
	}
	
	public static List<Profile> list(int startIndex, int numberResult) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		List<Profile> list = new ArangoDbQuery<Profile>(db, AQL_GET_SEGMENTS_BY_PAGINATION, bindVars, Profile.class).getResultsAsList();
		return list;
	}

}
