package leotech.cdp.dao.singleview;

import com.google.gson.annotations.Expose;

import leotech.cdp.dao.TouchpointDaoUtil;
import leotech.cdp.model.SingleDataView;
import leotech.cdp.model.customer.TrackingEvent;
import leotech.cdp.model.marketing.Touchpoint;

public class EventSingleDataView extends TrackingEvent implements SingleDataView {
	
	@Expose
	Touchpoint refTouchpoint;
	
	@Expose
	Touchpoint srcTouchpoint;

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
}
