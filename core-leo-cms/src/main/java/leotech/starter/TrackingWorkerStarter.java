package leotech.starter;

import leotech.system.util.CmsLogUtil;

public class TrackingWorkerStarter {
	public static void main(String[] args) throws Exception {
		CmsLogUtil.setLogLevelToInfo();
		HttpWorker.start("dataTrackingWorker");
	}
}
