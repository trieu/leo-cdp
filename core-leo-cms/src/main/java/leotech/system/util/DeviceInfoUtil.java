package leotech.system.util;



import java.util.Date;

import leotech.cdp.model.customer.Device;
import leotech.system.model.DeviceInfo;

public class DeviceInfoUtil {
	

	public static DeviceInfo getDeviceInfo(String useragent) {
		DeviceInfo device = null;
		try {
			if (useragent != null) {
				device = DeviceParserUtil.parseWithCache(useragent);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (device == null) {
			device = new DeviceInfo("Unknown", 0, "Unknown_Device", "Unknown_OS", "", "Unknown");
		}
		return device;
	}
	
	public static Device getUserDevice(String useragent) {
		return new Device(getDeviceInfo(useragent));
	}
	
	public static Device getUserDevice(String useragent, Date createdAt) {
		return new Device(getDeviceInfo(useragent), createdAt);
	}
	
	public static Device getUserDevice(DeviceInfo dv, Date createdAt) {
		return new Device(dv, createdAt);
	}

}
