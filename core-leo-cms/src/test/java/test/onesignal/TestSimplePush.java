package test.onesignal;

import leotech.system.communication.PushNotificationSender;
import rfx.core.util.Utils;

public class TestSimplePush {

	
	public static void main(String[] args) {
		
		String productLink = "https://demotrack.leocdp.net/rtmu/pMDwdSsxyrNB1nJxuqNLd";
		String content = "Artificial Intelligence Basics: A Non-Technical Introduction";
		String heading = "You may like this product";
		String oneSignalPlayerId = "e1aa2468-a352-46e3-8dc3-79de273d1d28";
		
		PushNotificationSender.notifyUser(oneSignalPlayerId, heading, content, productLink );
		Utils.exitSystemAfterTimeout(2000);
	}
}
