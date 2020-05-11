package leotech.starter;

import leotech.system.util.LogUtil;

public class DeliveryHttpStarter {

	public static void main(String[] args) throws Exception {
		LogUtil.setLogLevelToInfo();
		HttpWorker.start("deliveryApiWorker");
	}
}