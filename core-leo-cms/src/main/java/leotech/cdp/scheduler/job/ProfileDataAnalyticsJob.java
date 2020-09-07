package leotech.cdp.scheduler.job;

import java.util.List;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.dao.singleview.EventSingleDataView;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.service.EventTrackingService;
import rfx.core.job.ScheduledJob;
import rfx.core.util.Utils;

public class ProfileDataAnalyticsJob  extends ScheduledJob {

	@Override
	public void doTheJob() {
		
		int startIndex = 0;
		int numberResult = 100;
		
		List<ProfileSingleDataView> profiles = ProfileDaoUtil.listSingleViewAllWithPagination(startIndex, numberResult);
		while ( ! profiles.isEmpty() ) {
			for (ProfileSingleDataView profile : profiles) {
				updateStatistics(profile);
			}
			
			startIndex = startIndex + numberResult;
			profiles = ProfileDaoUtil.listSingleViewAllWithPagination(startIndex, numberResult);
		}
	}
	
	static final void updateStatistics(ProfileSingleDataView profile) {
		String profileId = profile.getId();
		System.out.println("updateStatistics ProfileSingleDataView " + profileId);
		
		int startIndex = 0;
		int numberResult = 200;
		
		List<EventSingleDataView> events = EventTrackingService.getEventActivityFlowOfProfile(profileId , startIndex, numberResult);
		while ( ! events.isEmpty() ) {
			for (EventSingleDataView event : events) {
				String name = event.getMetricName();
				profile.setBehavioralEvent(name);
				profile.updateEventCount(name);
			}
			startIndex = startIndex + numberResult;
			events = EventTrackingService.getEventActivityFlowOfProfile(profileId , startIndex, numberResult);
		}
		
		ProfileDaoUtil.update(profile);
	}
	
	public static void main(String[] args) {
		new ProfileDataAnalyticsJob().doTheJob();
		Utils.exitSystemAfterTimeout(5000);
	}

}
