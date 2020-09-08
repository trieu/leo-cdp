package leotech.cdp.scheduler.job;

import java.util.List;
import java.util.Set;

import leotech.cdp.dao.BehavioralEventMetricDao;
import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.dao.TrackingEventDaoUtil;
import leotech.cdp.dao.singleview.EventSingleDataView;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.model.journey.BehavioralEventMetric;
import leotech.cdp.model.journey.EventMetric;
import leotech.cdp.service.EventTrackingService;
import rfx.core.job.ScheduledJob;
import rfx.core.util.Utils;

public class ProfileScoringJob  extends ScheduledJob {

	
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
		
		//Set<String> funnelMetrics = profile.getFunnelMetrics();
		
		System.out.println("updateStatistics ProfileSingleDataView " + profileId);
		
		int startIndex = 0;
		int numberResult = 200;
		
		List<EventSingleDataView> events = EventTrackingService.getEventActivityFlowOfProfile(profileId , startIndex, numberResult);
		BehavioralEventMetric highestScoreMetric = null;
		
		
		while ( ! events.isEmpty() ) {
			for (EventSingleDataView event : events) {
				String eventName = event.getMetricName();
				profile.setBehavioralEvent(eventName);
				profile.updateEventCount(eventName);
				
				BehavioralEventMetric metric = BehavioralEventMetricDao.getBehavioralEventMetricByName(eventName);
				if(metric != null) {
					int score = metric.getScore();
					
					if(metric.getScoreModel() == EventMetric.LEAD_SCORING_METRIC) {
						totalLeadScore += score;
					}
					else if(metric.getScoreModel() == EventMetric.SATISFACTION_SCORING_METRIC) {
						satisfyScore += score;
					}
					
					if(highestScoreMetric == null) {
						highestScoreMetric = metric;
					} else {
						if(score > highestScoreMetric.getScore()) {
							highestScoreMetric = metric;
						}
					}
					
				}
				TrackingEventDaoUtil.updateProcessedState(event);
			}
			
			//loop to the end of database
			startIndex = startIndex + numberResult;
			events = EventTrackingService.getEventActivityFlowOfProfile(profileId , startIndex, numberResult);
		}
		
		//update scoring
		profile.setTotalLeadScore(totalLeadScore);
		profile.setTotalCSAT(satisfyScore);
		
		//TODO update funnel
		profile.setFunnelStage(highestScoreMetric.getCustomerFunnelStageId());
		//profile.setFunnelMetrics(funnelMetrics);
		
		ProfileDaoUtil.update(profile);
	}
	
	public static void main(String[] args) {
		new ProfileScoringJob().doTheJob();
		Utils.exitSystemAfterTimeout(5000);
	}

}
