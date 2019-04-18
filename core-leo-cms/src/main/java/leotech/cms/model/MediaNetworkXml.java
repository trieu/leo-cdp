package leotech.cms.model;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "MediaNetworkList")
public class MediaNetworkXml {
 
    
    private List<MediaNetwork> mediaNetworks;

    
    @XmlElement(name = "MediaNetwork")
    public List<MediaNetwork> getMediaNetworks() {
	return mediaNetworks;
    }

    public MediaNetworkXml() {

    }

    public MediaNetworkXml(List<MediaNetwork> mediaNetworks) {
	this.mediaNetworks = mediaNetworks;
    }

    public void setMediaNetworks(List<MediaNetwork> mediaNetworks) {
	this.mediaNetworks = mediaNetworks;
    }
}
