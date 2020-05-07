package leotech.starter;

import leotech.system.util.CmsLogUtil;

public class DeliveryHttpStarter {

	public static void main(String[] args) throws Exception {
		CmsLogUtil.setLogLevelToInfo();
		HttpWorker.start("deliveryApiWorker");
	}
}