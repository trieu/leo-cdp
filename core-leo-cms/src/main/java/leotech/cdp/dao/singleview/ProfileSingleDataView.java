package leotech.cdp.dao.singleview;

import com.google.gson.annotations.Expose;

import leotech.cdp.dao.TouchpointDaoUtil;
import leotech.cdp.model.SingleDataView;
import leotech.cdp.model.audience.Profile;
import leotech.cdp.model.business.Touchpoint;

public class ProfileSingleDataView extends Profile implements SingleDataView {

	@Expose
	Touchpoint lastTouchpoint;
	
	
	@Expose
	String lastUsedDevice = "";
	
	//TODO 
	
	public ProfileSingleDataView() {
		
	}
	
	public ProfileSingleDataView(Profile pf) {
		this.id = pf.getId();
		this.firstName = pf.getFirstName();
		this.lastName = pf.getLastName();
		this.primaryEmail = pf.getPrimaryEmail();
		this.primaryPhone = pf.getPrimaryPhone();
		this.createdAt = pf.getCreatedAt();
		this.updatedAt = pf.getUpdatedAt();
		this.lastTouchpointId = pf.getLastTouchpointId();

		//TODO
	}
	
	@Override
	public void unifyDataToSinpleView() {
		this.lastTouchpoint = TouchpointDaoUtil.getById(this.lastTouchpointId);
	}
}
