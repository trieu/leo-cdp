package leotech.system.model;

import com.google.gson.Gson;

import io.vertx.core.json.JsonObject;

public class DataFilter {

	String uri;
	int draw;
	int length;
	int start;
	
	public DataFilter() {
	}
	
	public DataFilter(String uri, JsonObject paramJson) {
		this.uri = uri;
		System.out.println("==> new DataFilter: "+new Gson().toJson(paramJson));
		this.start =  paramJson.getInteger("start", 0);
		this.length = paramJson.getInteger("length", 20);
		this.draw = paramJson.getInteger("draw", 1);
	}
	
	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	public int getDraw() {
		return draw;
	}
	public void setDraw(int draw) {
		this.draw = draw;
	}
	public int getLength() {
		return length;
	}
	public void setLength(int length) {
		this.length = length;
	}
	public int getStart() {
		return start;
	}
	public void setStart(int start) {
		this.start = start;
	}
	
	@Override
	public String toString() {
		return new Gson().toJson(this);
	}
}
