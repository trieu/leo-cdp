package test.cdp;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.RandomStringUtils;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import com.google.openlocationcode.OpenLocationCode;

import leotech.cdp.model.customer.Profile;
import leotech.cdp.service.ProfileDataService;
import leotech.system.model.DeviceInfo;
import leotech.system.util.DeviceInfoUtil;
import rfx.core.util.FileUtils;

public class GenerateCdpTestData {
	
	static Map<String, Boolean> mapMediaDomain = new HashMap<String, Boolean>();
	
	static {
		mapMediaDomain.put("nbcnews.com", true);
		mapMediaDomain.put("nature.com", true);
		mapMediaDomain.put("forbes.com", true);
		mapMediaDomain.put("huffingtonpost.com", true);
		mapMediaDomain.put("prnewswire.com", true);
		mapMediaDomain.put("scientificamerican.com", true);
		mapMediaDomain.put("usatoday.com", true);
		mapMediaDomain.put("thetimes.co.uk", true);
		mapMediaDomain.put("tripadvisor.com", true);
		mapMediaDomain.put("washingtonpost.com", true);
		mapMediaDomain.put("wired.com", true);
		mapMediaDomain.put("usnews.com", true);
		mapMediaDomain.put("google.co.jp", true);
		mapMediaDomain.put("usnews.com", true);
		mapMediaDomain.put("bloomberg.com", true);
		mapMediaDomain.put("google.de", true);
		mapMediaDomain.put("indiatimes.com", true);
		mapMediaDomain.put("forbes.com", true);
		mapMediaDomain.put("pinterest.com", true);
		mapMediaDomain.put("google.co.jp", true);
		mapMediaDomain.put("about.com", true);
		mapMediaDomain.put("sun.com", true);
		
	}
	
	
	public static String getValidMediaDomain(int id, String domain_referer) {
		String defaultVal = id % 2 == 1 ? "facebook.com" : "bookstore.bigdatavietnam.org";
		return mapMediaDomain.getOrDefault(domain_referer, false) ? domain_referer : defaultVal;
	}

    //Touchpoint: Facebook 
	
	public static void main(String[] args) throws JsonSyntaxException, IOException {
		JsonArray jsonArray = new Gson().fromJson(FileUtils.readFileAsString("./data/MOCK_DATA_TEST_2.json"), JsonArray.class);
		for (JsonElement je : jsonArray) {
			JsonObject jo = je.getAsJsonObject();
			int id = jo.get("id").getAsInt();
			String firstName = jo.get("first_name").getAsString();
			String lastName = jo.get("last_name").getAsString();
			String email = jo.get("email").getAsString();
			String gender = jo.get("gender").getAsString();
			
			String sessionDate = jo.get("session_date").getAsString();
			String sessionTime = jo.get("session_time").getAsString();
			String domainReferer = getValidMediaDomain(id,jo.get("domain_referer").getAsString());
			String user_agent = jo.get("user_agent").getAsString();
			
			double lat = jo.get("lat").getAsDouble();
			double lon = jo.get("lon").getAsDouble();
			String locationCode = OpenLocationCode.encode(lat, lon);
			
			boolean is_product_view = jo.get("is_product_view").getAsInt() == 1;
			
			DeviceInfo userDevice = DeviceInfoUtil.getDeviceInfo(user_agent);
			System.out.println(domainReferer + " " + firstName + " " + userDevice.browserName + " " + userDevice.deviceName+ " " + locationCode);
			
			String visitorId = RandomStringUtils.randomAlphanumeric(32).toLowerCase();
			System.out.println(visitorId);
			
			String refId = RandomStringUtils.randomAlphabetic(9);
			
			//Profile profile = ProfileDataService.createSocialLoginProfile(visitorId, firstName, lastName, email, refId, "facebook");
//			profile.engageAtTouchpointId(atTouchpointId);
		}
	}
}
