package leotech.starter;

import leotech.system.HttpWorker;
import leotech.system.model.LeoPackage;
import leotech.system.util.LogUtil;
import leotech.system.util.database.SetupNewDatabase;
import rfx.core.util.Utils;

public class MainHttpStarter {
	private static final String SETUP_NEW = "setup-new";

	public static void main(String[] args) throws Exception {
		LogUtil.setLogLevelToInfo();
		int length = args.length;
		if (length == 1) {
			String workerName = args[0];
			HttpWorker.start(workerName);
		} 
		else if (length == 2) {
			String command = args[0];
			String dbKey = args[1];
			if (SETUP_NEW.equalsIgnoreCase(command)) {
				// setup-new leoCdpDbConfigs
				SetupNewDatabase.createDbCollections(LeoPackage.LEO_CDP_FREE_VERSION, dbKey);
				Utils.exitSystemAfterTimeout(3000);
			} else {
				String workerName = command;
				HttpWorker.start(workerName);
			}
		}
		else {
			HttpWorker.start("mainHttpWorker");
		}
	}
}