package leotech.system.util;

import leotech.system.model.DeviceInfo;

public class DeviceInfoUtil {
    static String DEVICE_TYPE_PC = "General_Desktop";
    static String DEVICE_TYPE_MOBILE_WEB = "General_Mobile";
    static String DEVICE_TYPE_TABLET = "General_Tablet";

    public static DeviceInfo getDeviceInfo(String useragent) {
	DeviceInfo device = null;
	try {
	    if(useragent != null) {
		 device = DeviceParserUtil.parseWithCache(useragent);
	    }	   
	} catch (Exception e) {
	    e.printStackTrace();
	}
	if (device == null) {
	    device = new DeviceInfo("Unknown",0, "Unknown_Device", "Unknown_OS", "Unknown");
	}
	return device;
    }

}
