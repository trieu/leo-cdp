package leotech.starter.router;

import static io.netty.handler.codec.http.HttpHeaderNames.CONNECTION;
import static io.netty.handler.codec.http.HttpHeaderNames.CONTENT_TYPE;

import java.io.File;

import org.apache.commons.io.FilenameUtils;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.RoutingContext;
import leotech.cms.dao.FileMetadataDaoUtil;
import leotech.cms.model.FileMetadata;
import leotech.system.common.BaseApiHandler;
import leotech.system.common.BaseApiRouter;
import leotech.system.common.BaseHttpRouter;
import leotech.system.common.SecuredWebDataHandler;
import leotech.system.common.SecuredWebDataHandler.JsonErrorPayload;
import leotech.system.model.FileUploaderData;
import leotech.system.model.JsonDataPayload;
import leotech.system.model.SystemUser;
import leotech.system.util.HttpTrackingUtil;
import rfx.core.util.HashUtil;
import rfx.core.util.StringUtil;

public class UploadFileHttpRouter extends BaseHttpRouter {
	private static final String FILE_LOCATION = "/public/uploaded-files/";

	public UploadFileHttpRouter(RoutingContext context) {
		super(context);
		System.out.println("init UploadFileHttpRouter");
	}

	@Override
	public boolean handle() throws Exception {

		HttpServerRequest request = context.request();
		HttpServerResponse response = context.response();
		// ---------------------------------------------------------------------------------------------------
		MultiMap outHeaders = response.headers();
		outHeaders.set(CONNECTION, HttpTrackingUtil.HEADER_CONNECTION_CLOSE);
		outHeaders.set(POWERED_BY, SERVER_VERSION);
		outHeaders.set(CONTENT_TYPE, BaseApiHandler.CONTENT_TYPE_JSON);

		MultiMap reqHeaders = request.headers();
		String origin = StringUtil.safeString(reqHeaders.get(BaseApiHandler.ORIGIN), "*");
		// String contentType =
		// StringUtil.safeString(reqHeaders.get(BaseApiHandler.CONTENT_TYPE),
		// BaseApiHandler.CONTENT_TYPE_JSON);
		String userSession = StringUtil.safeString(reqHeaders.get(BaseApiRouter.HEADER_SESSION));
		String refObjClass = StringUtil.safeString(reqHeaders.get("refObjectClass"));
		String refObjKey = StringUtil.safeString(reqHeaders.get("refObjectKey"));
		SystemUser loginUser = SecuredWebDataHandler.getUserFromSession(userSession);

		// CORS Header
		BaseHttpRouter.setCorsHeaders(outHeaders, origin);

		String httpMethod = request.rawMethod();
		String uri = request.path();
		String host = request.host();
		System.out.println(httpMethod + " ==>>>> host: " + host + " uri: " + uri);

		if (HTTP_POST_NAME.equalsIgnoreCase(httpMethod)) {
			boolean ok = false;
			if (loginUser != null) {
				if (SecuredWebDataHandler.isAdminRole(loginUser)) {

					FileUploaderData data = new FileUploaderData();
					for (io.vertx.ext.web.FileUpload uploadedFile : context.fileUploads()) {

						System.out.println("Filename: " + uploadedFile.fileName());
						// System.out.println("uploadedFileName: " +
						// uploadedFile.uploadedFileName());
						// System.out.println("Size: " + uploadedFile.size());
						System.out.println("contentType: " + uploadedFile.contentType());

						String name = uploadedFile.fileName();

						String extension = FilenameUtils.getExtension(name).toLowerCase();
						String newFileName = HashUtil
								.sha1(uploadedFile.uploadedFileName() + System.currentTimeMillis());
						String fileUri = FILE_LOCATION + newFileName + "." + extension;
						data.setFileUrl(fileUri);
						File file = new File("./" + uploadedFile.uploadedFileName());
						File finalUploadedFile = new File("." + fileUri);
						file.renameTo(finalUploadedFile);

						String owner = loginUser.getUserLogin();

						// store file meta-data in database
						FileMetadata fileMetadata = new FileMetadata(owner, fileUri, name, refObjClass, refObjKey);
						FileMetadataDaoUtil.save(fileMetadata);

						// TODO thumbnail cronjob here
						// String path = finalUploadedFile.getAbsolutePath();
						// ImageUtil.resize(path, path, percent);
					}

					JsonDataPayload dataPayload = new JsonDataPayload(request.uri(), data, true);
					response.setStatusCode(201).end(dataPayload.toString());
					response.close();
					ok = true;
				}
			}
			if (!ok) {
				response.setStatusCode(504).end(JsonErrorPayload.NO_AUTHORIZATION.toString());
				response.close();
			}
			return ok;
		} else {
			outHeaders.set(CONNECTION, HttpTrackingUtil.HEADER_CONNECTION_CLOSE);
			outHeaders.set(BaseApiRouter.POWERED_BY, BaseApiRouter.SERVER_VERSION);
			outHeaders.set(CONTENT_TYPE, BaseApiHandler.CONTENT_TYPE_JSON);
			// CORS Header
			BaseHttpRouter.setCorsHeaders(outHeaders, origin);
			if (HTTP_GET_OPTIONS.equalsIgnoreCase(httpMethod) || HTTP_GET_NAME.equalsIgnoreCase(httpMethod)) {
				response.end("");
			}
		}
		return false;
	}
}
