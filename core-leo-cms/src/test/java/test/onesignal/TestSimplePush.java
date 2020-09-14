package test.onesignal;

import leotech.system.activation.PushNotificationSender;
import rfx.core.util.Utils;

public class TestSimplePush {

	
	public static void main(String[] args) {
		
		String url = "https://demobookshop.leocdp.com/product/artificial-intelligence-basics-a-non-technical-introduction/";
		String content = "Artificial intelligence touches nearly every part of your day. While you may initially assume that technology such as smart speakers and digital assistants are the extent of it, AI has in fact rapidly become a general-purpose technology, reverberating across industries including transportation, healthcare, financial services, and many more. In our modern era, an understanding of AI and its possibilities for your organization is essential for growth and success.";
		String heading = "Artificial Intelligence Basics: A Non-Technical Introduction";
		String oneSignalPlayerId = "7780033b-3528-4787-a4ee-da1f5c4f7986";
		
		PushNotificationSender.notifyUser(oneSignalPlayerId, heading, content, url );
		Utils.exitSystemAfterTimeout(2000);
	}
}
