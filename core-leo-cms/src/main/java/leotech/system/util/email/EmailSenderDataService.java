package leotech.system.util.email;

import leotech.cdp.model.activation.EmailMessage;
import redis.clients.jedis.ShardedJedisPool;
import redis.clients.jedis.exceptions.JedisException;
import rfx.core.configs.RedisConfigs;
import rfx.core.nosql.jedis.RedisCommand;

public class EmailSenderDataService {

	final public static ShardedJedisPool pubSubQueue = RedisConfigs.load().get("pubSubQueue").getShardedJedisPool();
	static String channel = "leocdp_email_queue";
	
	
	public static long pushToRedisPubSubQueue(EmailMessage emailMsg) {
		String message = emailMsg.toString();
		long rs = new RedisCommand<Long>(pubSubQueue) {
			@Override
			protected Long build() throws JedisException {
				return jedis.publish(channel, message);
			}
		}.execute();
		return rs;
	}

}
