package leotech.cms.model.renderable;

import java.util.List;

import leotech.cms.model.Post;

public class ContentMediaBox {

    ContentNavigator navigator;
    List<Post> posts;

    public ContentMediaBox(ContentNavigator navigator, List<Post> posts) {
	super();
	this.navigator = navigator;
	this.posts = posts;
    }

    public ContentNavigator getNavigator() {
	return navigator;
    }

    public void setNavigator(ContentNavigator navigator) {
	this.navigator = navigator;
    }

    public List<Post> getPosts() {
	return posts;
    }

    public void setPosts(List<Post> posts) {
	this.posts = posts;
    }

}
