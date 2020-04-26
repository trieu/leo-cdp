package leotech.cdp.service;

import java.util.Date;
import java.util.Map;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.model.Profile;

public class ProfileDataService {

    public static Profile getProfile(String ctxSessionKey, String visitorId, String observerId, String initTouchpointId, String ip, String userDeviceId) {
	Profile profile = new Profile(ctxSessionKey, visitorId, observerId, initTouchpointId, ip, userDeviceId);
	//TODO
	return profile;
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
	Map<String, String> identityMap = p.getIdentityMap();
	if (!acquisitionChannels.containsKey(socialMediaName) && !identityMap.containsKey(socialMediaName)) {
	    acquisitionChannels.put(socialMediaName, 1);
	    p.setAcquisitionChannels(acquisitionChannels);
	    identityMap.put(socialMediaName, socialLoginId);
	
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
