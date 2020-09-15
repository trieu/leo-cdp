package leotech.system.util;

import java.net.URI;

public class UrlUtil {

	public static String getHostName(String url) {
		try {
			URI uri = new URI(url);
			String hostname = uri.getHost();
			// to provide faultproof result, check if not null then return only
			// hostname, without www.
			if (hostname != null) {
				return hostname.startsWith("www.") ? hostname.substring(4) : hostname;
			}
			return hostname;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
	
	
	
}
