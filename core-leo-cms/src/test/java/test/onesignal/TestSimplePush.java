package test.onesignal;

import leotech.system.activation.PushNotificationSender;

public class TestSimplePush {

	
	public static void main(String[] args) {
		
		String url = "https://demobookshop.leocdp.com/product/artificial-intelligence-basics-a-non-technical-introduction/";
		String content = "Artificial intelligence touches nearly every part of your day. While you may initially assume that technology such as smart speakers and digital assistants are the extent of it, AI has in fact rapidly become a general-purpose technology, reverberating across industries including transportation, healthcare, financial services, and many more. In our modern era, an understanding of AI and its possibilities for your organization is essential for growth and success.";
		String heading = "Artificial Intelligence Basics: A Non-Technical Introduction";
		String oneSignalPlayerId = "e1aa2468-a352-46e3-8dc3-79de273d1d28";
		
		PushNotificationSender.notifyUser(oneSignalPlayerId, heading, content, url );
	}
}
