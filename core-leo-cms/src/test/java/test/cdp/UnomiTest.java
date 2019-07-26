package test.cdp;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import rfx.core.util.HttpClientUtil;

public class UnomiTest {

    public static String getUnomiUrl(String uri) {
	return "http://localhost:8181" + uri;
    }
    public static void main(String[] args) {
	String jsonStr = HttpClientUtil.executeGet(getUnomiUrl("/context.json?sessionId=12356"));
	System.out.println(jsonStr);
	JsonParser parser = new JsonParser();
	JsonObject session = parser.parse(jsonStr).getAsJsonObject();
	String profileId = session.get("profileId").getAsString();
	System.out.println(profileId);
    }
    
}
