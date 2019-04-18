package leotech.cms.service;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamReader;

import io.vertx.core.json.JsonObject;
import leotech.cms.model.AdsPlacement;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.MediaNetworkXml;

public class MediaNetworkDataService {

    // TODO add shared redis cache here, load MediaNetwork from database

    public static final String ADMIN_LEOCLOUDCMS_COM = "admin.leocloudcms.com";

    public static final String COM_LEOCLOUDCMS = "com.leocloudcms";

    // default app templates
    public static final String DEFAULT_ADMIN_TEMPLATE_FOLDER = "default-admin-template";
    public static final String DEFAUFT_WEB_TEMPLATE_FOLDER = "default-web-template";

    final static MediaNetwork DEFAULT_CONTENT_NETWORK = new MediaNetwork("Genesis Network", "leocloudcms", "leocloudcms.com", DEFAUFT_WEB_TEMPLATE_FOLDER);

    final static Map<String, MediaNetwork> mapHostToMediaApp = new HashMap<>();

    static {
	// TODO load from database

	// admin CMS apps
	mapHostToMediaApp.put(ADMIN_LEOCLOUDCMS_COM, new MediaNetwork("Leo CMS Admin", "admin", ADMIN_LEOCLOUDCMS_COM, DEFAULT_ADMIN_TEMPLATE_FOLDER));
	mapHostToMediaApp.put("bluescope.leocloudcms.com", new MediaNetwork("Bluescope Admin", "admin", "bluescope.leocloudcms.com", DEFAULT_ADMIN_TEMPLATE_FOLDER));
	mapHostToMediaApp.put("blueseed.leocloudcms.com", new MediaNetwork("Blueseed Admin", "admin", "blueseed.leocloudcms.com", DEFAULT_ADMIN_TEMPLATE_FOLDER));

	// public web apps
	mapHostToMediaApp.put("leocloudcms.com", new MediaNetwork("LeoCloudCMS", "leocloudcms", "leocloudcms.com", DEFAUFT_WEB_TEMPLATE_FOLDER));
	mapHostToMediaApp.put("video.monngon.tv", new MediaNetwork("MonNgon.TV", "monngon", "video.monngon.tv", "monngon"));

	MediaNetwork mediaNetwork = new MediaNetwork("XemGiDay.com", "xemgiday", "xemgiday.com", "xemgiday");
	mediaNetwork.setAdsPlacements(Arrays.asList(new AdsPlacement("1", "aaa", false),new AdsPlacement("2", "bbb", true)));

	mapHostToMediaApp.put("xemgiday.com", mediaNetwork);
    }

    public static MediaNetwork getContentNetwork(String networkDomain) {
	return mapHostToMediaApp.getOrDefault(networkDomain, DEFAULT_CONTENT_NETWORK);
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

    public static void main(String[] args) {
	try {
	        	    
	    JAXBContext jc = JAXBContext.newInstance(MediaNetworkXml.class);
	   
	    Marshaller marshaller = jc.createMarshaller();
	    marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
	    marshaller.marshal( new MediaNetworkXml(new ArrayList<>(mapHostToMediaApp.values())), System.out);
	    
//	    Unmarshaller unmarshaller = jc.createUnmarshaller();
//	    XMLInputFactory inputFactory = XMLInputFactory.newInstance();
//	    XMLStreamReader reader = inputFactory.createXMLStreamReader(new FileInputStream("./configs/media-network-configs.xml"));
//	    MediaNetworkXml mediaNetworkXml = unmarshaller.unmarshal(reader, MediaNetworkXml.class).getValue();
//	    
//	    System.out.println(mediaNetworkXml.getMediaNetworks().get(0).getAdsPlacements().size());

	} catch (Exception e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

}
