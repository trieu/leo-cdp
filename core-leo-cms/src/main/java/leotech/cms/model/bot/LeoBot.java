package leotech.cms.model.bot;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.Post;
import rfx.core.configs.WorkerConfigs;
import rfx.core.util.StringUtil;

public class LeoBot extends ReactiveBot {

	private static final int NUMBER_SIMILAR_POSTS_IN_LIST = StringUtil
			.safeParseInt(WorkerConfigs.load().getCustomConfig("NUMBER_SIMILAR_POSTS_IN_LIST"), 10);
	List<Post> recommendedPosts = new ArrayList<>();
	String currentPostId = "";

	public LeoBot(List<String> contextPageIds, String postId) {
		super();
		if (contextPageIds != null) {
			this.subscribedPageIds.addAll(contextPageIds);
		}
		currentPostId = postId;
	}

	public List<Post> getRecommendedPosts() {
		return recommendedPosts;
	}

	public void setRecommendedPosts(List<Post> recommendedPosts) {
		this.recommendedPosts = recommendedPosts;
	}

	@Override
	public void process() {
		findSimilarPostsFromPage();
	}

	protected void findSimilarPostsFromPage() {
		for (String pageId : subscribedPageIds) {
			List<Post> posts = PostDaoUtil.listAllByPage(pageId).stream().filter(post -> {
				return !post.getId().equals(currentPostId);
			}).collect(Collectors.toList());

			if (posts.size() > NUMBER_SIMILAR_POSTS_IN_LIST) {
				Collections.shuffle(posts);
				posts = posts.subList(0, NUMBER_SIMILAR_POSTS_IN_LIST);
			}

			recommendedPosts.addAll(posts);
		}
	}

}
