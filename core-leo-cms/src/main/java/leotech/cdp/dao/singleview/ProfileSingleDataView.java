package leotech.cdp.dao.singleview;

import java.util.HashSet;
import java.util.Set;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.Expose;

import leotech.cdp.dao.TouchpointDaoUtil;
import leotech.cdp.dao.TrackingEventDaoUtil;
import leotech.cdp.model.SingleDataView;
import leotech.cdp.model.analytics.TrackingEvent;
import leotech.cdp.model.customer.Profile;
import leotech.cdp.model.customer.ProfileConstant;
import leotech.cdp.model.journey.Touchpoint;
import leotech.system.model.DeviceInfo;

public class ProfileSingleDataView extends Profile implements SingleDataView {

	@Expose
	Touchpoint lastTouchpoint;
	
	@Expose
	TrackingEvent lastTrackingEvent;
	
	
	@Expose
	Set<Touchpoint> topEngagedTouchpoints;
	
	@Expose
	DeviceInfo lastUsedDevice;
	
	@Expose
	String typeAsText ;
	
	@Expose
	String genderAsText;
	
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
	public void unifyDataView() {
		//TODO 
		
		// touchpoint model
		if(this.lastTouchpoint == null) {
			this.lastTouchpoint = TouchpointDaoUtil.getById(this.lastTouchpointId);
		}
		
		this.lastTrackingEvent = TrackingEventDaoUtil.getLastTrackingEventsByProfileId(this.id);
		if(this.lastTrackingEvent == null) {
			this.lastTrackingEvent = new TrackingEvent();
		}
		
		if(this.topEngagedTouchpoints == null) {
			topEngagedTouchpoints = new HashSet<Touchpoint>(1000);
			for (String tpId : this.topEngagedTouchpointIds) {
				Touchpoint tp = TouchpointDaoUtil.getById(tpId);
				if(tp != null) {
					topEngagedTouchpoints.add(tp);
				}
			}
		}
		
		// profile type
		if(typeAsText == null) {
			typeAsText = "ANONYMOUS";
			if(type == ProfileConstant.TYPE_CRM_CONTACT) {
				typeAsText = "CRM_CONTACT";
			} else if(type == ProfileConstant.TYPE_KEY_ACCOUNT) {
				typeAsText = "KEY_ACCOUNT";
			} else if(type == ProfileConstant.TYPE_DMP_PROFILE) {
				typeAsText = "DMP_PROFILE";
			} else if(type == ProfileConstant.TYPE_IDENTIFIED) {
				typeAsText = "IDENTIFIED";
			} else if(type == ProfileConstant.TYPE_SOCIAL_LOGIN) {
				typeAsText = "SOCIAL_LOGIN";
			}
			 
		}
		
		// gender 
		if(genderAsText == null) {
			genderAsText = "unknown";
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
	
	public String getTypeAsText() {
		return typeAsText;
	}

	public void setTypeAsText(String typeAsText) {
		this.typeAsText = typeAsText;
	}

	public String getGenderAsText() {
		return genderAsText;
	}

	public void setGenderAsText(String genderAsText) {
		this.genderAsText = genderAsText;
	}

	public void setLastTouchpoint(Touchpoint lastTouchpoint) {
		this.lastTouchpoint = lastTouchpoint;
	}

	public void setTopEngagedTouchpoints(Set<Touchpoint> topEngagedTouchpoints) {
		this.topEngagedTouchpoints = topEngagedTouchpoints;
	}

	public void setLastUsedDevice(DeviceInfo lastUsedDevice) {
		this.lastUsedDevice = lastUsedDevice;
	}

	public TrackingEvent getLastTrackingEvent() {
		return lastTrackingEvent;
	}

	public void setLastTrackingEvent(TrackingEvent lastTrackingEvent) {
		this.lastTrackingEvent = lastTrackingEvent;
	}

	

	@Override
	public String toString() {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(this);
	}
}
