package leotech.cdp.service;

import java.util.Date;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.model.audience.Profile;
import rfx.core.util.StringUtil;

public class ProfileDataService {

	public static Profile updateOrCreateFromWebTouchpoint(String observerId,String srcTouchpointId, String refTouchpointId, String touchpointRefDomain, String lastSeenIp,
			String visitorId, String userDeviceId, String fingerprintId) {
		return updateOrCreate( observerId, srcTouchpointId, refTouchpointId, touchpointRefDomain,lastSeenIp, visitorId, userDeviceId, fingerprintId, "", "", "", "");
	}

	public static Profile updateOrCreate( String observerId, String srcTouchpointId,
			String refTouchpointId, String touchpointRefDomain, String lastSeenIp, String visitorId,
			String userDeviceId, String fingerprintId, String email, String phone, String loginId, String loginProvider) {

		// the key function for real-time Identity Resolution into one profile
		Profile pf = ProfileDaoUtil.getByKeyIdentities(visitorId, email, phone, userDeviceId, fingerprintId);
		
		if (pf == null) {
			
			int type = Profile.ProfileType.ANONYMOUS;
			if (StringUtil.isNotEmpty(email) || StringUtil.isNotEmpty(phone) || StringUtil.isNotEmpty(loginId)) {
				type = Profile.ProfileType.IDENTIFIED;
			} else if (StringUtil.isNotEmpty(email) && StringUtil.isNotEmpty(phone)) {
				type = Profile.ProfileType.CRM_USER;
			}
			
			if (type == Profile.ProfileType.ANONYMOUS) {
				pf = Profile.newAnonymousProfile( observerId, srcTouchpointId, lastSeenIp, visitorId,
						userDeviceId, fingerprintId);
			} else if (type == Profile.ProfileType.IDENTIFIED) {

				pf = Profile.newIdentifiedProfile( observerId, srcTouchpointId, lastSeenIp, visitorId,
						userDeviceId, email, fingerprintId);

				if (StringUtil.isNotEmpty(loginId)) {
					pf.setIdentity(loginId, loginProvider);
				}

			} else if (type == Profile.ProfileType.CRM_USER) {
				pf = Profile.newCrmProfile( observerId, srcTouchpointId, lastSeenIp, visitorId,
						userDeviceId, email, phone, fingerprintId);
			}

			pf.engageAtTouchpoint(refTouchpointId);
			pf.updateReferrerChannel(touchpointRefDomain);
			pf.updateReferrerChannel(loginProvider);

			// TODO run in a thread
			ProfileDaoUtil.create(pf);
		} else {
			pf.engageAtTouchpoint(refTouchpointId);
			pf.updateReferrerChannel(touchpointRefDomain);
			pf.updateReferrerChannel(loginProvider);
			pf.setIdentity(loginId, loginProvider);
			pf.setPrimaryEmail(email);
			pf.setPrimaryPhone(phone);
			pf.setLastObserverId(observerId);
			pf.setLastTouchpointId(srcTouchpointId);
			pf.setLastSeenIp(lastSeenIp);
			pf.setLastUsedDeviceId(userDeviceId);
			pf.setUpdatedAt(new Date());

			ProfileDaoUtil.update(pf);
		}

		return pf;
	}

	public static Profile updateLoginInfo(String loginId, String loginProvider, String email, String phone, 
			String profileId, String observerId, String lastTouchpointId, String lastSeenIp, String usedDeviceId) {
		Profile p = ProfileDaoUtil.getById(profileId);

		p.updateReferrerChannel(loginProvider);
		
		p.setIdentity(loginId, loginProvider);
		
		
		if(StringUtil.isNotEmpty(email)) {
			p.setPrimaryEmail(email);
		}
		
		if(StringUtil.isNotEmpty(phone)) {
			p.setPrimaryPhone(phone);
		}

		if(StringUtil.isNotEmpty(usedDeviceId)) {
			p.setLastUsedDeviceId(usedDeviceId);
		}
		
		p.setLastObserverId(observerId);
		
		p.setLastSeenIp(lastSeenIp);
		
		p.setUpdatedAt(new Date());

		ProfileDaoUtil.update(p);
		return p;
	}

}
