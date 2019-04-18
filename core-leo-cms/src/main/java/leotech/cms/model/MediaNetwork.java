package leotech.cms.model;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;

import com.arangodb.ArangoCollection;
import com.google.gson.Gson;

import leotech.cms.model.common.PersistentArangoObject;
import rfx.core.util.HashUtil;


@XmlAccessorType(XmlAccessType.FIELD)
public class MediaNetwork implements PersistentArangoObject {

    public static final long DEFAULT_ID = 10000L;

    @XmlElement(name = "networkId")
    long networkId = DEFAULT_ID; // unique ID

    @XmlElement(name = "name")
    String name = ""; // Big Data Vietnam Content Network
    
    @XmlElement(name = "uri")
    String uri = ""; // http://leocloudcms.com/bigdatavietnam-org

    // data for website and progressive web app
    @XmlElement(name = "domain")
    String domain = ""; // bigdatavietnam.org

    @XmlElement(name = "WebTemplateFolder")
    String webTemplateFolder = ""; // bigdatavietnam/web

    // data for native app on mobile devices (Android, iOS)
    @XmlElement(name = "AndroidAppId")
    String androidAppId = ""; // bigdatavietnam-org
    
    @XmlElement(name = "IosAppId")
    String iosAppId = "";
    
    @XmlElement(name = "AppTemplateFolder")
    String appTemplateFolder = ""; // bigdatavietnam/app like web

    @XmlElementWrapper(name = "AdsPlacements") 
    @XmlElement(name = "AdsPlacement")
    List<AdsPlacement> adsPlacements;

    public MediaNetwork() {
    }

    public MediaNetwork(String name, String uri, String domain, String webTemplateFolder) {
	super();
	this.name = name;
	this.uri = uri;
	this.domain = domain;
	this.webTemplateFolder = webTemplateFolder;

	if (!uri.equals("admin")) {
	    this.networkId = hashToNetworkId(domain);
	}
    }

    public static long hashToNetworkId(String domain) {
	return DEFAULT_ID + HashUtil.hashUrl128Bit(domain);
    }

    public long getNetworkId() {
	return networkId;
    }

    public String getName() {
	return name;
    }

    public void setName(String name) {
	this.name = name;
    }

    public String getUri() {
	return uri;
    }

    public void setUri(String uri) {
	this.uri = uri;
    }

    public String getDomain() {
	return domain;
    }

    public void setDomain(String domain) {
	this.domain = domain;
    }

    public void setNetworkId(long networkId) {
	this.networkId = networkId;
    }

    public String getWebTemplateFolder() {
	return webTemplateFolder;
    }

    public void setWebTemplateFolder(String webTemplateFolder) {
	this.webTemplateFolder = webTemplateFolder;
    }

    public String getAndroidAppId() {
	return androidAppId;
    }

    public void setAndroidAppId(String androidAppId) {
	this.androidAppId = androidAppId;
    }

    public String getIosAppId() {
	return iosAppId;
    }

    public void setIosAppId(String iosAppId) {
	this.iosAppId = iosAppId;
    }

    public String getAppTemplateFolder() {
	return appTemplateFolder;
    }

    public void setAppTemplateFolder(String appTemplateFolder) {
	this.appTemplateFolder = appTemplateFolder;
    }

    @Override
    public ArangoCollection getCollection() {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public boolean isReadyForSave() {
	// TODO Auto-generated method stub
	return false;
    }

    public List<AdsPlacement> getAdsPlacements() {
        return adsPlacements;
    }

    public void setAdsPlacements(List<AdsPlacement> adsPlacements) {
        this.adsPlacements = adsPlacements;
    }

    @Override
    public String toString() {
        // TODO Auto-generated method stub
        return new Gson().toJson(this);
    }
    
}
