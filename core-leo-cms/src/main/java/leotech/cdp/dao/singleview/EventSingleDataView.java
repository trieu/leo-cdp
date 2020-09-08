package leotech.cdp.dao.singleview;

import com.google.gson.annotations.Expose;

import leotech.cdp.dao.TouchpointDaoUtil;
import leotech.cdp.model.SingleDataView;
import leotech.cdp.model.analytics.TrackingEvent;
import leotech.cdp.model.journey.Touchpoint;

public class EventSingleDataView extends TrackingEvent implements SingleDataView {
	
	public static final int STATE_RAW_DATA = 0;
	public static final int STATE_PROCESSED = 1;
	public static final int STATE_ARCHIVED = -1;
	
	@Expose
	Touchpoint refTouchpoint;
	
	@Expose
	Touchpoint srcTouchpoint;
	
	@Expose
	int state = STATE_RAW_DATA; 

	@Override
	public void unifyDataView() {
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

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}
	
	
}
