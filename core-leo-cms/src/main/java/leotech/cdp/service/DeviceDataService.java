package leotech.cdp.service;

import io.vertx.core.MultiMap;
import leotech.cdp.router.api.TrackingApiParam;
import leotech.system.model.DeviceInfo;
import rfx.core.util.StringUtil;

public class DeviceDataService {

    public static String getDeviceId(MultiMap params, DeviceInfo device) {
	String deviceId = StringUtil.safeString(params.get(TrackingApiParam.USER_DEVICE_ID));
	// TODO
	return deviceId;
    }
}
