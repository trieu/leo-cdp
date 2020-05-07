package leotech.starter;

import leotech.system.util.database.SetupNewDatabase;
import rfx.core.util.Utils;

public class AdminApiHttpStarter {
	private static final String SETUP_NEW_CMS = "setup-new-cms";

	public static void main(String[] args) throws Exception {
		int length = args.length;
		if (length == 0) {
			HttpWorker.start("adminApiWorker");
		} else if (length == 2) {
			String command = args[0];
			String dbKey = args[1];
			if (SETUP_NEW_CMS.equalsIgnoreCase(command)) {
				SetupNewDatabase.createDbCollections("cms",dbKey);
				Utils.exitSystemAfterTimeout(3000);
			} else {
				String workerName = command;
				HttpWorker.start(workerName);
			}
		}
	}
}
