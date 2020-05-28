package leotech.cms.query;

import java.util.ArrayList;
import java.util.List;

import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.Post;
import leotech.system.model.AppMetadata;

public class SearchPostUtil {
	
	public static List<Post> searchPost(String[] keywords, int startIndex,int num){
		//TODO
		return new ArrayList<Post>(0);
	}
	
	public static List<Post> searchPost(String[] keywords, boolean includeProtected, boolean includePrivate, int startIndex,int num){
		//TODO
		return new ArrayList<Post>(0);
	}
	
	
	
	public static List<Post> searchPublicPost(String[] keywords, int startIndex,int num){
		//TODO
		return new ArrayList<Post>(0);
	}
	
	
	
	public static void doPostIndexing(Post post) {
		//TODO
	}
	
	public static int indexing() {
		//TODO
		List<Post> posts = PostDaoUtil.listByNetwork(AppMetadata.DEFAULT_ID, 0, Integer.MAX_VALUE);
		return posts.size();
	}
	
	public static boolean deletePostIndex(String id) {
		return true;
	}
	public static boolean updateIndexedPost(Post post) {
		return true;
	}
	
	public static boolean insertPostIndex(Post post) {
		return true;
	}
	

}
