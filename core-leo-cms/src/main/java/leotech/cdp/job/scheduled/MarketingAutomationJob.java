package leotech.cdp.job.scheduled;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.service.CampaignDataService;
import leotech.cdp.service.SegmentDataService;
import rfx.core.job.ScheduledJob;
import rfx.core.util.Utils;

public class MarketingAutomationJob extends ScheduledJob {
	
	static ExecutorService executorSendToProfile = Executors.newSingleThreadExecutor();

	@Override
	public void doTheJob() {
		String segmentId = "3OEhfuYGhQBSAPcaeYRmAN";
		List<ProfileSingleDataView> profiles = SegmentDataService.getProfilesInSegment(segmentId , 0, 100);
		for (ProfileSingleDataView profile : profiles) {
			System.out.println(" load data for MarketingAutomationJob id:" + profile.getId() + " email " + profile.getPrimaryEmail());
			sendToProfile(profile);
		}
	}

	void sendToProfile(ProfileSingleDataView profile) {
		try {
			Map<String, Long> eventStatistics = profile.getEventStatistics();
			boolean triggerPush = eventStatistics.getOrDefault("submit-contact", 0L) > 0 && eventStatistics.getOrDefault("product-view", 0L) > 1;
			if(triggerPush) {
				System.out.println("doMarketingAutomation.profile.getPrimaryEmail() " + profile.getId() + " email " + profile.getPrimaryEmail());
				
				executorSendToProfile.submit(() -> {
					CampaignDataService.doMarketingAutomation(profile);
				});
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) {
		new MarketingAutomationJob().doTheJob();
		
		Utils.exitSystemAfterTimeout(1200000);
	}
}
