package leotech.cms.model.renderable;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpStatus;

import leotech.cms.model.MediaNetwork;
import leotech.cms.model.Post;
import leotech.cms.service.MediaNetworkDataService;
import leotech.system.template.TemplateUtil;

public class WebData extends DefaultModel {
    
    protected String pageHeaderLogo;
    protected String baseStaticUrl ;

    protected String baseAdminApiUrl;
    protected String baseDeliveryApiUrl;

    protected String baseUploaderUrl;
    protected String baseLogCollectorUrl;

    protected int httpStatusCode = HttpStatus.SC_OK;

    protected final String host;
    protected final String templateFolder;
    protected final String templateName;

    protected List<CategoryNavigator> categoryNavigators = new ArrayList<>();
    protected List<PageNavigator> topPageNavigators = new ArrayList<>();
    protected List<PageNavigator> bottomPageNavigators = new ArrayList<>();

    protected List<Post> headlines = new ArrayList<>();
    protected List<ContentMediaBox> contentMediaBoxs = new ArrayList<>();

    protected Map<String, Object> customData = new HashMap<>();
    
    // data for meta tags in HTML
    protected String pageName = "";
    protected String pageTitle = "";
    protected String pageUrl = "";
    protected String pageImage = "";
    protected String pageDescription = "";
    protected String pageKeywords = "";

    public WebData(String host, String templateFolder, String templateName) {
	this.setBaseData(host);
	this.host = host;
	this.templateFolder = templateFolder;
	this.templateName = templateName;
	this.httpStatusCode = HttpStatus.SC_OK;
	
    }

    public WebData(String host, String templateFolder, String templateName, int statusCode) {
	this.setBaseData(host);
	this.host = host;
	this.templateFolder = templateFolder;
	this.templateName = templateName;
	this.httpStatusCode = statusCode;	
    }

    public WebData(String host, String templateFolder, String templateName, String pageTitle) {
	this.setBaseData(host);
	this.host = host;
	this.pageName = host;
	this.templateFolder = templateFolder;
	this.templateName = templateName;
	this.pageTitle = pageTitle;	
    }    

    /////////////////

    public static WebData page404(String host, String templateFolder) {
	return new WebData(host, templateFolder, "404", HttpStatus.SC_NOT_FOUND);
    }

    /////////////

    public String getPageTitle() {
	return pageTitle;
    }

    public void setPageTitle(String pageTitle) {
	this.pageTitle = pageTitle;
    }

    public String getPageName() {
        return pageName;
    }

    public void setPageName(String pageName) {
        this.pageName = pageName;
    }

    public String getPageUrl() {
        return pageUrl;
    }

    public void setPageUrl(String pageUrl) {
        this.pageUrl = pageUrl;
    }

    public String getPageImage() {
        return pageImage;
    }

    public void setPageImage(String pageImage) {
        this.pageImage = pageImage;
    }

    public String getPageDescription() {
        return pageDescription;
    }

    public void setPageDescription(String pageDescription) {
        this.pageDescription = pageDescription;
    }
    
    

    public String getPageKeywords() {
        return pageKeywords;
    }

    public void setPageKeywords(String pageKeywords) {
        this.pageKeywords = pageKeywords;
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

    public String getHost() {
	return host;
    }

    public String getTemplateFolder() {
	return templateFolder;
    }

    public String getTemplateName() {
	return templateName;
    }

    public int getHttpStatusCode() {
	return httpStatusCode;
    }

    public void setHttpStatusCode(int httpStatusCode) {
	this.httpStatusCode = httpStatusCode;
    }

    public List<CategoryNavigator> getCategoryNavigators() {
	return categoryNavigators;
    }

    public void setCategoryNavigators(List<CategoryNavigator> categoryNavigators) {
	Collections.sort(categoryNavigators);
	this.categoryNavigators = categoryNavigators;
    }

    public void addCategoryNavigator(CategoryNavigator categoryNavigator) {
	this.categoryNavigators.add(categoryNavigator);
    }

    public List<Post> getHeadlines() {
	return headlines;
    }

    public void setHeadlines(List<Post> headlines) {
	this.headlines = headlines;
    }

    public List<ContentMediaBox> getContentMediaBoxs() {
	return contentMediaBoxs;
    }

    public void setContentMediaBoxs(List<ContentMediaBox> contentMediaBoxs) {
	this.contentMediaBoxs = contentMediaBoxs;
    }

    public List<PageNavigator> getTopPageNavigators() {
	return topPageNavigators;
    }

    public void setTopPageNavigators(List<PageNavigator> topPageNavigators) {
	Collections.sort(topPageNavigators);
	this.topPageNavigators = topPageNavigators;
    }

    public void setTopPageNavigators(PageNavigator topPageNavigator) {
	this.topPageNavigators.add(topPageNavigator);
    }

    public List<PageNavigator> getBottomPageNavigators() {
	return bottomPageNavigators;
    }

    public void setBottomPageNavigators(List<PageNavigator> bottomPageNavigators) {
	this.bottomPageNavigators = bottomPageNavigators;
    }

    public Map<String, Object> getCustomData() {
	return customData;
    }

    public void setCustomData(Map<String, Object> customData) {
	this.customData = customData;
    }

    public void setCustomData(String key, Object value) {
	this.customData.put(key, value);
    }
    
    public void setBaseData(String host) {
	MediaNetwork network = MediaNetworkDataService.getContentNetwork(host);
	this.pageTitle = network.getPageTitle();
	this.baseStaticUrl = network.getBaseStaticUrl();
	this.baseDeliveryApiUrl = network.getBaseDeliveryApiUrl();
	this.baseAdminApiUrl = network.getBaseAdminApiUrl();
	this.baseUploaderUrl = network.getBaseUploaderUrl();
	this.baseLogCollectorUrl = network.getBaseLogCollectorUrl();
	this.pageHeaderLogo = network.getPageHeaderLogo();
    }

    public static String renderHtml(WebData model) {
	StringBuilder tplPath = new StringBuilder();
	tplPath.append(model.getTemplateFolder()).append("/index");
	String html = TemplateUtil.process(tplPath.toString(), model);
	if (html.equals(TemplateUtil._404)) {
	    model.setHttpStatusCode(HttpStatus.SC_NOT_FOUND);
	}
	return html;
    }

}
