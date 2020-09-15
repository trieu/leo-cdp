package leotech.cdp.job.scheduled;

import java.util.Date;
import java.util.List;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.dao.TrackingEventDao;
import leotech.cdp.dao.singleview.EventSingleDataView;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.model.journey.BehavioralEventMetric;
import leotech.cdp.model.journey.EventMetaData;
import leotech.cdp.model.journey.DataFlowStage;
import leotech.cdp.service.EventDataService;
import leotech.cdp.service.FunnelDataService;
import rfx.core.job.ScheduledJob;
import rfx.core.util.Utils;

public class ProfileSingleViewDataJob  extends ScheduledJob {

	
	@Override
	public void doTheJob() {
		
		int startIndex = 0;
		int numberResult = 100;
		
		List<ProfileSingleDataView> profiles = ProfileDaoUtil.listSingleViewAllWithPagination(startIndex, numberResult);
		while ( ! profiles.isEmpty() ) {
			for (ProfileSingleDataView profile : profiles) {
				updateStatistics(profile);
			}
			
			//loop to the end of database
			startIndex = startIndex + numberResult;
			profiles = ProfileDaoUtil.listSingleViewAllWithPagination(startIndex, numberResult);
		}
	}
	
	static final void updateStatistics(ProfileSingleDataView profile) {
		String profileId = profile.getId();
		
		int totalLeadScore = 0;//profile.getTotalLeadScore();
		int satisfyScore = 0;//profile.getTotalCSAT();
		int clvScore = 0;
		int cacScore = 0;
		
		profile.resetEventStatistics();
		profile.resetBehavioralEvent();
		profile.resetFunnelStageTimeline();
		
		System.out.println("updateStatistics ProfileSingleDataView " + profileId);
		
		int startIndex = 0;
		int numberResult = 200;
		
		// init to get first 100 events of profile
		List<EventSingleDataView> events = EventDataService.getEventActivityFlowOfProfile(profileId , startIndex, numberResult);
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
			events = EventDataService.getEventActivityFlowOfProfile(profileId , startIndex, numberResult);
		}
		
		//TODO update 8 scoring model here, extend with Jupyter Notebook and Rules Engine 
		profile.setTotalLeadScore(totalLeadScore);
		profile.setTotalCSAT(satisfyScore);
		profile.setTotalCLV(clvScore);
		profile.setTotalCAC(cacScore);
		
		//TODO update funnel
		DataFlowStage customerFunnelStage = highestScoreMetric.getCustomerFunnelStage();
		profile.setFunnelStage(customerFunnelStage.getId());
		//profile.setFunnelMetrics(funnelMetrics);
		
		ProfileDaoUtil.update(profile);
	}
	
	public static void main(String[] args) {
		new ProfileSingleViewDataJob().doTheJob();
		Utils.exitSystemAfterTimeout(5000);
	}

}
