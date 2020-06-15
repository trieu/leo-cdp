package leotech.starter;

import leotech.system.HttpWorker;
import leotech.system.util.LogUtil;

public class DataObserverStarter {
	public static void main(String[] args) throws Exception {
		LogUtil.setLogLevelToInfo();
		if (args.length == 1) {
			String env = args[0];
			if ("local".equals(env)) {
				// local dev PC
				HttpWorker.start("dataObserverWorker");
			} else if ("dev".equals(env)) {
				// development server mode
				HttpWorker.start("devDataObserverWorker");
			} else if ("pro".equals(env)) {
				// production server mode
				HttpWorker.start("proDataObserverWorker");
			}
		} else {
			HttpWorker.start("dataObserverWorker");
		}
	}
}
