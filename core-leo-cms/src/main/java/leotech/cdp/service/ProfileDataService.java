package leotech.cdp.service;

import java.util.Date;
import java.util.Map;
import java.util.Set;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.model.Profile;
import rfx.core.util.StringUtil;

public class ProfileDataService {

	public static Profile getOrCreateNew(String ctxSessionKey, String observerId, String initTouchpointId,
			String lastSeenIp, String visitorId, String userDeviceId, String email, String phone, String fingerprintId, String loginId, String loginIdProvider) {

		boolean isHasLoginInfo = StringUtil.isNotEmpty(loginId) && StringUtil.isNotEmpty(loginIdProvider);
		int type = Profile.ProfileType.ANONYMOUS;
		if (StringUtil.isNotEmpty(email) || StringUtil.isNotEmpty(phone) || isHasLoginInfo ) {
			type = Profile.ProfileType.IDENTIFIED;
		} 
		else if (StringUtil.isNotEmpty(email) && StringUtil.isNotEmpty(phone)) {
			type = Profile.ProfileType.CRM_USER;
		}

		Profile pf = ProfileDaoUtil.getByKeyIdentities(visitorId, email, phone, userDeviceId);
		if (pf == null) {
			if (type == Profile.ProfileType.ANONYMOUS) {
				pf = Profile.newAnonymousProfile(ctxSessionKey, observerId, initTouchpointId, lastSeenIp, visitorId,
						userDeviceId, fingerprintId);
			} 
			else if (type == Profile.ProfileType.IDENTIFIED) {
				
				pf = Profile.newIdentifiedProfile(ctxSessionKey, observerId, initTouchpointId, lastSeenIp,
						visitorId, userDeviceId, email, fingerprintId);
				
				if(isHasLoginInfo) {
					pf.setIdentity(loginId,loginIdProvider);
				}
				
			} 
			else if (type == Profile.ProfileType.CRM_USER) {
				pf = Profile.newCrmProfile(ctxSessionKey, observerId, initTouchpointId, lastSeenIp, visitorId,
						userDeviceId, email, phone, fingerprintId);
			}

			// TODO run in a thread
			ProfileDaoUtil.create(pf);
		}

		return pf;
	}

	public static Profile updateLoginInfo(String socialMediaName, String socialLoginId, String email,
			String profileId, String observerId, String lastTouchpointId, String lastSeenIp, String usedDeviceId) {
		Profile p = ProfileDaoUtil.getById(profileId);

		Map<String, Integer> acquisitionChannels = p.getAcquisitionChannels();
		Set<String> ids = p.getIdentities();
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
