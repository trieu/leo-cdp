package leotech.cdp.service;

import java.util.Date;
import java.util.List;

import com.google.gson.Gson;

import io.vertx.core.json.JsonObject;
import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.model.customer.Profile;
import leotech.cdp.model.customer.ProfileConstant;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataTablePayload;
import leotech.system.model.SystemUser;
import rfx.core.util.StringUtil;

public class ProfileDataService {

	private static final String SOCIAL_LOGIN = "social-login";
	private static final String CRM_IMPORT = "crm-import";

	public static Profile updateOrCreateFromWebTouchpoint(String observerId,String srcTouchpointId, String refTouchpointId, String touchpointRefDomain, String lastSeenIp,
			String visitorId, String userDeviceId, String fingerprintId) {
		return updateOrCreate( observerId, srcTouchpointId, refTouchpointId, touchpointRefDomain,lastSeenIp, visitorId, userDeviceId, fingerprintId, "", "", "", "");
	}
	
	public static void updateProfileFromEvent(String profileId, String observerId, String srcTouchpointId, String touchpointRefDomain, String lastSeenIp, String userDeviceId) {
		Profile pf = ProfileDaoUtil.getById(profileId);
	
		if(pf != null) {
			
			pf.engageAtTouchpointId(srcTouchpointId);
			pf.updateReferrerChannel(touchpointRefDomain);
			pf.setLastObserverId(observerId);
			pf.setLastTouchpointId(srcTouchpointId);
			pf.setLastSeenIp(lastSeenIp);
			pf.setLastUsedDeviceId(userDeviceId);
			
			// TODO run in a thread to commit to database
			ProfileDaoUtil.update(pf);
		}
	}

	public static Profile updateOrCreate( String observerId, String srcTouchpointId,
			String refTouchpointId, String touchpointRefDomain, String lastSeenIp, String visitorId,
			String userDeviceId, String fingerprintId, String email, String phone, String loginId, String loginProvider) {

		// the key function for real-time Identity Resolution into one profile
		Profile pf = ProfileDaoUtil.getByKeyIdentities(visitorId, email, phone, userDeviceId, fingerprintId);
		
		if (pf == null) {
			
			int type = ProfileConstant.TYPE_ANONYMOUS;
			if (StringUtil.isNotEmpty(email) || StringUtil.isNotEmpty(phone) || StringUtil.isNotEmpty(loginId)) {
				type = ProfileConstant.TYPE_IDENTIFIED;
			} else if (StringUtil.isNotEmpty(email) && StringUtil.isNotEmpty(phone)) {
				type = ProfileConstant.TYPE_CRM_CONTACT;
			}
			
			if (type == ProfileConstant.TYPE_ANONYMOUS) {
				pf = Profile.newAnonymousProfile( observerId, srcTouchpointId, lastSeenIp, visitorId,
						userDeviceId, fingerprintId);
			} else if (type == ProfileConstant.TYPE_IDENTIFIED) {

				pf = Profile.newIdentifiedProfile( observerId, srcTouchpointId, lastSeenIp, visitorId,
						userDeviceId, email, fingerprintId);

				if (StringUtil.isNotEmpty(loginId)) {
					pf.setIdentity(loginId, loginProvider);
				}

			} 

			pf.engageAtTouchpointId(refTouchpointId);
			pf.updateReferrerChannel(touchpointRefDomain);
			pf.updateReferrerChannel(loginProvider);

			// TODO run in a thread to commit to database
			ProfileDaoUtil.create(pf);
		} else {
			pf.engageAtTouchpointId(refTouchpointId);
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

			// TODO run in a thread to commit to database
			ProfileDaoUtil.update(pf);
		}

		return pf;
	}

	public static Profile updateSocialLoginInfo(String loginId, String loginProvider, String firstName, String lastName, String email, String phone, 
			String profileId, String observerId, String lastTouchpointId, String lastSeenIp, String usedDeviceId) {
		Profile p = ProfileDaoUtil.getById(profileId);

		p.setSocialMediaProfile(loginProvider, loginId);
		p.setIdentity(loginId, loginProvider);
		p.setType(ProfileConstant.TYPE_SOCIAL_LOGIN);
		
		if(StringUtil.isNotEmpty(firstName)) {
			p.setFirstName(firstName);
		}
		
		if(StringUtil.isNotEmpty(lastName)) {
			p.setLastName(lastName);
		}
		
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

		// TODO run in a thread to commit to database
		ProfileDaoUtil.update(p);
		return p;
	}
	
	public static List<Profile> list(int startIndex, int numberResult){
		List<Profile> list = ProfileDaoUtil.list(startIndex, numberResult);
		return list;
	}
	
	public static JsonDataTablePayload filter(DataFilter filter){
		
		//TODO caching
		return ProfileDaoUtil.filter(filter);
	}
	
	public static ProfileSingleDataView getSingleViewById(String id) {
		ProfileSingleDataView profile = ProfileDaoUtil.getSingleViewById(id);
		return profile;
	}
	
	public static Profile createNewCrmProfile(JsonObject paramJson, SystemUser loginUser) {
		String firstName = paramJson.getString("firstName", "");
		String lastName = paramJson.getString("lastName", "");
		String email = paramJson.getString("email", "");
		String phone = paramJson.getString("phone", "");
		String crmRefId = paramJson.getString("crmRefId", "");
		
		Profile pf = Profile.newCrmProfile(CRM_IMPORT, email, phone, crmRefId);
		pf.setFirstName(firstName);
		pf.setLastName(lastName);
		
		ProfileDaoUtil.create(pf);
		return pf;
	}
	
	public static Profile saveSocialLoginProfile(String email, String visitorId, String firstName, String lastName, String refId, String source,
			String observerId,String srcTouchpointId, String refTouchpointId, String touchpointRefDomain, String userDeviceId, int gender, Date createdAt) {
		
		Profile pf = ProfileDaoUtil.getByPrimaryEmail(email);
		boolean createNew = false;
		if(pf == null) {
			pf = Profile.newSocialLoginProfile(SOCIAL_LOGIN, visitorId, firstName, lastName, email, refId, source);
			createNew = true;
		} else {
			pf.setFirstName(firstName);
			pf.setLastName(lastName);
			pf.setSocialMediaProfile(source, refId);
			pf.setIdentity(visitorId);
		}
		
		// session touchpoint
		pf.engageAtTouchpointId(srcTouchpointId);
		pf.updateReferrerChannel(touchpointRefDomain);
		pf.setLastObserverId(observerId);
		pf.setLastTouchpointId(srcTouchpointId);
		pf.setLastUsedDeviceId(userDeviceId);
		pf.setUsedDeviceId(userDeviceId);
		pf.setCreatedAt(createdAt);
		pf.setUpdatedAt(createdAt);
		
		// 
		pf.setGender(gender);
		
		if(createNew) {
			ProfileDaoUtil.create(pf);
		} else {
			ProfileDaoUtil.update(pf);
		}
		
		return pf;
	}
	
	public static Profile updateSingleDataViewFromJson(String json) {
		ProfileSingleDataView dataObj = new Gson().fromJson(json, ProfileSingleDataView.class);
		
		// TODO run in a thread to commit to database
		ProfileDaoUtil.update(dataObj);
		return dataObj;
	}
	
	
	public static boolean remove(String profileId) {
		Profile pf = ProfileDaoUtil.getById(profileId);
		pf.setStatus(-4);
		
		// TODO run in a thread to commit to database
		ProfileDaoUtil.update(pf);
		return pf != null;
	}

}
