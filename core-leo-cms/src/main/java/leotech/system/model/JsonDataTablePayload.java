package leotech.system.model;

import com.google.gson.annotations.Expose;

public class JsonDataTablePayload extends JsonDataPayload {
	
	public static final JsonDataTablePayload data(String uri, Object data, long recordsTotal, int recordsFiltered, int draw) {
		JsonDataTablePayload model = new JsonDataTablePayload(uri, data);
		model.setRecordsFiltered(recordsFiltered);
		model.setRecordsTotal(recordsTotal);
		model.setDraw(draw);
		return model;
	}
	
	protected JsonDataTablePayload(String uri, Object data) {
		super(uri, data, false);
	}

	@Expose
	long recordsTotal = 0;
	
	@Expose
	int recordsFiltered = 0;
	
	@Expose
	int draw = 2;
	
	public long getRecordsTotal() {
		return recordsTotal;
	}

	public void setRecordsTotal(long recordsTotal) {
		this.recordsTotal = recordsTotal;
	}

	public int getRecordsFiltered() {
		return recordsFiltered;
	}

	public void setRecordsFiltered(int recordsFiltered) {
		this.recordsFiltered = recordsFiltered;
	}

	public int getDraw() {
		return draw;
	}

	public void setDraw(int draw) {
		this.draw = draw;
	}
}
