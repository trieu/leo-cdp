package leotech.system.util;

import java.net.InetSocketAddress;
import java.util.Map.Entry;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.net.SocketAddress;
import rfx.core.util.StringUtil;

public class RequestInfoUtil {

    private static final String _127_0_0_1 = "127.0.0.1";
    static final String unknown = "unknown";

    public static String getRemoteIP(HttpServerRequest request) {
	String ipAddress = request.headers().get("X-Forwarded-For");
	if (!StringUtil.isNullOrEmpty(ipAddress) && !unknown.equalsIgnoreCase(ipAddress)) {
	    // LogUtil.dumpToFileIpLog(ipAddress);
	    String[] toks = ipAddress.split(",");
	    int len = toks.length;
	    if (len > 1) {
		ipAddress = toks[len - 1];
	    } else {
		return ipAddress;
	    }
	} else {
	    ipAddress = getIpAsString(request.remoteAddress());
	}
	return ipAddress;
    }

    public static String getIpAsString(SocketAddress address) {
	try {
	    if (address instanceof InetSocketAddress) {
		return ((InetSocketAddress) address).getAddress().getHostAddress();
	    }
	    String[] toks = address.toString().split("/");
	    if(toks.length > 1) {
		String[] toks2 = toks[1].split(":");
		if(toks2.length > 0) {
		    return toks2[0];    
		}		
	    }	    
	} catch (Throwable e) {
	    e.printStackTrace();
	}
	return _127_0_0_1;
    }

    public static String getRequestInfo(HttpServerRequest request) {
	StringBuilder reqInfo = new StringBuilder();

	String remoteAddress = request.remoteAddress().toString();

	MultiMap headers = request.headers();

	reqInfo.append(" <br> IP remoteAddress: ").append(remoteAddress);
	for (Entry<String, String> header : headers) {
	    reqInfo.append("<br> ").append(header.getKey()).append(" = ").append(header.getValue());
	}

	return reqInfo.toString();

    }
}
