package leotech.ads.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import leotech.ads.model.AdType;
import leotech.ads.model.DisplayAdData;
import leotech.cdp.dao.ProductItemDaoUtil;
import leotech.cdp.dao.singleview.EventSingleDataView;
import leotech.cdp.model.activation.Campaign;
import leotech.cdp.model.business.ProductItem;
import leotech.cdp.service.ProfileDataService;
import leotech.cdp.service.TouchpointDataService;

public class AdsQueryService {
	
	static Map<String, ProductItem> getMapSkuToProducts() {
		List<ProductItem> items = ProductItemDaoUtil.list(0, 20);
		
		Map<String, ProductItem> map = new HashMap<String, ProductItem>(items.size());
		for (ProductItem productItem : items) {
			map.put(productItem.getSku(),productItem);
		}
		
		return map;
	}

	static Campaign queryActiveCampaign(String placementId, String visitorId, String srcTouchpointId) {
		Campaign campaign = new Campaign("demo retargeting", Campaign.CAMPAIGN_TYPE_RETARGETING);
		
		campaign.setMapSkuToProducts(getMapSkuToProducts());
		return campaign;
	}
	
	static DisplayAdData getDisplayAdData(String placementId, String visitorId, String srcTouchpointId) {
		
		// get running retargeting campaign
		Campaign campaign = queryActiveCampaign(placementId, visitorId, srcTouchpointId);
		
		
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
		
		DisplayAdData ad = new DisplayAdData(placementId, mediaFullUrl , clickThrough , adLabel , campaignId , adType , width, height);
		//TODO generate becon here
		String beacon = "_demobeacon_";
		
		ad.setBeaconData(beacon );
		
		return ad;
	}
	
	
	public static List<DisplayAdData> getAds(List<String> pmIds, String visitorId, String srcTouchpointUrl){
		
		List<DisplayAdData> ads = new ArrayList<>(pmIds.size());
		
		//TODO generate srcTouchpointId
		String srcTouchpointId = "";
		
		for (String placementId : pmIds) {
			DisplayAdData ad = getDisplayAdData(placementId, visitorId, srcTouchpointId);
			ads.add(ad);
		}
		
		return ads;
	}
}
