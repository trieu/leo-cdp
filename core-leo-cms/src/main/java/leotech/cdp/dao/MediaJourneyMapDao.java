package leotech.cdp.dao;

import java.util.HashMap;
import java.util.Map;

import com.google.common.collect.ImmutableMap;

import leotech.cdp.model.marketing.MediaChannel;
import leotech.cdp.model.marketing.MediaChannelType;
import leotech.cdp.model.marketing.MediaJourneyMap;

public class MediaJourneyMapDao {

	public static MediaJourneyMap getDefaultMap() {
		
		MediaChannel google = new MediaChannel("Google - Search Engine", MediaChannelType.WEBSITE, false, "https://google.com");
		MediaChannel facebook = new MediaChannel("Facebook - Social Media", MediaChannelType.SOCIAL_MEDIA_PLATFORM, false, "https://www.facebook.com/");
		MediaChannel affiliate = new MediaChannel("Affiliate Marketing", MediaChannelType.WEB_URL, false, "http://xemgiday.com/");
		MediaChannel emailMarketing = new MediaChannel("Email Marketing", MediaChannelType.EMAIl_CONTACT, true, "mailto:support@bigdatavietnam.org");
		MediaChannel videoHub = new MediaChannel("Video Content Hub", MediaChannelType.WEBSITE, true, "https://bookstore.bigdatavietnam.org/");
		MediaChannel ecommerce = new MediaChannel("E-commerce", MediaChannelType.ECOMMERCE_PLATFORM, true, "http://demo.ecommerce.com/");
		
		Map<MediaChannel,Integer> mediaChannels = new HashMap<>();
		mediaChannels.put(google,0);
		mediaChannels.put(facebook,1 );
		mediaChannels.put(affiliate,2 );
		mediaChannels.put(emailMarketing, 3);
		mediaChannels.put(videoHub, 4);
		mediaChannels.put(ecommerce, 5);
		
		Map<String,String> journeyStageMetrics = ImmutableMap.of("E-commerce", "Buy");
		MediaJourneyMap map = new MediaJourneyMap(mediaChannels, journeyStageMetrics);
		map.addJourneyLink(google, videoHub , 1);
		map.addJourneyLink(google, ecommerce, 1);
		map.addJourneyLink(affiliate, ecommerce, 1);
		map.addJourneyLink(affiliate, videoHub, 1);
		map.addJourneyLink(facebook, videoHub, 1);
		map.addJourneyLink(facebook, ecommerce, 1);
		map.addJourneyLink(videoHub, ecommerce, 1);
		map.addJourneyLink(videoHub, emailMarketing, 1);
		map.addJourneyLink(emailMarketing, ecommerce, 1);
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
