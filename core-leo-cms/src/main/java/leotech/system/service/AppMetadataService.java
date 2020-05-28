package leotech.system.service;

import java.io.FileInputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamReader;

import io.vertx.core.json.JsonObject;
import leotech.system.model.AppMetadata;
import leotech.system.model.AppMetadataXml;

public class AppMetadataService {

	private static final String CONFIGS_XML = "./configs/app-metadata-configs.xml";

	// TODO add shared redis cache here, load MediaNetwork from database

	public static final String ADMIN_LEO_PLATFORM = "admin.leocdp.com";

	// default app templates
	public static final String DEFAULT_ADMIN_TEMPLATE_FOLDER = "leocdp-admin";
	public static final String DEFAUFT_WEB_TEMPLATE_FOLDER = "default-web-template";

	final static AppMetadata DEFAULT_CONTENT_NETWORK = new AppMetadata("Genesis Network", "localhost",
			"localhost:9190", DEFAUFT_WEB_TEMPLATE_FOLDER);

	final static Map<String, AppMetadata> mapHost2App = new HashMap<>();

	static {
		try {
			JAXBContext jc = JAXBContext.newInstance(AppMetadataXml.class);
			Unmarshaller unmarshaller = jc.createUnmarshaller();
			XMLInputFactory inputFactory = XMLInputFactory.newInstance();
			XMLStreamReader reader = inputFactory
					.createXMLStreamReader(new FileInputStream(CONFIGS_XML));
			AppMetadataXml mediaNetworkXml = unmarshaller.unmarshal(reader, AppMetadataXml.class).getValue();

			List<AppMetadata> apps = mediaNetworkXml.getAppMetadata();
			for (AppMetadata app : apps) {
				String host = app.getDomain();
				mapHost2App.put(host, app);
			}

			System.out.println(CONFIGS_XML + " loaded OK with mapHostToMediaApp.size = "
					+ mapHost2App.size());

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static AppMetadata getContentNetwork(String networkDomain) {
		AppMetadata network = mapHost2App.get(networkDomain);

		if (network == null) {
			System.err.println("NOT FOUND MediaNetwork for domain: " + networkDomain);
			return DEFAULT_CONTENT_NETWORK;
		}
		return network;
	}

	public static String getWebTemplateFolder(String networkDomain) {
		AppMetadata network = getContentNetwork(networkDomain);
		return network.getWebTemplateFolder();
	}

	public static List<AppMetadata> listAll() {
		List<AppMetadata> list = null;

		return list;
	}

	public static AppMetadata getByKey(String key) {
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

			JAXBContext jc = JAXBContext.newInstance(AppMetadataXml.class);

			// Marshaller marshaller = jc.createMarshaller();
			// marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			// marshaller.marshal( new MediaNetworkXml(new
			// ArrayList<>(mapHostToMediaApp.values())), System.out);

			Unmarshaller unmarshaller = jc.createUnmarshaller();
			XMLInputFactory inputFactory = XMLInputFactory.newInstance();
			XMLStreamReader reader = inputFactory
					.createXMLStreamReader(new FileInputStream(CONFIGS_XML));
			AppMetadataXml mediaNetworkXml = unmarshaller.unmarshal(reader, AppMetadataXml.class).getValue();

			System.out.println(mediaNetworkXml.getAppMetadata().get(0));

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
