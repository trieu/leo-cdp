package leotech.cdp.dao;

import java.util.HashMap;
import java.util.Map;

import com.google.common.collect.ImmutableMap;

import leotech.cdp.model.journey.MediaChannel;
import leotech.cdp.model.journey.MediaChannelType;
import leotech.cdp.model.journey.MediaJourneyMap;

public class MediaJourneyMapDao extends AbstractCdpDatabaseUtil {

	public static MediaJourneyMap getDefaultMap() {
		
		MediaChannel google = new MediaChannel("Google - Search Engine", MediaChannelType.SEARCH_ENGINE, false, "https://google.com");
		MediaChannel facebook = new MediaChannel("Facebook - Social Media", MediaChannelType.SOCIAL_MEDIA_PLATFORM, false, "https://www.facebook.com/");
		MediaChannel affiliate = new MediaChannel("Affiliate Marketing Website", MediaChannelType.WEB_URL, true, "http://xemgiday.com/");
		MediaChannel emailMarketing = new MediaChannel("Email Marketing", MediaChannelType.EMAIl_CONTACT, false, "mailto:support@bigdatavietnam.org");
		MediaChannel videoHub = new MediaChannel("Content Video Hub", MediaChannelType.UNIFIED_CONTENT_HUB, true, "https://bookstore.bigdatavietnam.org/");
		MediaChannel ecommerce = new MediaChannel("Demo Bookshop", MediaChannelType.ECOMMERCE_PLATFORM, true, "http://demobookshop.leocdp.com/");
		MediaChannel retailStore = new MediaChannel("Book Retail Store", MediaChannelType.RETAIL_STORE, true, "https://plus.codes/7P28QPF3+JJ");
		
		Map<String,MediaChannel> mediaChannelMap = new HashMap<>();
		mediaChannelMap.put(google.getName(), google);
		mediaChannelMap.put(facebook.getName(), facebook);
		mediaChannelMap.put(affiliate.getName(), affiliate);
		mediaChannelMap.put(emailMarketing.getName(), emailMarketing);
		mediaChannelMap.put(videoHub.getName(), videoHub);
		mediaChannelMap.put(ecommerce.getName(), ecommerce);
		mediaChannelMap.put(retailStore.getName(), retailStore);
		
		Map<String,Integer> mediaChannelIndex = new HashMap<>();
		mediaChannelIndex.put(google.getName(),0);
		mediaChannelIndex.put(facebook.getName(),1 );
		mediaChannelIndex.put(affiliate.getName(),2 );
		mediaChannelIndex.put(emailMarketing.getName(), 3);
		mediaChannelIndex.put(videoHub.getName(), 4);
		mediaChannelIndex.put(ecommerce.getName(), 5);
		mediaChannelIndex.put(retailStore.getName(), 6);
		
		Map<String,String> journeyStageMetrics = ImmutableMap.of("E-commerce", "Buy");
		MediaJourneyMap map = new MediaJourneyMap(mediaChannelMap, mediaChannelIndex, journeyStageMetrics);
		map.addJourneyLink(google, videoHub , 1);
		map.addJourneyLink(google, ecommerce, 1);
		map.addJourneyLink(affiliate, ecommerce, 1);
		map.addJourneyLink(affiliate, videoHub, 1);
		map.addJourneyLink(facebook, videoHub, 1);
		map.addJourneyLink(facebook, ecommerce, 1);
		map.addJourneyLink(videoHub, ecommerce, 1);
		map.addJourneyLink(videoHub, emailMarketing, 1);
		map.addJourneyLink(emailMarketing, ecommerce, 1);
		map.addJourneyLink(emailMarketing, retailStore, 1);
		map.addJourneyLink(videoHub, retailStore, 1);
		
		return map;
	}
	
	public static MediaJourneyMap get(String id) {
		// TODO
		return getDefaultMap();
	}
	
	public static void main(String[] args) {
		System.out.println(getDefaultMap());
	}
}
