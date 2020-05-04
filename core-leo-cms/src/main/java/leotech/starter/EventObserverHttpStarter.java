package leotech.starter;

import leotech.system.util.CmsLogUtil;

public class EventObserverHttpStarter {
	public static void main(String[] args) throws Exception {
		CmsLogUtil.setLogLevelToInfo();
		if (args.length == 1) {
			String workerName = args[0];
			HttpWorker.start(workerName);
		} else {
			HttpWorker.start("eventObserverWorker");
		}
	}
}
