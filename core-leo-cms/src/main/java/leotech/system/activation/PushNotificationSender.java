package leotech.system.activation;

import java.util.Arrays;

import io.github.jklingsporn.vertx.push.PushClient;
import io.github.jklingsporn.vertx.push.PushClientOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import leotech.system.config.ActivationChannelConfigs;

public class PushNotificationSender {

	// OneSignal configs
	static ActivationChannelConfigs configs = ActivationChannelConfigs.loadPushNoticationServiceConfig();
	static final String APP_ID = configs.getValue("appId");
	static final String REST_API_KEY = configs.getValue("restApiKey");

	static PushClient getSenderClient() {
		PushClientOptions ops = new PushClientOptions();
		ops.setAppId(APP_ID);
		ops.setRestApiKey(REST_API_KEY);

		PushClient client = PushClient.create(Vertx.vertx(), ops);
		return client;
	}

	public static void notifyUser(String userId, String heading, String content, String url) {

		JsonArray targetByPlayerIds = new JsonArray(Arrays.asList(userId));
		JsonObject contents = new JsonObject().put("en", content).put("vn", content);
		JsonObject headings = new JsonObject().put("en", heading).put("vn", heading);
		
//		JsonObject data = new JsonObject();
//		data.put("app_id", APP_ID);
//		data.put("contents", contents);
//		data.put("headings", headings);
//		data.put("url", url);
//		data.put("include_player_ids", targetByPlayerIds);

		// setup the content of the message on the serverside
		getSenderClient()
				//.raw().addOptions(new SendOptions(data))
				.withContent(contents, url).withHeadings(headings)
				.targetByPlayerIds(targetByPlayerIds)
				.sendNow(h -> {
					if (h.succeeded()) {
						JsonObject rs = h.result();
						boolean ok = rs.getInteger("recipients", 0) > 0;
						System.err.println("PushNotificationSender.notifyUser" + userId + " rs = " + ok);
					} else {
						h.cause().printStackTrace();
					}
				});

	}
}
