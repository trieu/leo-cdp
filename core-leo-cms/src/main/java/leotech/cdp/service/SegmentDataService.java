package leotech.cdp.service;

import java.time.Instant;
import java.util.List;

import com.google.gson.Gson;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.dao.SegmentDaoUtil;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.model.customer.Segment;
import leotech.cdp.query.ProfileQuery;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataTablePayload;
import rfx.core.util.StringUtil;

public class SegmentDataService {
	
	private static final int ONE_WEEK_SECONDS = 86400 * 7;

	public static Segment create(Segment sm) {
		SegmentDaoUtil.create(sm);
		return sm;
	}
	
	public static Segment create(String name, String jsonQueryRules,  String beginFilterDate, String endFilterDate) {
		Segment sm = new Segment(name, jsonQueryRules, beginFilterDate, endFilterDate);
		SegmentDaoUtil.create(sm);
		return sm;
	}

	public static Segment create(String name, String jsonQueryRules, List<String> selectedFields, String beginFilterDate, String endFilterDate) {
		Segment sm = new Segment(name, jsonQueryRules, selectedFields, beginFilterDate, endFilterDate);
		SegmentDaoUtil.create(sm);
		return sm;
	}
	
	public static Segment update(String id, String name, String jsonQueryRules, List<String> selectedFields, String beginFilterDate, String endFilterDate) {
		Segment sm = SegmentDaoUtil.getById(id);
		sm.setName(name);
		sm.setJsonQueryRules(jsonQueryRules);
		sm.setSelectedFields(selectedFields);
		sm.setBeginFilterDate(beginFilterDate);
		sm.setEndFilterDate(endFilterDate);
		SegmentDaoUtil.update(sm);
		return sm;
	}
	
	public static Segment update(String id, String name, String jsonQueryRules, String beginFilterDate, String endFilterDate) {
		Segment sm = SegmentDaoUtil.getById(id);
		sm.setName(name);
		sm.setJsonQueryRules(jsonQueryRules);
		sm.setBeginFilterDate(beginFilterDate);
		sm.setEndFilterDate(endFilterDate);
		SegmentDaoUtil.update(sm);
		return sm;
	}
	
	public static Segment update(Segment sm) {
		SegmentDaoUtil.update(sm);
		return sm;
	}
	
	public static String saveFromJson(String json) {
		Segment segment = new Gson().fromJson(json, Segment.class);
		
		String id = segment.getId();
		System.out.println("saveFromJson "+segment);
		
		// TODO run in a thread to commit to database
		
		if(StringUtil.isNotEmpty(id)) {
			return SegmentDaoUtil.update(segment);
		} else {
			segment.buildHashKey();
			return SegmentDaoUtil.create(segment);
		}
	}
	
	
	public static JsonDataTablePayload filter(DataFilter filter){
		//TODO caching
		return SegmentDaoUtil.filter(filter);
	}
	
	public static List<Segment> list(int startIndex, int numberResult){
		return SegmentDaoUtil.list(startIndex, numberResult);
	}
	
	public static Segment getById(String id) {
		return SegmentDaoUtil.getById(id);
	}
	
	public static Segment newInstance() {
		// default is one week
		String beginFilterDate = Instant.now().minusSeconds(ONE_WEEK_SECONDS).toString();
		String endFilterDate = Instant.now().toString();
		return new Segment(beginFilterDate, endFilterDate);
	}
	
	public static long computeSegmentSize(String name, String jsonQueryRules, List<String> selectedFields, String beginFilterDate, String endFilterDate) {
		Segment sm = new Segment(name, jsonQueryRules, selectedFields, beginFilterDate, endFilterDate);
		ProfileQuery profileQuery = sm.toProfileQuery();
		long count  = ProfileDaoUtil.countProfilesByQuery(profileQuery);
		return count;
	}
	
	public static List<ProfileSingleDataView> previewTopProfilesSegment(String name, String jsonQueryRules, List<String> selectedFields, String beginFilterDate, String endFilterDate){
		Segment sm = new Segment(name, jsonQueryRules, selectedFields, beginFilterDate, endFilterDate);
		ProfileQuery profileQuery = sm.toProfileQuery();
		
		List<ProfileSingleDataView> rs = ProfileDaoUtil.getProfilesByQuery(profileQuery);
		return rs;
	}
	
	public static List<ProfileSingleDataView> getProfilesInSegment(String segmentId, int startIndex, int numberResult){
		Segment sm = SegmentDaoUtil.getById(segmentId);
		ProfileQuery profileQuery = sm.toProfileQuery(startIndex, numberResult);
		List<ProfileSingleDataView> rs = ProfileDaoUtil.getProfilesByQuery(profileQuery);
		return rs; 
	}
	
	public static JsonDataTablePayload getProfilesInSegment(String segmentId, DataFilter filter) {
		int draw = filter.getDraw();
		
		Segment sm = SegmentDaoUtil.getById(segmentId);
		int startIndex = filter.getStart();
		int numberResult = filter.getLength();
		ProfileQuery profileQuery = sm.toProfileQuery(startIndex, numberResult);
		List<ProfileSingleDataView> profilesInSegment = ProfileDaoUtil.getProfilesByQuery(profileQuery);
		
		long recordsTotal = sm.getTotalCount();
		long recordsFiltered = ProfileDaoUtil.countProfilesByQuery(profileQuery);
		
		JsonDataTablePayload payload =  JsonDataTablePayload.data(filter.getUri(), profilesInSegment, recordsTotal, recordsFiltered, draw);
		return payload;
	}
	
	public static boolean remove(String id) {
		Segment sm = SegmentDaoUtil.getById(id);
		// the data is not deleted, we need to remove it from valid data view, set status of object = -4
		sm.setStatus(Segment.STATUS_REMOVED);
		
		// TODO run in a thread to commit to database
		SegmentDaoUtil.update(sm);
		return sm != null;
	}
}
