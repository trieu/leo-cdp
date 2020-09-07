package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.customer.Segment;
import leotech.cdp.query.ProfileQuery;
import leotech.system.config.AqlTemplate;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataTablePayload;
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
	static final String AQL_GET_SEGMENTS_TO_DELETE_FOREVER = AqlTemplate.get("AQL_GET_SEGMENTS_TO_DELETE_FOREVER");
	
	

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
	
	public static List<Segment> list(int startIndex, int numberResult) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		List<Segment> list = new ArangoDbQuery<Segment>(db, AQL_GET_SEGMENTS_BY_PAGINATION, bindVars, Segment.class).getResultsAsList();
		return list;
	}
	
	public static List<Segment> getSegmentsToDeleteForever() {
		ArangoDatabase db = getCdpDbInstance();
		List<Segment> list = new ArangoDbQuery<Segment>(db, AQL_GET_SEGMENTS_TO_DELETE_FOREVER, Segment.class).getResultsAsList();
		return list;
	}
	
	public static boolean delete(Segment segment) {
		ArangoCollection col = segment.getCollection();
		if (col != null) {
			col.deleteDocument(segment.getId());
			return true;
		}
		return false;
	}
	
	public static JsonDataTablePayload filter(DataFilter filter){
		int draw = filter.getDraw();
		
		List<Segment> list = runFilterQuery(filter);
		long recordsTotal = countTotalOfSegments();
		long recordsFiltered = getTotalRecordsFiltered(filter);
		
		JsonDataTablePayload payload =  JsonDataTablePayload.data(filter.getUri(), list, recordsTotal, recordsFiltered, draw);
		return payload;
	}
	
	private static List<Segment> runFilterQuery(DataFilter filter) {
		ArangoDatabase db = getCdpDbInstance();
		//TODO dynamic query builder for filtering data
		List<Segment> list = getSegmentsByPagination(filter, db);
		return list;
	}

	private static List<Segment> getSegmentsByPagination(DataFilter filter, ArangoDatabase db) {
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("startIndex", filter.getStart());
		bindVars.put("numberResult", filter.getLength());
		
		ArangoDbQuery<Segment> q = new ArangoDbQuery<Segment>(db, AQL_GET_SEGMENTS_BY_PAGINATION, bindVars, Segment.class);
		List<Segment> list = q.getResultsAsList();
		return list;
	}
	
	public static long getTotalRecordsFiltered(DataFilter filter) {
		//TODO
		return countTotalOfSegments();
	}
	
	public static long countTotalOfSegments() {
		ArangoDatabase db = getCdpDbInstance();
		return db.collection(Segment.COLLECTION_NAME).count().getCount();
	}

}
