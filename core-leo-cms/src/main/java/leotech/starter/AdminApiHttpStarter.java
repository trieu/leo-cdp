package leotech.starter;

import leotech.system.util.database.SetupNewDatabase;
import rfx.core.util.Utils;

public class AdminApiHttpStarter {
    private static final String SETUP_NEW_CMS = "setup-new-cms";

    public static void main(String[] args) throws Exception {
	int length = args.length;
	if (length == 0) {
	    HttpWorker.start("adminApiWorker");
	} else if (length == 1) {
	    if (SETUP_NEW_CMS.equalsIgnoreCase(args[0])) {
		SetupNewDatabase.setupCoreLeoCmsCollections();
		Utils.exitSystemAfterTimeout(3000);
	    } else {
		String workerName = args[0];
		HttpWorker.start(workerName);
	    }
	}
    }
}
