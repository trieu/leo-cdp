package leotech.cdp.dao.singleview;

import java.util.HashSet;
import java.util.Set;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.Expose;

import leotech.cdp.dao.TouchpointDaoUtil;
import leotech.cdp.model.SingleDataView;
import leotech.cdp.model.customer.Profile;
import leotech.cdp.model.customer.ProfileType;
import leotech.cdp.model.marketing.Touchpoint;
import leotech.system.model.DeviceInfo;

public class ProfileSingleDataView extends Profile implements SingleDataView {

	@Expose
	Touchpoint lastTouchpoint;
	
	@Expose
	Set<Touchpoint> topEngagedTouchpoints = new HashSet<Touchpoint>(1000);
	
	@Expose
	DeviceInfo lastUsedDevice;
	
	@Expose
	String typeAsText = "ANONYMOUS";
	
	@Expose
	String genderAsText = "unknown";
	
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
		//touchpoint model
		this.lastTouchpoint = TouchpointDaoUtil.getById(this.lastTouchpointId);
		for (String tpId : top1000Touchpoints) {
			Touchpoint tp = TouchpointDaoUtil.getById(tpId);
			if(tp != null) {
				topEngagedTouchpoints.add(tp);
			}
		}
		
		if(type == ProfileType.CRM_CONTACT) {
			typeAsText = "CRM_CONTACT";
		} else if(type == ProfileType.KEY_ACCOUNT) {
			typeAsText = "KEY_ACCOUNT";
		} else if(type == ProfileType.DMP_PROFILE) {
			typeAsText = "DMP_PROFILE";
		} else if(type == ProfileType.IDENTIFIED) {
			typeAsText = "IDENTIFIED";
		}
		
		if(this.genderProbability == 100) {
			if(this.gender == 1) {
				genderAsText = "Male";
			}
			else if(this.gender == 0) {
				genderAsText = "Female";
			}
		} else {
			if(this.gender == 1) {
				genderAsText = "Male with probability " + this.genderProbability + " %";
			}
			else if(this.gender == 0) {
				genderAsText = "Female with probability " + this.genderProbability + " %";
			}
		}
	}

	public Touchpoint getLastTouchpoint() {
		return lastTouchpoint;
	}

	public Set<Touchpoint> getTopEngagedTouchpoints() {
		return topEngagedTouchpoints;
	}

	public DeviceInfo getLastUsedDevice() {
		return lastUsedDevice;
	}
	
	@Override
	public String toString() {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(this);
	}
}
