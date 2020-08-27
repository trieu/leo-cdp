package test.search;

import java.util.List;

import leotech.cms.model.Post;
import leotech.query.util.SearchPostUtil;

public class TestSearchPublicContent {

	public static void main(String[] args) {
		testSearch();
		
//		List<Post> posts = PostDaoUtil.listByNetwork(MediaNetwork.DEFAULT_ID, 0, Integer.MAX_VALUE);
//		LuceneSearchPostUtil.insertPostIndex(posts);

	}

	private static void testSearch() {
		String[] keywords = new String[]{" Hero"};
		List<Post> results = SearchPostUtil.searchPublicPost(keywords, 1, 5);
		for (Post result : results) {
			System.out.println(result.getTitle());
		}
	}
}
