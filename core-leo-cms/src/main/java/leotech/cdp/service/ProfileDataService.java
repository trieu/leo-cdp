package leotech.cdp.service;

import java.util.Date;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.model.Profile;
import rfx.core.util.StringUtil;

public class ProfileDataService {

	public static Profile updateOrCreateFromWebTouchpoint(String ctxSessionKey, String observerId,
			String srcTouchpointId, String refTouchpointId, String touchpointRefDomain, String lastSeenIp,
			String visitorId, String userDeviceId) {
		return updateOrCreate(ctxSessionKey, observerId, srcTouchpointId, refTouchpointId, touchpointRefDomain,
				lastSeenIp, visitorId, userDeviceId, "", "", "", "", "");
	}

	public static Profile updateOrCreate(String ctxSessionKey, String observerId, String srcTouchpointId,
			String refTouchpointId, String touchpointRefDomain, String lastSeenIp, String visitorId,
			String userDeviceId, String email, String phone, String fingerprintId, String loginId,
			String loginProvider) {

		int type = Profile.ProfileType.ANONYMOUS;
		if (StringUtil.isNotEmpty(email) || StringUtil.isNotEmpty(phone) || StringUtil.isNotEmpty(loginId)) {
			type = Profile.ProfileType.IDENTIFIED;
		} else if (StringUtil.isNotEmpty(email) && StringUtil.isNotEmpty(phone)) {
			type = Profile.ProfileType.CRM_USER;
		}

		System.out.println("getByKeyIdentities visitorId "+visitorId);
		Profile pf = ProfileDaoUtil.getByKeyIdentities(visitorId, email, phone, userDeviceId);
		if (pf == null) {
			if (type == Profile.ProfileType.ANONYMOUS) {
				pf = Profile.newAnonymousProfile(ctxSessionKey, observerId, srcTouchpointId, lastSeenIp, visitorId,
						userDeviceId, fingerprintId);
			} else if (type == Profile.ProfileType.IDENTIFIED) {

				pf = Profile.newIdentifiedProfile(ctxSessionKey, observerId, srcTouchpointId, lastSeenIp, visitorId,
						userDeviceId, email, fingerprintId);

				if (StringUtil.isNotEmpty(loginId)) {
					pf.setIdentity(loginId, loginProvider);
				}

			} else if (type == Profile.ProfileType.CRM_USER) {
				pf = Profile.newCrmProfile(ctxSessionKey, observerId, srcTouchpointId, lastSeenIp, visitorId,
						userDeviceId, email, phone, fingerprintId);
			}

			pf.reachAtTouchpoint(refTouchpointId);
			pf.updateAcquisitionChannel(touchpointRefDomain);
			pf.updateAcquisitionChannel(loginProvider);

			// TODO run in a thread
			ProfileDaoUtil.create(pf);
		} else {
			pf.reachAtTouchpoint(refTouchpointId);
			pf.updateAcquisitionChannel(touchpointRefDomain);
			pf.updateAcquisitionChannel(loginProvider);
			pf.setIdentity(loginId, loginProvider);
			pf.setPrimaryEmail(email);
			pf.setPrimaryPhone(phone);
			pf.setObserverId(observerId);
			pf.setLastTouchpointId(srcTouchpointId);
			pf.setLastSeenIp(lastSeenIp);
			pf.setLastUsedDeviceId(userDeviceId);
			pf.setUpdatedAt(new Date());

			ProfileDaoUtil.update(pf);
		}

		return pf;
	}

	public static Profile updateLoginInfo(String loginId, String loginProvider, String email, String profileId,
			String observerId, String lastTouchpointId, String lastSeenIp, String usedDeviceId) {
		Profile p = ProfileDaoUtil.getById(profileId);

		p.updateAcquisitionChannel(loginProvider);
		p.setIdentity(loginId, loginProvider);
		p.setPrimaryEmail(email);
		p.setObserverId(observerId);
		
		p.setLastSeenIp(lastSeenIp);
		p.setLastUsedDeviceId(usedDeviceId);
		p.setUpdatedAt(new Date());

		ProfileDaoUtil.update(p);
		return p;
	}

}
