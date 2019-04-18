package leotech.starter;

import leotech.system.util.CmsLogUtil;

public class MainHttpStarter {

    public static void main(String[] args) throws Exception {
	CmsLogUtil.setLogLevelToInfo();
	System.out.println(args[0]);
	if (args.length == 1) {
	    String workerName = args[0];
	    HttpWorker.start(workerName);
	} else {
	    HttpWorker.start("mainHttpWorker");
	}
    }
}