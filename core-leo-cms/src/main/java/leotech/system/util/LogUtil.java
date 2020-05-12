package leotech.system.util;

public class LogUtil {

	// private static final Logger logger =
	// LoggerFactory.getLogger(MethodHandles.lookup().lookupClass().getSimpleName());
	static {

	}

	public static void setLogLevelToInfo() {

		//System.setProperty(org.slf4j.impl.SimpleLogger.DEFAULT_LOG_LEVEL_KEY, "Info");

	}

	public static void logInfo(Class<?> clazz, String message) {
		org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(clazz);
		log.info(message);
	}

}
