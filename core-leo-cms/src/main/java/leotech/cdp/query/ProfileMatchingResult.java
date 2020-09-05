package leotech.cdp.query;

import java.util.ArrayList;
import java.util.List;

import leotech.cdp.model.customer.Profile;

public class ProfileMatchingResult {
	
	List<Profile> deterministic;
	List<Profile> probabilistic;
	
	public ProfileMatchingResult() {
		// TODO Auto-generated constructor stub
	}
	
	public List<Profile> getDeterministic() {
		if(deterministic == null) {
			deterministic = new ArrayList<Profile>(0);
		}
		return deterministic;
	}
	public void setDeterministic(List<Profile> deterministic) {
		this.deterministic = deterministic;
	}
	public List<Profile> getProbabilistic() {
		if(probabilistic == null) {
			probabilistic = new ArrayList<Profile>(0);
		}
		return probabilistic;
	}
	public void setProbabilistic(List<Profile> probabilistic) {
		this.probabilistic = probabilistic;
	}
	
	public Profile getBestMatchingProfile() {
		//FIXME 
		
		List<Profile> deterministicProfiles = getDeterministic();
		//List<Profile> probabilisticProfiles = getProbabilistic();
		
		if(deterministicProfiles.size()>0) {
			return deterministicProfiles.get(0);
		} 
//		else if(probabilisticProfiles.size()>0) {
//			return probabilisticProfiles.get(0);
//		}
		
		return null;
	}

}
