package leotech.cms.dao;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import leotech.cms.model.MediaNetwork;

@XmlRootElement(name = "MediaNetworks")
public class MediaNetworkDao {

    private List<MediaNetwork> mediaNetworks;

    public List<MediaNetwork> getMediaNetworks() {
	return mediaNetworks;
    }
    
    public MediaNetworkDao() {
	// TODO Auto-generated constructor stub
    }

    public void setMediaNetworks(List<MediaNetwork> mediaNetworks) {
	this.mediaNetworks = mediaNetworks;
    }

    public static MediaNetwork getByKey(String key) {
	return null;
    }

    public static String save(MediaNetwork mediaNetwork) {
	return "";
    }
}
