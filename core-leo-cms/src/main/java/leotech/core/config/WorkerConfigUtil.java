package leotech.core.config;

import leotech.system.util.RandomCollection;
import rfx.core.configs.WorkerConfigs;


public class WorkerConfigUtil {
    //
    public static final String HTTPS = "https://";
    public static final String HTTP = "http://";
    public static final WorkerConfigs WORKER_CONFIGS = WorkerConfigs.load();
   
    static RandomCollection<String> deliveryUrls = new RandomCollection<String>();
    static RandomCollection<String> logUrls = new RandomCollection<String>();

    static {
//	deliveryUrls.add(1, D1_URL);
//	deliveryUrls.add(1, D2_URL);
//
//	logUrls.add(1, log1FullUrl);
//	logUrls.add(1, log2FullUrl);
    }

    public static String getDeliveryUrl() {
	return deliveryUrls.next();
    }

    public static String getLogUrl(boolean isSSL) {
	if (isSSL) {
	    return HTTPS + logUrls.next();
	}
	return HTTP + logUrls.next();
    }

}
