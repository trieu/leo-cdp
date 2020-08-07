package leotech.cdp.model.marketing;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

public class EmailMessage {

	String fromEmailAddress;
	String toEmailAddress;
	String profileName;
	String profileId;
	String subject;
	String content;
	List<String> attachments = new ArrayList<>();
	
	public EmailMessage(String fromEmailAddress, String toEmailAddress, String profileName, String profileId, String subject, String content) {
		super();
		this.fromEmailAddress = fromEmailAddress;
		this.toEmailAddress = toEmailAddress;
		this.profileName = profileName;
		this.profileId = profileId;
		this.subject = subject;
		this.content = content;
	}
	
	@Override
	public String toString() {
		return new Gson().toJson(this);
	}


	public String getFromEmailAddress() {
		return fromEmailAddress;
	}


	public void setFromEmailAddress(String fromEmailAddress) {
		this.fromEmailAddress = fromEmailAddress;
	}


	public String getToEmailAddress() {
		return toEmailAddress;
	}


	public void setToEmailAddress(String toEmailAddress) {
		this.toEmailAddress = toEmailAddress;
	}


	public String getProfileName() {
		return profileName;
	}


	public void setProfileName(String profileName) {
		this.profileName = profileName;
	}


	public String getProfileId() {
		return profileId;
	}


	public void setProfileId(String profileId) {
		this.profileId = profileId;
	}


	public String getSubject() {
		return subject;
	}


	public void setSubject(String subject) {
		this.subject = subject;
	}


	public String getContent() {
		return content;
	}


	public void setContent(String content) {
		this.content = content;
	}


	public List<String> getAttachments() {
		return attachments;
	}


	public void setAttachments(List<String> attachments) {
		this.attachments = attachments;
	}
	
	
	
	
}
