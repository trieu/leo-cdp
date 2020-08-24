package leotech.system.model;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;

import com.google.gson.Gson;

import leotech.cms.model.ContentClassPostQuery;
import rfx.core.util.HashUtil;
import rfx.core.util.StringUtil;

@XmlAccessorType(XmlAccessType.FIELD)
public class AppMetadata {

	public static final long DEFAULT_ID = 10000L;

	@XmlElement(name = "appId")
	long appId = DEFAULT_ID;

	@XmlElement(name = "name")
	String name = ""; // Big Data Vietnam Content Network

	@XmlElement(name = "uri")
	String uri = ""; //

	// data for website and progressive web app
	@XmlElement(name = "domain")
	String domain = ""; // bigdatavietnam.org

	@XmlElement(name = "WebTemplateFolder")
	String webTemplateFolder = ""; // e.g: bigdatavietnam

	// data for native app on mobile devices (Android, iOS)
	@XmlElement(name = "AndroidAppId")
	String androidAppId = ""; // e.g: bigdatavietnam-org

	@XmlElement(name = "IosAppId")
	String iosAppId = "";

	@XmlElement(name = "AppTemplateFolder")
	String appTemplateFolder = ""; // bigdatavietnam/app like web

	// --------------------------------------------
	@XmlElement(name = "ContentCategoryId")
	String contentCategoryId = "";

	@XmlElement(name = "PublicContentClass")
	String publicContentClass = "";

	@XmlElementWrapper(name = "ContentClassPostQueries")
	@XmlElement(name = "ContentClassPostQuery")
	List<ContentClassPostQuery> contentClassPostQueries;

	@XmlElement(name = "PageTitle")
	String pageTitle = "Leo CDP";

	@XmlElement(name = "PageHeaderLogo")
	String pageHeaderLogo = "/public/images/leotech-logo.png";

	@XmlElement(name = "BaseStaticUrl")
	String baseStaticUrl = "//leoplatform.net";

	@XmlElement(name = "BaseAdminApiUrl")
	String baseAdminApiUrl = "//leoplatform.net";

	@XmlElement(name = "BaseDeliveryApiUrl")
	String baseDeliveryApiUrl = "//api.leoplatform.net";

	@XmlElement(name = "BaseUploaderUrl")
	String baseUploaderUrl = "//uploader.leoplatform.net";

	@XmlElement(name = "BaseLogCollectorUrl")
	String baseLogCollectorUrl = "//log.leoplatform.net";

	@XmlElement(name = "AdsTxtContent")
	String adsTxtContent = "";

	@XmlElement(name = "GoogleTrackingId")
	String googleTrackingId = "";

	@XmlElement(name = "NumberSimilarPostsInList")
	int numberSimilarPostsInList = 7;

	public AppMetadata() {
	}

	public AppMetadata(String name, String uri, String domain, String webTemplateFolder) {
		super();
		this.name = name;
		this.uri = uri;
		this.domain = domain;
		this.webTemplateFolder = webTemplateFolder;

		if (!uri.equals("admin")) {
			this.appId = hashToNetworkId(domain);
		}
	}

	public static long hashToNetworkId(String domain) {
		return DEFAULT_ID + HashUtil.hashUrl128Bit(domain);
	}

	public long getAppId() {
		return appId;
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

	public void setAppId(long appId) {
		this.appId = appId;
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

	public List<ContentClassPostQuery> getContentClassPostQueries() {
		return contentClassPostQueries;
	}

	public void setContentClassPostQueries(List<ContentClassPostQuery> contentClassPostQueries) {
		this.contentClassPostQueries = contentClassPostQueries;
	}

	public String getContentCategoryId() {
		return contentCategoryId;
	}

	public void setContentCategoryId(String contentCategoryId) {
		this.contentCategoryId = contentCategoryId;
	}

	public String getPageTitle() {
		return pageTitle;
	}

	public void setPageTitle(String pageTitle) {
		this.pageTitle = pageTitle;
	}

	public String getPageHeaderLogo() {
		return pageHeaderLogo;
	}

	public void setPageHeaderLogo(String pageHeaderLogo) {
		this.pageHeaderLogo = pageHeaderLogo;
	}

	public String getBaseStaticUrl() {
		return baseStaticUrl;
	}

	public void setBaseStaticUrl(String baseStaticUrl) {
		this.baseStaticUrl = baseStaticUrl;
	}

	public String getBaseAdminApiUrl() {
		return baseAdminApiUrl;
	}

	public void setBaseAdminApiUrl(String baseAdminApiUrl) {
		this.baseAdminApiUrl = baseAdminApiUrl;
	}

	public String getBaseDeliveryApiUrl() {
		return baseDeliveryApiUrl;
	}

	public void setBaseDeliveryApiUrl(String baseDeliveryApiUrl) {
		this.baseDeliveryApiUrl = baseDeliveryApiUrl;
	}

	public String getBaseUploaderUrl() {
		return baseUploaderUrl;
	}

	public void setBaseUploaderUrl(String baseUploaderUrl) {
		this.baseUploaderUrl = baseUploaderUrl;
	}

	public String getBaseLogCollectorUrl() {
		return baseLogCollectorUrl;
	}

	public void setBaseLogCollectorUrl(String baseLogCollectorUrl) {
		this.baseLogCollectorUrl = baseLogCollectorUrl;
	}

	public String getAdsTxtContent() {
		return adsTxtContent;
	}

	public void setAdsTxtContent(String adsTxtContent) {
		this.adsTxtContent = adsTxtContent;
	}

	public String getGoogleTrackingId() {
		return googleTrackingId;
	}

	public void setGoogleTrackingId(String googleTrackingId) {
		this.googleTrackingId = googleTrackingId;
	}

	public int getNumberSimilarPostsInList() {
		return numberSimilarPostsInList;
	}

	public void setNumberSimilarPostsInList(int numberSimilarPostsInList) {
		this.numberSimilarPostsInList = numberSimilarPostsInList;
	}

	public List<String> getPublicContentClassList() {
		if (StringUtil.isEmpty(publicContentClass)) {
			publicContentClass = "standard";
		}
		String[] toks = publicContentClass.split(",");
		List<String> contentClasses = new ArrayList<String>(toks.length);
		for (int i = 0; i < toks.length; i++) {
			contentClasses.add(toks[i]);
		}
		return contentClasses;
	}

	public void setPublicContentClass(String publicContentClass) {
		this.publicContentClass = publicContentClass;
	}

	@Override
	public String toString() {
		return new Gson().toJson(this);
	}

}
