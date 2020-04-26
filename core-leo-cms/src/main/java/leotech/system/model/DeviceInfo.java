package leotech.system.model;

import com.google.gson.Gson;

import rfx.core.util.StringUtil;

public class DeviceInfo {
    public final int platformType;
    public final String deviceName;
    public final String deviceType;
    public final String deviceOs;
    public final String browserName;

    public final int id;

    public DeviceInfo(String deviceType, int platformType, String deviceName, String deviceOs, String browserName) {
	super();
	this.deviceType = deviceType;
	this.platformType = platformType;
	this.deviceName = deviceName;
	this.deviceOs = deviceOs;
	this.browserName = browserName;
	this.id = hashCode();
    }

    @Override
    public int hashCode() {
	return StringUtil.toString(platformType, deviceName, deviceOs, browserName).hashCode();
    }

    @Override
    public String toString() {
	return new Gson().toJson(this);
    }
}
