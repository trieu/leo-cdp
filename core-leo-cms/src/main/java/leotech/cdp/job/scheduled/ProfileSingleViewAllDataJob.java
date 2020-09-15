package leotech.cdp.job.scheduled;

import java.util.List;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.service.ProfileDataService;
import rfx.core.job.ScheduledJob;
import rfx.core.util.Utils;

public class ProfileSingleViewAllDataJob  extends ScheduledJob {

	
	@Override
	public void doTheJob() {
		
		int startIndex = 0;
		int numberResult = 100;
		
		List<ProfileSingleDataView> profiles = ProfileDaoUtil.listSingleViewAllWithPagination(startIndex, numberResult);
		while ( ! profiles.isEmpty() ) {
			for (ProfileSingleDataView profile : profiles) {
				ProfileDataService.updateProfileSingleDataView(profile, true);
			}
			
			//loop to the end of database
			startIndex = startIndex + numberResult;
			profiles = ProfileDaoUtil.listSingleViewAllWithPagination(startIndex, numberResult);
		}
	}
	
	public static void main(String[] args) {
		new ProfileSingleViewAllDataJob().doTheJob();
		Utils.exitSystemAfterTimeout(5000);
	}

}
