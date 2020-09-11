package leotech.ads.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import leotech.ads.model.DisplayAdData;
import leotech.ads.model.LineItem;
import rfx.core.util.StringUtil;

public class AdsQueryService {

	
	public static List<DisplayAdData> getAds(List<String> pmIds){
		System.out.println(pmIds);
		List<DisplayAdData> ads = new ArrayList<>(pmIds.size());
		
		for (String pmId : pmIds) {
			int placementId = StringUtil.safeParseInt(pmId);
			String mediaFullUrl = "https://demobookshop.leocdp.com/wp-content/uploads/2020/09/61nPOhbc1JL-324x324.jpg";
			String clickThrough = "https://demobookshop.leocdp.com/product/smart-cities-introducing-digital-innovation-to-cities/";
			String des = "Smart Cities: Introducing Digital Innovation to Cities";
			int adType = LineItem.ADTYPE_IMAGE_DISPLAY_AD;
			int lineItemId = 10000;
			int width = 324;
			int height = 324;
			DisplayAdData ad = new DisplayAdData(placementId, mediaFullUrl , clickThrough , des , lineItemId , adType , width, height);
			String beacon = "12345";
			ad.setBeaconData(beacon );
			
			ads.add(ad);
		}
		System.out.println(ads);
		return ads;
	}
}
