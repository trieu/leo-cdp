package leotech.cdp.service;

import java.util.List;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.dao.SegmentDaoUtil;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.model.customer.Segment;
import leotech.cdp.query.ProfileQuery;

public class SegmentDataService {

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
	
	
}
