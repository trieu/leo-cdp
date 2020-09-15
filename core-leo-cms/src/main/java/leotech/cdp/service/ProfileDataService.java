package leotech.cdp.service;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.google.gson.Gson;

import io.vertx.core.json.JsonObject;
import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.dao.TrackingEventDao;
import leotech.cdp.dao.singleview.EventSingleDataView;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.job.reactive.JobUpdateProfileSingleView;
import leotech.cdp.model.customer.Profile;
import leotech.cdp.model.customer.ProfileType;
import leotech.cdp.model.journey.BehavioralEventMetric;
import leotech.cdp.model.journey.DataFlowStage;
import leotech.cdp.model.journey.EventMetaData;
import leotech.cdp.query.ProfileQuery;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataTablePayload;
import leotech.system.model.SystemUser;
import rfx.core.util.StringUtil;

public class ProfileDataService {

	private static final String SOCIAL_LOGIN = "social-login";
	private static final String CRM_IMPORT = "crm-import";

	public static Profile updateOrCreateFromWebTouchpoint(String observerId,String srcTouchpointId, String refTouchpointId, String touchpointRefDomain, String lastSeenIp,
			String visitorId, String userDeviceId, String fingerprintId) {
		return updateOrCreate( observerId, srcTouchpointId, refTouchpointId, touchpointRefDomain,lastSeenIp, visitorId, userDeviceId, fingerprintId, "", "", "", "");
	}
	
	public static void updateProfileFromEvent(String profileId, String observerId, String srcTouchpointId, String touchpointRefDomain, String lastSeenIp, String userDeviceId, String eventName) {
		ProfileSingleDataView pf = ProfileDaoUtil.getSingleViewById(profileId);
	
		if(pf != null) {
			
			pf.engageAtTouchpointId(srcTouchpointId);
			pf.updateReferrerChannel(touchpointRefDomain);
			pf.setLastObserverId(observerId);
			pf.setLastTouchpointId(srcTouchpointId);
			pf.setLastSeenIp(lastSeenIp);
			pf.setLastUsedDeviceId(userDeviceId);
			pf.updateEventCount(eventName);
			
			JobUpdateProfileSingleView.job().enque(pf);
		}
	}

	public static Profile updateOrCreate( String observerId, String srcTouchpointId,
			String refTouchpointId, String touchpointRefDomain, String lastSeenIp, String visitorId,
			String userDeviceId, String fingerprintId, String email, String phone, String loginId, String loginProvider) {

		// the key function for real-time Identity Resolution into one profile
		Profile pf = ProfileDaoUtil.realTimeIdentityResolution(visitorId, email);
		
		if (pf == null) {
			
			int type = ProfileType.TYPE_ANONYMOUS;
			if (StringUtil.isNotEmpty(email) || StringUtil.isNotEmpty(phone) || StringUtil.isNotEmpty(loginId)) {
				type = ProfileType.TYPE_IDENTIFIED;
			} else if (StringUtil.isNotEmpty(email) && StringUtil.isNotEmpty(phone)) {
				type = ProfileType.TYPE_CRM_CONTACT;
			}
			
			if (type == ProfileType.TYPE_ANONYMOUS) {
				pf = Profile.newAnonymousProfile( observerId, srcTouchpointId, lastSeenIp, visitorId,
						userDeviceId, fingerprintId);
			} else if (type == ProfileType.TYPE_IDENTIFIED) {

				pf = Profile.newIdentifiedProfile( observerId, srcTouchpointId, lastSeenIp, visitorId,
						userDeviceId, email, fingerprintId);

				if (StringUtil.isNotEmpty(loginId)) {
					pf.setIdentity(loginId, loginProvider);
				}
			} 

			pf.engageAtTouchpointId(refTouchpointId);
			pf.updateReferrerChannel(touchpointRefDomain);
			pf.updateReferrerChannel(loginProvider);

			// TODO run in a thread to commit to database
			ProfileDaoUtil.create(pf);
		} else {
			
			pf.engageAtTouchpointId(refTouchpointId);
			pf.updateReferrerChannel(touchpointRefDomain);
			pf.updateReferrerChannel(loginProvider);
			pf.setIdentity(loginId, loginProvider);
			
			pf.setPrimaryEmail(email);
			pf.setPrimaryPhone(phone);
			pf.setLastObserverId(observerId);
			pf.setLastTouchpointId(srcTouchpointId);
			pf.setLastSeenIp(lastSeenIp);
			pf.setLastUsedDeviceId(userDeviceId);
			pf.setUpdatedAt(new Date());

			// TODO run in a thread to commit to database
			ProfileDaoUtil.update(pf);
		}

		return pf;
	}

	public static Profile updateBasicProfileInfo(String profileId, String loginId, String loginProvider, String firstName, String lastName, String email, String phone, 
			String genderStr, int age, String observerId, String lastTouchpointId, String lastSeenIp, String usedDeviceId, Set<String> contentKeywords) {
		Profile p = ProfileDaoUtil.getById(profileId);

		if( StringUtil.isNotEmpty(loginId) && StringUtil.isNotEmpty(loginProvider) ) {
			p.setSocialMediaProfile(loginProvider, loginId);
			p.setIdentity(loginId, loginProvider);
			p.setType(ProfileType.TYPE_SOCIAL_LOGIN);
		} else {
			p.setType(ProfileType.TYPE_IDENTIFIED);
		}
		
		if(StringUtil.isNotEmpty(firstName)) {
			p.setFirstName(firstName);
		}
		
		if(StringUtil.isNotEmpty(lastName)) {
			p.setLastName(lastName);
		}
		
		if(StringUtil.isNotEmpty(email)) {
			p.setPrimaryEmail(email);
		}
		
		if(StringUtil.isNotEmpty(phone)) {
			p.setPrimaryPhone(phone);
		}
		
		if(StringUtil.isNotEmpty(genderStr)) {
			p.setGender(genderStr);
		}
		
		if(age >= 16) {
			p.setAge(age);
		}

		if(StringUtil.isNotEmpty(usedDeviceId)) {
			p.setLastUsedDeviceId(usedDeviceId);
		}

		p.setLastObserverId(observerId);
		p.setLastTouchpointId(lastTouchpointId);
		p.setLastSeenIp(lastSeenIp);
		p.setUpdatedAt(new Date());
		p.setContentKeywords(contentKeywords);

		// TODO run in a thread to commit to database
		ProfileDaoUtil.update(p);
		return p;
	}
	
	public static Profile setNotificationUserIds(String profileId, String provider, String userId) {
		Profile p = ProfileDaoUtil.getById(profileId);
		System.out.println("setNotificationUserIds " + profileId + " provider " + provider + " userId " + userId );

		// web push User Id
		Map<String, Set<String>> notificationUserIds = new HashMap<>(1);
		notificationUserIds.put(provider, new HashSet<String>(Arrays.asList(userId)));
		p.setNotificationUserIds(notificationUserIds);
		
		// for id resulution
		String extId = userId + "#" + provider;
		p.addIdentityData(extId);

		// TODO run in a thread to commit to database
		ProfileDaoUtil.update(p);
		return p;
	}
	
	public static List<Profile> list(int startIndex, int numberResult){
		List<Profile> list = ProfileDaoUtil.listAllWithPagination(startIndex, numberResult);
		return list;
	}
	
	public static JsonDataTablePayload filter(DataFilter filter){
		//TODO caching
		return ProfileDaoUtil.filter(filter);
	}
	
	public static ProfileSingleDataView getSingleViewById(String id) {
		ProfileSingleDataView profile = ProfileDaoUtil.getSingleViewById(id);
		return profile;
	}
	
	public static Profile createNewCrmProfile(JsonObject paramJson, SystemUser loginUser) {
		String firstName = paramJson.getString("firstName", "");
		String lastName = paramJson.getString("lastName", "");
		String email = paramJson.getString("email", "");
		String phone = paramJson.getString("phone", "");
		String crmRefId = paramJson.getString("crmRefId", "");
		
		Profile pf = Profile.newCrmProfile(CRM_IMPORT, email, phone, crmRefId);
		pf.setFirstName(firstName);
		pf.setLastName(lastName);
		
		ProfileDaoUtil.create(pf);
		return pf;
	}
	
	
	
	public static Profile saveSocialLoginProfile(String email, String visitorId, String firstName, String lastName, String refId, String source,
			String observerId,String srcTouchpointId, String refTouchpointId, String touchpointRefDomain, String userDeviceId, int gender, Date createdAt) {
		
		Profile pf = ProfileDaoUtil.getByPrimaryEmail(email);
		boolean createNew = false;
		if(pf == null) {
			pf = Profile.newSocialLoginProfile(SOCIAL_LOGIN, visitorId, firstName, lastName, email, refId, source);
			createNew = true;
		} else {
			pf.setFirstName(firstName);
			pf.setLastName(lastName);
			pf.setSocialMediaProfile(source, refId);
			pf.addIdentityData(visitorId);
		}
		
		// session touchpoint
		pf.engageAtTouchpointId(srcTouchpointId);
		pf.updateReferrerChannel(touchpointRefDomain);
		pf.setLastObserverId(observerId);
		pf.setLastTouchpointId(srcTouchpointId);
		pf.setLastUsedDeviceId(userDeviceId);
		pf.setUsedDeviceId(userDeviceId);
		pf.setCreatedAt(createdAt);
		pf.setUpdatedAt(createdAt);
		
		// 
		pf.setGender(gender);
		
		if(createNew) {
			ProfileDaoUtil.create(pf);
		} else {
			ProfileDaoUtil.update(pf);
		}
		
		return pf;
	}
	
	/**
	 * update profile data must be an instance of ProfileSingleDataView (list -> get -> update)
	 * 
	 * @param json
	 * @return
	 */
	public static Profile updateFromJson(String json) {
		ProfileSingleDataView dataObj = new Gson().fromJson(json, ProfileSingleDataView.class);
		
		// TODO run in a thread to commit to database
		ProfileDaoUtil.update(dataObj);
		return dataObj;
	}
	
	public static boolean remove(String profileId) {
		Profile pf = ProfileDaoUtil.getById(profileId);
		// the data is not deleted, we need to remove it from valid data view, set status of object = -4
		pf.setStatus(Profile.STATUS_REMOVED);
		
		// TODO run in a thread to commit to database
		ProfileDaoUtil.update(pf);
		return pf != null;
	}
	
	public static long countTotalOfProfiles() {
		return ProfileDaoUtil.countTotalOfProfiles();
	}
	
	public static long countProfilesByQuery(ProfileQuery pq) {
		return ProfileDaoUtil.countProfilesByQuery(pq);
	}
	
	public static EventSingleDataView getLastTrackingEventForRetargeting(String visitorId) {
		Profile profile = ProfileDaoUtil.getByVisitorId(visitorId);
		if(profile != null) {
			String profileId = profile.getId();
			System.out.println(" [#Activation Trigger#] getLastTrackingEventForRetargeting Profile is found, profileId " + profileId );

			List<EventSingleDataView> events = EventDataService.getProductViewActivityFlowOfProfile(profileId, 0, 10);
			if(events.size() > 0) {
				// find the last recent product-view to get Product SKU
				return events.get(0);
			}
		} else {
			System.out.println(" [#Activation Trigger#] getLastTrackingEventForRetargeting Profile is not found for visitorId " + visitorId );
		}
		return null;
	}
	
	public static boolean updateProfileSingleDataView(ProfileSingleDataView profile, boolean isAllEventsProcessor) {
		String profileId = profile.getId();
		
		int totalLeadScore = 0;
		int satisfyScore = 0;
		int clvScore = 0;
		int cacScore = 0;
		
		if(isAllEventsProcessor) {
			// now ignore unprocessed event, reset to zero to recompute
			profile.resetEventStatistics();
			profile.resetBehavioralEvent();
			profile.resetFunnelStageTimeline();
		} else {
			totalLeadScore = profile.getTotalLeadScore();
			satisfyScore = profile.getTotalCSAT();
			clvScore = profile.getTotalCLV();
			cacScore = profile.getTotalCAC();
		}
	
		
		System.out.println("updateProfileSingleDataView " + profileId);
		
		// init to get first 100 unprocessed events of profile
		int startIndex = 0;
		int numberResult = 100;
		
		List<EventSingleDataView> events;
		if(isAllEventsProcessor) {
			events = EventDataService.getEventActivityFlowOfProfile(profileId , startIndex, numberResult);
		} else {
			events = EventDataService.getUnprocessedEventsOfProfile(profileId , startIndex, numberResult);
		}
		
		BehavioralEventMetric highestScoreMetric = null;
		
		while ( ! events.isEmpty() ) {
			for (EventSingleDataView event : events) {
				Date recoredDate = event.getCreatedAt();
				String eventName = event.getMetricName();
				
				//get metadata of event
				BehavioralEventMetric metric = FunnelDataService.getBehavioralEventMetricByName(eventName);
				
				// only event in defined funnel is processed
				if(metric != null) {
					int score = metric.getScore();
					
					if(metric.getScoreModel() == EventMetaData.LEAD_SCORING_METRIC) {
						totalLeadScore += score;
					}
					else if(metric.getScoreModel() == EventMetaData.SATISFACTION_SCORING_METRIC) {
						satisfyScore += score;
					}
					else if(metric.getScoreModel() == EventMetaData.LIFETIME_VALUE_SCORING_METRIC) {
						clvScore += score;
					}
					else if(metric.getScoreModel() == EventMetaData.ACQUISITION_SCORING_METRIC) {
						cacScore += score;
					}
					
					if(highestScoreMetric == null) {
						highestScoreMetric = metric;
					} else {
						if(score > highestScoreMetric.getScore()) {
							highestScoreMetric = metric;
						}
					}
					
					// set only valid event name from journey schema
					profile.setBehavioralEvent(eventName);
					
					DataFlowStage funnelStage = metric.getCustomerFunnelStage();
					profile.updateFunnelStageTimeline(funnelStage.getName(), recoredDate);
				}
				
				TrackingEventDao.updateProcessedState(event);
				
				// what we have, track all 
				profile.updateEventCount(eventName);
			}
			
			//loop to the end to reach all events of profile in database
			startIndex = startIndex + numberResult;
			
			//go to next page of events
			if(isAllEventsProcessor) {
				events = EventDataService.getEventActivityFlowOfProfile(profileId , startIndex, numberResult);
			} else {
				events = EventDataService.getUnprocessedEventsOfProfile(profileId , startIndex, numberResult);
			}
		}
		
		//TODO update 8 scoring model here, extend with Jupyter Notebook and Rules Engine 
		profile.setTotalLeadScore(totalLeadScore);
		profile.setTotalCSAT(satisfyScore);
		profile.setTotalCLV(clvScore);
		profile.setTotalCAC(cacScore);
		
		//TODO update funnel
		DataFlowStage customerFunnelStage = highestScoreMetric.getCustomerFunnelStage();
		profile.setFunnelStage(customerFunnelStage.getId());
		
		boolean ok = ProfileDaoUtil.update(profile) != null;
		return ok;
	}

}
