package test.cdp;

import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.service.CampaignDataService;
import leotech.cdp.service.ProfileDataService;

public class TestMarketingAuto {

	public static void main(String[] args) {
		ProfileSingleDataView profile = ProfileDataService.getSingleViewById("3yxWoLJV4KyQ7Gz5YtxesH");
		CampaignDataService.doMarketingAutomation(profile );
	}
}
