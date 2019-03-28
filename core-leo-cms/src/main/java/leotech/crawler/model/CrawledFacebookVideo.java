package leotech.crawler.model;

import java.util.List;

import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.google.gson.Gson;

public class CrawledFacebookVideo {
    @DocumentField(Type.KEY)
    protected String key;
    
    String title;
    String url;
    
    List<String> keywords;
    SocialStatistics socialStatistics;

    public CrawledFacebookVideo(String title, String url) {
	super();
	
	this.title = title;
	this.url = url;
    }

    public String getKey() {
	return key;
    }

    public void setKey(String key) {
	this.key = key;
    }


    public String getTitle() {
	return title;
    }

    public void setTitle(String title) {
	this.title = title;
    }

    public String getUrl() {
	return url;
    }

    public void setUrl(String url) {
	this.url = url;
    }

    @Override
    public String toString() {
	return new Gson().toJson(this);
    }
}
