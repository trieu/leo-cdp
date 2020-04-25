package leotech.cms.query;

import java.util.Arrays;
import java.util.List;

import leotech.cms.model.Post;
import redis.clients.jedis.ShardedJedisPool;
import rfx.core.configs.RedisConfigs;

/**
 * Ad Data Query Util, data from MongoDB, for delivery
 * 
 * https://s3-ap-southeast-1.amazonaws.com/xemgiday-video-playlist/_home.json?cb=1540629641070
 * 
 * @author trieu
 *
 */
public class ContentQueryUtil {
    
    static ShardedJedisPool masterCacheRedis = RedisConfigs.load().get("masterCache").getShardedJedisPool();
    static ShardedJedisPool localCacheRedis = RedisConfigs.load().get("localCache").getShardedJedisPool();
   
 
    public static List<Post> queryPost(ContentQuery q) {
	//TODO
	Post d = new Post("Secret Garden Songs","https://www.youtube.com/embed/PaoPzDW2m2A",1,"");
	Post d2 = new Post("HongKong1 | OFFICIAL MV | Nguyễn Trọng Tài x San Ji x Double X","https://www.youtube.com/watch?v=t7tZFq29lis",1,"");
	Post d5 = new Post("Chuyện Tình Lướt Qua - Hong Kong 1 - Nguyễn Trọng Tài (Nguyễn Anh Cover)","https://www.youtube.com/embed/82D9N6ah2tg",1,"");
	
	Post d3 = new Post("The Greatest Showman Full Soundtrack Complete OST FULL OST","https://www.facebook.com/xemgiday.tv/videos/1764726960495574/",1,"");
	Post d4 = new Post("Mind Of | Beautiful Chill Mix","https://www.youtube.com/watch?v=YUIgPRQNjEA",1,"");
	
	List<Post> posts = Arrays.asList(d,d2,d3,d4,d5);
	
	//List<Post> posts = PostDaoUtil.listByNetwork(2, 0, 50);
	return posts;
    }


}