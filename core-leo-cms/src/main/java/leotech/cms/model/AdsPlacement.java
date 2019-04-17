package leotech.cms.model;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


public class AdsPlacement {
    
    
    String id;
    
    String code;
    
    boolean isVideoAd;
    
    public AdsPlacement(String id, String code, boolean isVideoAd) {
	super();
	this.id = id;
	this.code = code;
	this.isVideoAd = isVideoAd;
    }
    
    public AdsPlacement() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public boolean isVideoAd() {
        return isVideoAd;
    }

    public void setVideoAd(boolean isVideoAd) {
        this.isVideoAd = isVideoAd;
    }

   

}
