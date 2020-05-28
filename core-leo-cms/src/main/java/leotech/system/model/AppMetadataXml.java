package leotech.system.model;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "AppMetadataList")
public class AppMetadataXml {

	private List<AppMetadata> appMetadata;

	@XmlElement(name = "AppMetadata")
	public List<AppMetadata> getAppMetadata() {
		return appMetadata;
	}

	public AppMetadataXml() {

	}

	public AppMetadataXml(List<AppMetadata> appMetadata) {
		this.appMetadata = appMetadata;
	}

	public void setAppMetadata(List<AppMetadata> appMetadata) {
		this.appMetadata = appMetadata;
	}
}
