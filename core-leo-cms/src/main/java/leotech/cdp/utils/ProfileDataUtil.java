package leotech.cdp.utils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.model.Profile;
import rfx.core.util.StringUtil;

public class ProfileDataUtil {


    public static Profile createAnonymous(int type, String observerId, String lastTouchpointId, String lastSeenIp,
	    String usedDeviceId) {
	Profile p = new Profile(observerId, lastTouchpointId, lastSeenIp, usedDeviceId);
	ProfileDaoUtil.create(p);
	return p;
    }

    public static Profile updateSocialLoginInfo(String socialMediaName, String socialLoginId, String email, String profileId, String observerId, String lastTouchpointId, String lastSeenIp, String usedDeviceId) {
	Profile p = ProfileDaoUtil.getById(profileId);
	
	Map<String, Integer> acquisitionChannels = p.getAcquisitionChannels();
	Map<String, String> identityAttributes = p.getIdentityAttributes();
	if (!acquisitionChannels.containsKey(socialMediaName) && !identityAttributes.containsKey(socialMediaName)) {
	    acquisitionChannels.put(socialMediaName, 1);
	    p.setAcquisitionChannels(acquisitionChannels);

	    identityAttributes.put(socialMediaName, socialLoginId);
	    p.setIdentityAttributes(identityAttributes);
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
