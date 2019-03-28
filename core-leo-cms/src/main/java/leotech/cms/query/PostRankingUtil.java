package leotech.cms.query;

import java.util.Comparator;

import leotech.cms.model.Post;

public class PostRankingUtil {
    //TODO
    
    public static Comparator<Post> orderByTime = new Comparator<Post>() {

	@Override
	public int compare(Post o1, Post o2) {
	    if (o1.getModificationTime() > o2.getModificationTime()) {
		return 1;
	    } else if (o1.getModificationTime() < o2.getModificationTime()) {
		return -1;
	    }
	    return 0;
	}
    };
}
