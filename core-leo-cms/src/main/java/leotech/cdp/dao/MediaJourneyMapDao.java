package leotech.cdp.dao;

import java.util.HashMap;
import java.util.Map;

import com.google.common.collect.ImmutableMap;

import leotech.cdp.model.marketing.MediaChannel;
import leotech.cdp.model.marketing.MediaChannelType;
import leotech.cdp.model.marketing.MediaJourneyMap;

public class MediaJourneyMapDao {

	public static MediaJourneyMap getDefaultMap() {
		
		MediaChannel google = new MediaChannel("Google", MediaChannelType.WEBSITE, false, "https://google.com");
		MediaChannel facebook = new MediaChannel("Facebook Page", MediaChannelType.SOCIAL_MEDIA_PLATFORM, false, "https://www.facebook.com/");
		MediaChannel emailMarketing = new MediaChannel("Email Marketing", MediaChannelType.EMAIl_CONTACT, true, "mailto:");
		MediaChannel bookVideoHub = new MediaChannel("Book Review Video Hub", MediaChannelType.WEBSITE, true, "https://bookstore.bigdatavietnam.org/");
		MediaChannel bookEcommerce = new MediaChannel("Book E-commerce", MediaChannelType.ECOMMERCE_PLATFORM, true, "http://demo.ecommerce.com/");
		
		Map<MediaChannel,Integer> mediaChannels = new HashMap<>();
		mediaChannels.put(google,0);
		mediaChannels.put(facebook,1 );
		mediaChannels.put(emailMarketing, 2);
		mediaChannels.put(bookVideoHub, 3);
		mediaChannels.put(bookEcommerce, 4);
		
		
		Map<String,String> journeyStageMetrics = ImmutableMap.of("Book E-commerce", "Buy");
		MediaJourneyMap map = new MediaJourneyMap(mediaChannels, journeyStageMetrics);
		map.addJourneyLink(google, bookVideoHub , 1);
		map.addJourneyLink(google, bookEcommerce, 1);
		map.addJourneyLink(facebook, bookVideoHub, 1);
		map.addJourneyLink(facebook, bookEcommerce, 1);
		map.addJourneyLink(bookVideoHub, bookEcommerce, 1);
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
