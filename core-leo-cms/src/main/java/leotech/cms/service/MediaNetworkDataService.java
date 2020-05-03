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
import leotech.cms.model.ContentClassPostQuery;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.MediaNetworkXml;

public class MediaNetworkDataService {

    private static final String CONFIGS_MEDIA_NETWORK_CONFIGS_XML = "./configs/media-network-configs.xml";

    // TODO add shared redis cache here, load MediaNetwork from database

    public static final String ADMIN_LEO_PLATFORM = "admin.leoplatform.net";

    // default app templates
    public static final String DEFAULT_ADMIN_TEMPLATE_FOLDER = "default-admin-template";
    public static final String DEFAUFT_WEB_TEMPLATE_FOLDER = "default-web-template";

    final static MediaNetwork DEFAULT_CONTENT_NETWORK = new MediaNetwork("Genesis Network", "localhost", "localhost:9190", DEFAUFT_WEB_TEMPLATE_FOLDER);

    final static Map<String, MediaNetwork> mapHostToMediaApp = new HashMap<>();

    static {
	try {
	    JAXBContext jc = JAXBContext.newInstance(MediaNetworkXml.class);
	    Unmarshaller unmarshaller = jc.createUnmarshaller();
	    XMLInputFactory inputFactory = XMLInputFactory.newInstance();
	    XMLStreamReader reader = inputFactory.createXMLStreamReader(new FileInputStream(CONFIGS_MEDIA_NETWORK_CONFIGS_XML));
	    MediaNetworkXml mediaNetworkXml = unmarshaller.unmarshal(reader, MediaNetworkXml.class).getValue();

	    List<MediaNetwork> networks = mediaNetworkXml.getMediaNetworks();
	    for (MediaNetwork mediaNetwork : networks) {
		String host = mediaNetwork.getDomain();
		mapHostToMediaApp.put(host, mediaNetwork);
	    }

	    System.out.println(CONFIGS_MEDIA_NETWORK_CONFIGS_XML + " loaded OK with mapHostToMediaApp.size = " + mapHostToMediaApp.size());

	} catch (Exception e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    public static MediaNetwork getContentNetwork(String networkDomain) {
	MediaNetwork network = mapHostToMediaApp.get(networkDomain);
	
	if (network == null) {
	    System.err.println("NOT FOUND MediaNetwork for domain: " + networkDomain);
	    return DEFAULT_CONTENT_NETWORK; 
	}
	return network;
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

	    // Marshaller marshaller = jc.createMarshaller();
	    // marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
	    // marshaller.marshal( new MediaNetworkXml(new
	    // ArrayList<>(mapHostToMediaApp.values())), System.out);

	    Unmarshaller unmarshaller = jc.createUnmarshaller();
	    XMLInputFactory inputFactory = XMLInputFactory.newInstance();
	    XMLStreamReader reader = inputFactory.createXMLStreamReader(new FileInputStream(CONFIGS_MEDIA_NETWORK_CONFIGS_XML));
	    MediaNetworkXml mediaNetworkXml = unmarshaller.unmarshal(reader, MediaNetworkXml.class).getValue();

	    System.out.println(mediaNetworkXml.getMediaNetworks().get(0));

	} catch (Exception e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

}
