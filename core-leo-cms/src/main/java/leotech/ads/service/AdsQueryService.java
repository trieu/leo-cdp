package leotech.ads.service;

import java.util.ArrayList;
import java.util.List;

import leotech.ads.model.DisplayAdData;
import leotech.cdp.service.CampaignDataService;

public class AdsQueryService {
	
	public static List<DisplayAdData> getAds(List<String> touchpointIds, String visitorId, String srcTouchpointUrl){
		
		List<DisplayAdData> ads = new ArrayList<>(touchpointIds.size());
		
		//TODO generate srcTouchpointId
		String srcTouchpointId = "";
		
		for (String touchpointId : touchpointIds) {
			DisplayAdData ad = CampaignDataService.getDisplayAdData(touchpointId, visitorId, srcTouchpointId);
			ads.add(ad);
		}
		
		return ads;
	}
}
