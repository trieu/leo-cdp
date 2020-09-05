package leotech.system.common;

import java.io.File;

import org.apache.http.HttpStatus;
import org.apache.http.entity.ContentType;

import io.netty.handler.codec.http.HttpHeaderNames;
import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerResponse;
import leotech.system.template.TemplateUtil;

public class PublicFileHttpRouter {
	public static final int CACHING_EXPIRED_TIME = 3600 * 24 * 7;// 7 days
	public static final String MAX_AGE_CACHING_PUBLIC = "max-age=" + CACHING_EXPIRED_TIME + ", public";
	public static final String PUBLIC_FILE_ROUTER = "/public";

	public static void handle(HttpServerResponse resp, MultiMap outHeaders, String path, MultiMap params) {
		try {
			String pathname = path.replace(PUBLIC_FILE_ROUTER, "./public").replaceAll("%20", " ");

			System.out.println("publicFileHandler " + pathname);
			File file = new File(pathname);
			if (file.isFile()) {
				outHeaders.set(HttpHeaderNames.CACHE_CONTROL, MAX_AGE_CACHING_PUBLIC);
				if (params.get("download") != null) {
					outHeaders.set(HttpHeaderNames.CONTENT_TYPE,ContentType.APPLICATION_OCTET_STREAM.getMimeType());
					String name = file.getName();
					outHeaders.set(HttpHeaderNames.CONTENT_DISPOSITION, "attachment; filename=\"" + name + "\"");
				}
				resp.sendFile(pathname);
			} else {
				resp.setStatusCode(HttpStatus.SC_NOT_FOUND);
				resp.end(TemplateUtil._404);
			}
		} catch (Exception e) {
			resp.setStatusCode(HttpStatus.SC_INTERNAL_SERVER_ERROR);
			resp.end(TemplateUtil._500);
		}
	}
}
