package leotech.system.util;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.Priority;

public class CmsLogUtil {

	static final Logger defaultLog = Logger.getLogger(CmsLogUtil.class.getName());
	static final Priority priority = Level.ERROR;
	
	public static void setLogLevelToInfo() {
		defaultLog.setLevel(Level.INFO);
	}

	public static void logInfo(Object message) {
		defaultLog.info(message);
	}
	
	public static void log(Object message) {
		defaultLog.log(priority, message);
	}
	
	public static void logInfo(Class<?> clazz, Object message) {
		Logger log = Logger.getLogger(clazz.getName());
		log.info(message);
	}

}
