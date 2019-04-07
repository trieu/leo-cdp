package leotech.cms.model.renderable;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import leotech.cms.model.Post;

public class PostDataModel extends WebPageDataModel {

    private boolean isAdminRole = false;
    private String sessionUserId = "";
    private final List<Post> posts;
    private List<Post> recommendedPosts;
    private String contextPageId;
    

    public PostDataModel(String host, String templateFolder, String templateName, String pageTitle, List<Post> posts) {
	super(host, templateFolder, templateName, pageTitle);
	this.posts = posts;
    }

    public PostDataModel(String host, String templateFolder, String templateName, String pageTitle, Post post) {
	super(host, templateFolder, templateName, pageTitle);
	this.posts = Arrays.asList(post);
    }

    public List<Post> getPosts() {
	return posts;
    }

    public List<Post> getRecommendedPosts() {
	if (recommendedPosts == null) {
	    recommendedPosts = new ArrayList<Post>(0);
	}
	return recommendedPosts;
    }

    public void setRecommendedPosts(List<Post> recommendedPosts) {
	this.recommendedPosts = recommendedPosts;
    }

    public boolean isAdminRole() {
	return isAdminRole;
    }

    public void setAdminRole(boolean isAdminRole) {
	this.isAdminRole = isAdminRole;
    }

    public String getSessionUserId() {
        return sessionUserId;
    }

    public void setSessionUserId(String sessionUserId) {
        this.sessionUserId = sessionUserId;
    }   

    public String getContextPageId() {
        return contextPageId;
    }

    public void setContextPageId(String contextPageId) {
        this.contextPageId = contextPageId;
    }

    
    
}
