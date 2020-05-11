package leotech.system.util;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.LoggerContext;
import org.apache.logging.log4j.core.config.Configuration;
import org.apache.logging.log4j.core.config.LoggerConfig;

import io.netty.util.internal.logging.InternalLoggerFactory;
import io.netty.util.internal.logging.Log4JLoggerFactory;

public class LogUtil {

	// private static final Logger logger =
	// LoggerFactory.getLogger(MethodHandles.lookup().lookupClass().getSimpleName());
	static {

	}

	public static void setLogLevelToInfo() {

		// System.setProperty(SimpleLogger.DEFAULT_LOG_LEVEL_KEY, "warn");
//		InternalLoggerFactory.setDefaultFactory(Log4JLoggerFactory.INSTANCE);
//		LoggerContext ctx = (LoggerContext) LogManager.getContext(false);
//		Configuration config = ctx.getConfiguration();
//		LoggerConfig loggerConfig = config.getLoggerConfig("io.netty");
//		loggerConfig.setLevel(Level.INFO);
//		ctx.updateLoggers();

	}

	public static void logInfo(Class<?> clazz, String message) {
		org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(clazz);
		log.info(message);
	}

}
