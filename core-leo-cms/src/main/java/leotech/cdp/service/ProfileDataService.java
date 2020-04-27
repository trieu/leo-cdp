package leotech.cdp.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.model.Profile;
import rfx.core.util.StringUtil;

public class ProfileDataService {

    public static Profile getProfile(String ctxSessionKey, String visitorId, String observerId, String initTouchpointId, String lastSeenIp, String userDeviceId, String email, String phone) {
	
	
	int type = Profile.ProfileType.ANONYMOUS;
	if(StringUtil.isNotEmpty(email) && StringUtil.isEmpty(phone)) {
	    type = Profile.ProfileType.IDENTIFIED;
	} else if(StringUtil.isNotEmpty(email) && StringUtil.isNotEmpty(phone)) {
	    type = Profile.ProfileType.CRM_USER;
	}
	
	
	String id = Profile.buildProfileId(type, observerId, initTouchpointId, lastSeenIp, userDeviceId, email, phone);
	Profile p = ProfileDaoUtil.getById(id);
	if(p == null) {
	    if(type == Profile.ProfileType.ANONYMOUS) {
		p = Profile.newAnonymousProfile(ctxSessionKey, visitorId, observerId, initTouchpointId, lastSeenIp, userDeviceId);
	    }
	    else if(type == Profile.ProfileType.IDENTIFIED) {
		p = Profile.newIdentifiedProfile(ctxSessionKey, visitorId, observerId, initTouchpointId, lastSeenIp, userDeviceId, email);
	    } else if(type == Profile.ProfileType.CRM_USER) {
		p = Profile.newCrmProfile(ctxSessionKey, visitorId, observerId, initTouchpointId, lastSeenIp, userDeviceId, email, phone);
	    }
	    
	    ProfileDaoUtil.create(p);
	}
	
	//TODO
	return p;
    }
    
//    public static Profile createAnonymous(int type, String observerId, String lastTouchpointId, String lastSeenIp,
//	    String usedDeviceId) {
//	Profile p = new Profile(observerId, lastTouchpointId, lastSeenIp, usedDeviceId);
//	ProfileDaoUtil.create(p);
//	return p;
//    }

    public static Profile updateSocialLoginInfo(String socialMediaName, String socialLoginId, String email, String profileId, String observerId, String lastTouchpointId, String lastSeenIp, String usedDeviceId) {
	Profile p = ProfileDaoUtil.getById(profileId);
	
	Map<String, Integer> acquisitionChannels = p.getAcquisitionChannels();
	List<String> ids = p.getIdentities();
	String sid = socialMediaName + "#" + socialLoginId;
	if (!acquisitionChannels.containsKey(socialMediaName) && !ids.contains(sid)) {
	    acquisitionChannels.put(socialMediaName, 1);
	    p.setAcquisitionChannels(acquisitionChannels);
	    ids.add(sid);
	}
	
	p.setPrimaryEmail(email);
	p.setObserverId(observerId);
	p.setLastTouchpointId(lastTouchpointId);
	p.setLastSeenIp(lastSeenIp);
	p.setLastUsedDeviceId(usedDeviceId);
	p.setUpdatedAt(new Date());
	
	ProfileDaoUtil.update(p);
	return p;
    }
}
