package leotech.cdp.dao.singleview;

import com.google.gson.Gson;
import com.google.gson.annotations.Expose;

import leotech.cdp.dao.TouchpointDaoUtil;
import leotech.cdp.model.SingleViewAnalyticalObject;
import leotech.cdp.model.analytics.TrackingEvent;
import leotech.cdp.model.journey.Touchpoint;

public class EventSingleDataView extends TrackingEvent implements SingleViewAnalyticalObject {
	
	@Expose
	Touchpoint refTouchpoint;
	
	@Expose
	Touchpoint srcTouchpoint;
	
	
	@Override
	public void unifyData() {
		this.refTouchpoint = TouchpointDaoUtil.getById(this.refTouchpointId);
		this.srcTouchpoint = TouchpointDaoUtil.getById(this.srcTouchpointId);
	}

	public Touchpoint getRefTouchpoint() {
		return refTouchpoint;
	}

	public void setRefTouchpoint(Touchpoint refTouchpoint) {
		this.refTouchpoint = refTouchpoint;
	}

	public Touchpoint getSrcTouchpoint() {
		return srcTouchpoint;
	}

	public void setSrcTouchpoint(Touchpoint srcTouchpoint) {
		this.srcTouchpoint = srcTouchpoint;
	}
	
	@Override
	public String toString() {
		return new Gson().toJson(this);
	}
}
