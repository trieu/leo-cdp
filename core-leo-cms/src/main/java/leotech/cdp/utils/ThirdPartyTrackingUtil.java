package leotech.cdp.utils;

import java.util.concurrent.atomic.AtomicBoolean;

import com.brsanthu.googleanalytics.GoogleAnalytics;
import com.brsanthu.googleanalytics.GoogleAnalyticsConfig;

import rfx.core.configs.WorkerConfigs;

public class ThirdPartyTrackingUtil {

    private static final String GOOGLE_ANALYTICS_TRACKING_ID = WorkerConfigs.load().getCustomConfig("GOOGLE_ANALYTICS_TRACKING_ID");
    static final int BATCH_SIZE = 5;
    static final boolean BATCH_ENABLED = false;
    static GoogleAnalytics ga = null;
    static final AtomicBoolean enableTracking = new AtomicBoolean(false);

    static GoogleAnalytics gaInstance() {
	if (ga == null) {
	    ga = GoogleAnalytics.builder().withConfig(new GoogleAnalyticsConfig().setBatchingEnabled(BATCH_ENABLED)
		    .setBatchSize(BATCH_SIZE)).withTrackingId(GOOGLE_ANALYTICS_TRACKING_ID).build();
	}
	return ga;
    }

    public static void contentView(String title, String uri, String userId, String userIp, String userAgent) {
	if(enableTracking.get()) {
	    gaInstance().pageView().documentTitle(title).documentPath(uri).clientId(userId).userIp(userIp).userAgent(userAgent).send();
	}
	
    }

    public static void event(String category, String action, String title, String uri, String userId, String userIp, String userAgent) {
	if(enableTracking.get()) {
	    gaInstance().event().eventCategory(category).eventAction(action).eventLabel(title).documentTitle(title).documentPath(uri)
	    .clientId(userId).userIp(userIp).userAgent(userAgent).send();
	}	
    }
}
