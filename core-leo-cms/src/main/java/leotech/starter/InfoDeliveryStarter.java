package leotech.starter;

import leotech.system.HttpWorker;
import leotech.system.util.LogUtil;

public class InfoDeliveryStarter {

	public static void main(String[] args) throws Exception {
		LogUtil.setLogLevelToInfo();
		if (args.length == 1) {
			String workerName = args[0];
			HttpWorker.start(workerName);
		} else {
			HttpWorker.start("infoDeliveryApiWorker");
		}
	}
}