package leotech.system.communication;

import java.io.IOException;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import leotech.system.config.ActivationChannelConfigs;
import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import rfx.core.util.Utils;

public class MobileSmsSender {

	static ActivationChannelConfigs configs = ActivationChannelConfigs.loadMobileGatewaySmsServiceConfig();
	static final String AuthorizationHeader = configs.getValue("Authorization");
	static final String URL_SECURED_BY_BASIC_AUTHENTICATION = "http://api.infobip.com//sms/1/text/advanced";
	static OkHttpClient client = new OkHttpClient();
	
	public static void send(String phoneNumber, String content) {
		JsonObject message = new JsonObject();
		message.put("destinations", new JsonArray().add(new JsonObject().put("to", phoneNumber)) );
		message.put("text", content);
		
		JsonArray messages = new JsonArray();
		messages.add(message);
		
		JsonObject jsonObject = new JsonObject();
		jsonObject.put("messages", messages);
	    
		String json = jsonObject.encode();
		System.out.println("MobileSmsSender " + json);
		
		RequestBody body = RequestBody.create(MediaType.parse("application/json"), json);
		
	    Request request = new Request.Builder()
	      .url(URL_SECURED_BY_BASIC_AUTHENTICATION)
	      .addHeader("Authorization", "Basic VGVzdGluZ2Jhbms6cGFzc3dvcmQ=")
	      .post(body)
	      .build();
	  
	    try {
	    	Call call = client.newCall(request);
			Response response = call.execute();
			System.out.println(response.body().string());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
	}
	
	public static void main(String[] args) {
		String phoneNumber = "84903122290";
		String content = "New product https://demotrack.leocdp.net/ping"  ;
		send(phoneNumber, content);
		
		Utils.exitSystemAfterTimeout(7000);
	}
}
