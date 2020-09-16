package leotech.cdp.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import leotech.ads.model.AdType;
import leotech.ads.model.DisplayAdData;
import leotech.cdp.dao.ProductItemDaoUtil;
import leotech.cdp.dao.singleview.EventSingleDataView;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.model.activation.Campaign;
import leotech.cdp.model.business.ProductItem;

public class CampaignDataService {

	static Map<String, ProductItem> getMapSkuToProducts() {
		List<ProductItem> items = ProductItemDaoUtil.list(0, 20);
		Map<String, ProductItem> map = new HashMap<String, ProductItem>(items.size());
		for (ProductItem productItem : items) {
			map.put(productItem.getSku(),productItem);
		}
		return map;
	}

	public static Campaign queryActiveCampaign(String touchpointId, String visitorId) {
		Campaign campaign = new Campaign("demo retargeting", Campaign.CAMPAIGN_TYPE_RETARGETING);
		
		campaign.setMapSkuToProducts(getMapSkuToProducts());
		return campaign;
	}
	public static Campaign queryActiveCampaign(String visitorId) {
		return queryActiveCampaign("", visitorId);
	}
	
	
	public static DisplayAdData getDisplayAdData(String touchpointId, String visitorId) {
		// get running remarketing campaign
		Campaign campaign = queryActiveCampaign(touchpointId, visitorId);
		
		String productSku = "1000";
		// get last action
		EventSingleDataView lastAction = ProfileDataService.getLastTrackingEventForRetargeting(visitorId);
		if(lastAction != null) {
			//FIXME remove fake SKU data later
			System.out.println(" [lastAction] " + lastAction);
			productSku = lastAction.getEventData().getOrDefault("product-sku", "1000");
		}
		
		int adType = AdType.ADTYPE_IMAGE_DISPLAY_AD;
		int width = 324;
		int height = 324;
		
		String campaignId = campaign.getId();
		ProductItem item = campaign.getProductItemBySku(productSku);
		
		String adLabel = item.getName();
		String mediaFullUrl = item.getImage();
		String clickThrough;
		if(item.getFullUrl().contains("#")) {
			clickThrough = item.getFullUrl() + "leoadscp=" + campaignId;
		} else {
			clickThrough = item.getFullUrl() + "#leoadscp=" + campaignId;
		}
		
		DisplayAdData ad = new DisplayAdData(touchpointId, mediaFullUrl , clickThrough , adLabel , campaignId , adType , width, height);
		//TODO generate becon here
		String beacon = "_demobeacon_";
		
		ad.setBeaconData(beacon );
		
		return ad;
	}
	
	public static void doMarketingAutomation(ProfileSingleDataView profile) {
		String profileId = profile.getId();
		String oneSignalPlayerId = "";
		Set<String> userIds = profile.getNotificationUserIds().getOrDefault("onesignal", new HashSet<String>());
		if( ! userIds.isEmpty()) {
			oneSignalPlayerId = userIds.iterator().next();
		}
		String toEmailAddress =  profile.getPrimaryEmail();
		String name = profile.getFirstName();
		String visitorId = profile.getVisitorId();
		
		Campaign campaign = queryActiveCampaign(visitorId);
		
		String campaignId = campaign.getId();
		String productSku = "1000";
		// get last action
		
		EventSingleDataView lastAction = ProfileDataService.getLastTrackingEventForRetargeting(visitorId);
		if(lastAction != null) {
			//FIXME remove fake SKU data later
			System.out.println(" [lastAction] " + lastAction);
			productSku = lastAction.getEventData().getOrDefault("product-sku", "1000");
		}
		ProductItem item = campaign.getProductItemBySku(productSku);
		
		String clickThrough;
		if(item.getFullUrl().contains("#")) {
			clickThrough = item.getFullUrl() + "leoadscp=" + campaignId;
		} else {
			clickThrough = item.getFullUrl() + "#leoadscp=" + campaignId;
		}
		
		String productName = item.getName();
		double price = item.getSalePrice();
		String productLink = clickThrough;// FIXME
		MarketingAutomationService.sendRecommendation(profileId, oneSignalPlayerId, toEmailAddress, name, productName, price, productLink );
	}
}
