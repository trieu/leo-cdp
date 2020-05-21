package leotech.cdp.service;

import java.util.Date;
import java.util.List;

import io.vertx.core.json.JsonObject;
import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.model.audience.Profile;
import leotech.cms.model.User;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataTablePayload;
import rfx.core.util.StringUtil;

public class ProfileDataService {

	private static final String CRM_IMPORT = "crm-import";

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
	
	public static List<Profile> list(int startIndex, int numberResult){
		List<Profile> list = ProfileDaoUtil.list(startIndex, numberResult);
		return list;
	}
	
	public static JsonDataTablePayload filter(DataFilter filter){
		JsonDataTablePayload rs  = ProfileDaoUtil.filter(filter);
		//TODO caching
		return rs;
	}
	
	public static Profile getById(String id) {
		Profile profile = ProfileDaoUtil.getById(id);
		return profile;
	}
	
	public static Profile createNewCrmProfile(JsonObject paramJson, User loginUser) {
		
		String firstName = paramJson.getString("firstName", "");
		String lastName = paramJson.getString("lastName", "");
		String email = paramJson.getString("email", "");
		String phone = paramJson.getString("phone", "");
		
		Profile pf = Profile.newCrmProfile( CRM_IMPORT, "", "", "","", email, phone, "");
		pf.setFirstName(firstName);
		pf.setLastName(lastName);
		ProfileDaoUtil.create(pf);
		return pf;
	}
	
	public static Profile update(JsonObject paramJson, User loginUser) {
		String profileId = paramJson.getString("profileId", "");
		Profile pf = ProfileDaoUtil.getById(profileId);
		
		String firstName = paramJson.getString("firstName", "");
		String lastName = paramJson.getString("lastName", "");
		String email = paramJson.getString("email", "");
		String phone = paramJson.getString("phone", "");
		
		
		if(!firstName.isEmpty()) {
			pf.setLastName(firstName);
		}
		
		if(!lastName.isEmpty()) {
			pf.setLastName(lastName);
		}
		
		if(!email.isEmpty()) {
			pf.setPrimaryEmail(email);
		}
		
		if(!phone.isEmpty()) {
			pf.setPrimaryPhone(phone);
		}
		
		//TODO
		ProfileDaoUtil.update(pf);
		return pf;
	}
	
	public static boolean disable(JsonObject paramJson, User loginUser) {
		String profileId = paramJson.getString("profileId", "");
		Profile pf = ProfileDaoUtil.getById(profileId);
		pf.setStatus(-1);
		ProfileDaoUtil.update(pf);
		return pf != null;
	}

}
