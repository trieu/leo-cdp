package leotech.starter;

import leotech.system.HttpWorker;
import leotech.system.model.LeoPackage;
import leotech.system.util.database.SetupNewDatabase;
import rfx.core.util.Utils;

public class AdminLeoCdpStarter {
	private static final String SETUP_NEW = "setup-new";

	public static void main(String[] args) throws Exception {
		int length = args.length;
		if (length == 0) {
			//HttpWorker.start("adminApiWorker");
			HttpWorker.start("mainAdminLeoCDP");
		} else if (length == 2) {
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
	}
}
