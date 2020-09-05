package leotech.cdp.scheduler.job;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.model.customer.Profile;
import rfx.core.job.ScheduledJob;
import rfx.core.util.StringUtil;
import rfx.core.util.Utils;

public class IdentityResolutionJob extends ScheduledJob {

	@Override
	public void doTheJob() {
		Utils.sleep(1000);
		
		int startIndex = 0;
		int numberResult = 100;
		int totalProcessed = 0;
		List<Profile> profiles = ProfileDaoUtil.listAllWithPagination(startIndex, numberResult);
		while ( ! profiles.isEmpty() ) {
			
			for (Profile pivotProfile : profiles) {
				
				// in the session of profile check and merge
				Profile bestProfile = pivotProfile;
				String id = pivotProfile.getId();
				String primaryEmail = pivotProfile.getPrimaryEmail();
				
				//TODO improve for more identity fields
				Map<String, Object> filterMap = new HashMap<String, Object>();
				filterMap.put("primaryEmail", primaryEmail);
				
				List<Profile> candidates = ProfileDaoUtil.getProfilesByFilterMap(filterMap, id);
				
				List<Profile> needToBeUnified = new ArrayList<Profile>(candidates.size());
				if(candidates.isEmpty()) {
					break;
				} 
				else {
					for (Profile candidate : candidates) {
						if(candidate.getTotalValue() > bestProfile.getTotalValue()) {
							bestProfile = candidate;
						} 
						else {
							needToBeUnified.add(candidate);
						}
					}
				}
				
				// here we have the best to unify all candidates into the One
				IdentityResolutionJob.unifyData(bestProfile, needToBeUnified, Profile.MERGED_BY_EMAIL);
				totalProcessed += needToBeUnified.size();
			}
			
			startIndex = startIndex + numberResult;
			profiles = ProfileDaoUtil.listAllWithPagination(startIndex, numberResult);
		}
		System.out.println("### Done ### IdentityResolutionJob totalProcessed= " + totalProcessed);
		
		Utils.sleep(1000);
	}
	
	/**
	 * this method is used to unify duplicated profiles into the unique profile
	 * 
	 * @param bestProfile
	 * @param needToBeUnified
	 * @param mergeCode
	 */
	public static void unifyData(Profile bestProfile, List<Profile> needToBeUnified, int mergeCode) {
		if(bestProfile != null && needToBeUnified.size()>0) {
			String rootProfileId = bestProfile.getId();
			
			for (Profile profile : needToBeUnified) {
				
				bestProfile.getTopEngagedTouchpointIds().addAll(profile.getTopEngagedTouchpointIds());
				bestProfile.getBusinessContacts().putAll(profile.getBusinessContacts());
				bestProfile.getPersonalContacts().putAll(profile.getPersonalContacts());
				bestProfile.getSocialMediaProfiles().putAll(profile.getSocialMediaProfiles());
				bestProfile.getReferrerChannels().putAll(profile.getReferrerChannels());
				bestProfile.getBusinessTransactions().addAll(profile.getBusinessTransactions());
				bestProfile.getBusinessData().putAll(profile.getBusinessData());
				
				// personal information
				if(bestProfile.getAge() == 0 && profile.getAge() > 0) {
					bestProfile.setAge(profile.getAge());
				}
				
				if(bestProfile.getGender() < 0 && profile.getGender() > 0) {
					bestProfile.setGender(profile.getGender());
				}
				
				if( StringUtil.isEmpty(bestProfile.getFirstName()) && StringUtil.isNotEmpty(profile.getFirstName())  ) {
					bestProfile.setFirstName(profile.getFirstName());
				}
				
				if( StringUtil.isEmpty(bestProfile.getLastName()) && StringUtil.isNotEmpty(profile.getLastName())  ) {
					bestProfile.setLastName(profile.getLastName());
				}
				
				//set status is merged
				profile.setStatus(Profile.STATUS_MERGED);
				profile.setMergeCode(mergeCode);
				profile.setRootProfileId(rootProfileId);
				ProfileDaoUtil.update(profile);
			}
			
			ProfileDaoUtil.update(bestProfile);
		}
	}

}

