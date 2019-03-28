package leotech.crawler.job;

import java.util.Queue;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.atomic.AtomicBoolean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import leotech.cms.model.bot.ContentBot;
import leotech.crawler.model.YouTubeContentBot;
import redis.clients.jedis.ShardedJedisPool;
import redis.clients.jedis.exceptions.JedisException;
import rfx.core.configs.RedisConfigs;
import rfx.core.nosql.jedis.RedisCommand;
import rfx.core.nosql.jedis.Subscriber;
import rfx.core.util.StringUtil;
import rfx.core.util.Utils;

public class YouTubeCrawlerCronJob {

    private static final String KILL_SYSTEM_MESSAGE = "_kill_system";
    static ShardedJedisPool jedisPool = RedisConfigs.load().get("clusterInfoRedis").getShardedJedisPool();
    static final int NUMBER_CRAWLING_WORKER = 2;
    static Logger logger = LoggerFactory.getLogger(YouTubeCrawlerCronJob.class);
    static Queue<ContentBot> contentBots = new LinkedBlockingQueue<>();
    static AtomicBoolean killSystem = new AtomicBoolean(false);
    static final String CHANNEL_NAME = "youtube-crawler";

    static final int SCHEDULED_TIME = 5000;
    static final Timer timer = new Timer(true);

    public static void startCronJob() {
	System.out.println("startCronJob...");

	for (int i = 1; i <= NUMBER_CRAWLING_WORKER; i++) {
	    long delay = 1000 * i;
	    timer.schedule(new TimerTask() {
		@Override
		public void run() {
		    ContentBot bot = contentBots.poll();
		    if (bot != null) {
			bot.process();
		    }
		}
	    }, delay, SCHEDULED_TIME);
	}

	new Thread(new Runnable() {
	    @Override
	    public void run() {
		Subscriber subscriber = new Subscriber() {
		    @Override
		    public void onMessage(String channel, String message) {
			System.out.println("onMessage: " + channel + " " + message);
			if (channel.equals(CHANNEL_NAME) && StringUtil.isNotEmpty(message)) {
			    if (message.equals(KILL_SYSTEM_MESSAGE)) {
				killSystem.set(true);
			    } else {
				contentBots.add(new YouTubeContentBot(message));
			    }
			}
		    }
		};
		(new RedisCommand<Void>(jedisPool) {
		    @Override
		    public Void build() throws JedisException {
			try {
			    logger.info("Subscribing to \"" + CHANNEL_NAME + "\". This thread will be blocked.");
			    jedis.subscribe(subscriber, CHANNEL_NAME);
			} catch (Exception e) {
			    e.printStackTrace();
			}
			return null;
		    }
		}).execute();
	    }
	}).start();

	while (killSystem.get() == false) {
	    Utils.sleep(2000);
	}

	contentBots.clear();
	timer.cancel();

	Utils.exitSystemAfterTimeout(10444);
    }

    public static void main(String[] args) {
	startCronJob();
    }

}
