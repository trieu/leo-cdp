package test.cdp;

import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.service.CampaignDataService;
import leotech.cdp.service.ProfileDataService;

public class TestMarketingAuto {

	public static void main(String[] args) {
		ProfileSingleDataView profile = ProfileDataService.getSingleViewById("4LI2peQtHoFFYmDisGT1cT");
		CampaignDataService.doMarketingAutomation(profile );
	}
}
