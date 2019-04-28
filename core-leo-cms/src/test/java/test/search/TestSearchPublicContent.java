package test.search;

import java.util.List;

import leotech.cms.model.Post;
import leotech.system.util.seach.SearchPostUtil;

public class TestSearchPublicContent {

    public static void main(String[] args) {
	String[] keywords = new String[] {"yêu anh nhiều quá"};
	List<Post> results = SearchPostUtil.searchPublicPost(keywords, 1, 5);
	for (Post result : results) {
	    System.out.println(result.getTitle());
	}
	
    }
}
