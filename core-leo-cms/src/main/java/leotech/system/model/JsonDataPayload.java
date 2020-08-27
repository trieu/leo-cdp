package leotech.system.model;

import java.lang.reflect.Modifier;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.Expose;

import rfx.core.configs.WorkerConfigs;
import rfx.core.util.StringUtil;

/**
 * Json Data Payload for Leo CDP Admin System
 * 
 * @author tantrieuf31
 * @since 2019-08-01
 *
 */
public class JsonDataPayload {
	protected static final String STATIC_BASE_URL = StringUtil.safeString(WorkerConfigs.load().getCustomConfig("STATIC_BASE_URL"), "");

	@Expose
	String uri = "";

	@Expose
	Object data;

	@Expose
	String errorMessage = "";

	@Expose
	int errorCode = 0;

	@Expose
	int httpCode = 0;
	
	@Expose
	boolean canEditData = false;
	
	@Expose
	boolean canInsertData = false;
	
	@Expose
	boolean canDeleteData = false;
	

	@Expose
	String staticBaseUrl = STATIC_BASE_URL;

	boolean returnOnlyData = false;
	
	transient Gson gson;

	public static  JsonDataPayload ok(String uri, Object data, boolean exposeAllData) {
		return new JsonDataPayload(uri, data, exposeAllData);
	}

	public static  JsonDataPayload ok(String uri, Object data) {
		return new JsonDataPayload(uri, data, false);
	}

	public static  JsonDataPayload fail(String errorMessage, int httpCode) {
		return new JsonDataPayload(errorMessage, httpCode);
	}

	public static final JsonDataPayload fail(Throwable e, int httpCode) {
		e.printStackTrace();
		return new JsonDataPayload(e.getMessage(), httpCode);
	}

	public JsonDataPayload(String uri, Object data, boolean exposeAllData) {
		super();
		this.uri = uri;
		this.data = data;
		if (exposeAllData) {
			this.gson = new GsonBuilder().excludeFieldsWithModifiers(Modifier.TRANSIENT, Modifier.STATIC).create();
		} else {
			gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		}
	}

	protected JsonDataPayload(String errorMessage, int httpCode) {
		super();
		this.data = "";
		this.errorMessage = errorMessage;
		this.httpCode = httpCode;
		if (httpCode >= 400) {
			this.errorCode = httpCode;
		}
		this.gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
	}

	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public int getHttpCode() {
		return httpCode;
	}

	public void setHttpCode(int httpCode) {
		this.httpCode = httpCode;
		if (httpCode >= 400) {
			this.errorCode = httpCode;
		}
	}

	public boolean isCanEditData() {
		return canEditData;
	}

	public void setCanEditData(boolean canEditData) {
		this.canEditData = canEditData;
	}

	public boolean isCanInsertData() {
		return canInsertData;
	}

	public void setCanInsertData(boolean canInsertData) {
		this.canInsertData = canInsertData;
	}

	public boolean isCanDeleteData() {
		return canDeleteData;
	}

	public void setCanDeleteData(boolean canDeleteData) {
		this.canDeleteData = canDeleteData;
	}

	public String getStaticBaseUrl() {
		return staticBaseUrl;
	}

	public void setStaticBaseUrl(String staticBaseUrl) {
		this.staticBaseUrl = staticBaseUrl;
	}

	public void setErrorCode(int errorCode) {
		this.errorCode = errorCode;
	}

	public int getErrorCode() {
		return errorCode;
	}

	public boolean isReturnOnlyData() {
		return returnOnlyData;
	}

	public void setReturnOnlyData(boolean returnOnlyData) {
		this.returnOnlyData = returnOnlyData;
	}

	public String toString() {
		// byte[] utf8JsonString =
		// gson.toJson(this).getBytes(Charset.forName("UTF-8"));
		// return new String(utf8JsonString);
		if (this.returnOnlyData) {
			return gson.toJson(this.data);
		}
		return gson.toJson(this);
	}
	
}
