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
	
	public static Segment updateFromJson(String json) {
		Segment dataObj = new Gson().fromJson(json, Segment.class);
		
		// TODO run in a thread to commit to database
		SegmentDaoUtil.update(dataObj);
		return dataObj;
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
		return new Segment("", "{}", beginFilterDate, endFilterDate);
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
	
	public static List<ProfileSingleDataView> getProfilesInSegment(String id, int startIndex, int numberResult){
		Segment sm = SegmentDaoUtil.getById(id);
		ProfileQuery profileQuery = sm.toProfileQuery(startIndex, numberResult);
		List<ProfileSingleDataView> rs = ProfileDaoUtil.getProfilesByQuery(profileQuery);
		return rs;
	}
	
	public static boolean remove(String id) {
		Segment sm = SegmentDaoUtil.getById(id);
		// the data is not deleted, we need to remove it from valid data view, set status of object = -4
		sm.setStatus(-4);
		
		// TODO run in a thread to commit to database
		SegmentDaoUtil.update(sm);
		return sm != null;
	}
}
