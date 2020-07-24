package test.sms;

import java.io.IOException;

import leotech.system.util.RamdomCodesUtil;
import leotech.system.util.RamdomCodesUtil.Charset;
import leotech.system.util.RamdomCodesUtil.RandomCodeConfig;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class TestSms {

	public static void main(String[] args) throws Exception {
		RandomCodeConfig config = RandomCodeConfig.length(4).withCharset(Charset.NUMBERS);
        String code = RamdomCodesUtil.generate(config) + " "+RamdomCodesUtil.generate(config) + " "+RamdomCodesUtil.generate(config) + " "+RamdomCodesUtil.generate(config);
        System.out.println(code);
		
		OkHttpClient client = new OkHttpClient();

		/** 
		* ::: How to send sms with your generated Token
		**/

		String token = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRyaWVOZzU3MyIsInBhc3N3b3JkIjoiSGVsbGJveUAxMjM0NSIsImRhdGVDcmVhdGVkIjoiMjAyMC0wNy0yNFQwODoxODoxOC4wNjM4Mzg0WiJ9.23OdNOISv8UNItr0ugqP9lLeroBSEvF5W1o0M6RBcUk";

		MediaType mediaType = MediaType.parse("application/json");
		RequestBody body = RequestBody.create(
		    mediaType,
		    "{\"from\":\"USPA\",\"to\":[\"84903122290\"],\"type\":\"Text\",\"content\":\""+code+"\"}"
		    );
		Request request2 = new Request.Builder()
		  .url("https://restapi.bulksmsonline.com/rest/api/v1/sms/send")
		  .post(body)
		  .addHeader("token", token)
		  .addHeader("content-type", "application/json")
		  .build();

		Response response2 = client.newCall(request2).execute();
		
		System.out.println(response2.body().string());
	}

	private static OkHttpClient getToken() throws IOException {
		/** 
		* :: How to generate Token in JAVA using our Restful API
		**/
		OkHttpClient client = new OkHttpClient();

		Request request     = new Request.Builder()
		  .url("https://restapi.bulksmsonline.com/rest/api/v1/sms/gettoken/username/TrieNg573/password/Hellboy@12345")
		  .get()
		  .build();

		Response response   = client.newCall(request).execute();
		
		String token1 = response.body().string();
		
		System.out.println("token " + token1 );
		return client;
	}
}
