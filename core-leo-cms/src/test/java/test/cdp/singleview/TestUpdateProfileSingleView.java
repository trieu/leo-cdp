package test.cdp.singleview;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.job.reactive.JobUpdateProfileSingleView;
import rfx.core.util.Utils;

public class TestUpdateProfileSingleView {

	public static void main(String[] args) {
		String profileId = "7ivU9rTJQjhJlLeqiMzlaj";
		
		ProfileSingleDataView profile = ProfileDaoUtil.getSingleViewById(profileId);
		if(profile != null) {
			JobUpdateProfileSingleView.job().enque(profile);
		}
		else {
			System.err.println("Not found!");
		}
		Utils.exitSystemAfterTimeout(200000);
	}
}
