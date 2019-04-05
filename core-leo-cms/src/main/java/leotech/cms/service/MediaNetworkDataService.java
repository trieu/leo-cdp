package leotech.cms.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.vertx.core.json.JsonObject;
import leotech.cms.model.MediaNetwork;

public class MediaNetworkDataService {

    // TODO add shared redis cache here, load MediaNetwork from database

    public static final String ADMIN_LEOCLOUDCMS_COM = "admin.leocloudcms.com";

    public static final String COM_LEOCLOUDCMS = "com.leocloudcms";

    // default app templates
    public static final String DEFAULT_ADMIN_TEMPLATE_FOLDER = "default-admin-template";
    public static final String DEFAUFT_WEB_TEMPLATE_FOLDER = "default-web-template";

    final static MediaNetwork DEFAULT_CONTENT_NETWORK = new MediaNetwork("Genesis Network", "leocloudcms", "leocloudcms.com", DEFAUFT_WEB_TEMPLATE_FOLDER);

    final static Map<String, MediaNetwork> mapHostToAppId = new HashMap<>();

    static {
	// TODO load from database

	// admin CMS apps
	mapHostToAppId.put(ADMIN_LEOCLOUDCMS_COM, new MediaNetwork("Leo CMS Admin", "admin", ADMIN_LEOCLOUDCMS_COM, DEFAULT_ADMIN_TEMPLATE_FOLDER));
	mapHostToAppId.put("bluescope.leocloudcms.com", new MediaNetwork("Bluescope Admin", "admin", "bluescope.leocloudcms.com", DEFAULT_ADMIN_TEMPLATE_FOLDER));
	mapHostToAppId.put("blueseed.leocloudcms.com", new MediaNetwork("Blueseed Admin", "admin", "blueseed.leocloudcms.com", DEFAULT_ADMIN_TEMPLATE_FOLDER));
	mapHostToAppId.put("dsp.hadarone.com", new MediaNetwork("Admin", "admin", "dsp.hadarone.com", "hadarone-dsp"));

	// public web apps
	mapHostToAppId.put("leocloudcms.com", new MediaNetwork("LeoCloudCMS", "leocloudcms", "leocloudcms.com", DEFAUFT_WEB_TEMPLATE_FOLDER));
	mapHostToAppId.put("video.monngon.tv", new MediaNetwork("MonNgon.TV", "monngon", "video.monngon.tv", "monngon"));
	mapHostToAppId.put("xemgiday.com", new MediaNetwork("XemGiDay.com", "xemgiday", "xemgiday.com", "xemgiday"));
    }

    public static MediaNetwork getContentNetwork(String networkDomain) {
	return mapHostToAppId.getOrDefault(networkDomain, DEFAULT_CONTENT_NETWORK);
    }

    public static String getWebTemplateFolder(String networkDomain) {
	MediaNetwork network = getContentNetwork(networkDomain);
	return network.getWebTemplateFolder();
    }

    public static List<MediaNetwork> listAll() {
	List<MediaNetwork> list = null;

	return list;
    }

    public static MediaNetwork getByKey(String key) {
	return null;
    }

    public static String save(JsonObject paramJson, boolean createNew) {
	return "";
    }
    
    public static String deleteByKey(String key) {
	return "";
    }

}
