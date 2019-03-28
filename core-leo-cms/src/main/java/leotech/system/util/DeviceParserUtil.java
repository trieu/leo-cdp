package leotech.system.util;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import leotech.system.model.DeviceInfo;
import rfx.core.util.useragent.Client;
import rfx.core.util.useragent.Parser;

public class DeviceParserUtil {

    public static final String SMART_TV_LG = "SmartTV-LG";
    public static final String SMART_TV_SAMSUNG = "SmartTV-Samsung";
    public static final String SMART_TV_SONY = "SmartTV-Sony";
    public static final String DEVICE_TYPE_PC = "General_Desktop";
    public static final String DEVICE_TYPE_MOBILE_WEB = "General_Mobile";
    public static final String DEVICE_TYPE_TABLET = "General_Tablet";
    public static final String DEVICE_ANDROID = "Android";

    public final static int PC = 1;
    public final static int MOBILE_WEB = 2;
    public final static int TABLET = 3;
    public final static int NATIVE_APP = 4;
    public final static int SMART_TV = 5;

    public static int getPlatformId(Client client, boolean isNativeApp) {
	if (isNativeApp) {
	    return NATIVE_APP;
	}
	return getDeviceType(client);
    }

    public static int getDeviceType(Client client) {
	String p = client.device.deviceType();
	if (DEVICE_TYPE_PC.equals(p)) {
	    return PC;
	} else if (DEVICE_TYPE_MOBILE_WEB.equals(p)) {
	    return MOBILE_WEB;
	} else if (DEVICE_TYPE_TABLET.equals(p)) {
	    return TABLET;
	}
	return PC;
    }

    public static final class DeviceUserContext {
	public String useragent;

	public DeviceUserContext(String useragent) {
	    super();
	    this.useragent = useragent;
	}

	@Override
	public int hashCode() {

	    return (useragent != null ? useragent : "").hashCode();
	}
    }

    static LoadingCache<DeviceUserContext, DeviceInfo> deviceInfoCache = CacheBuilder.newBuilder().maximumSize(5000)
	    .expireAfterWrite(7, TimeUnit.DAYS).build(new CacheLoader<DeviceUserContext, DeviceInfo>() {
		public DeviceInfo load(DeviceUserContext deviceUserContext) {
		    DeviceInfo dv = parse(deviceUserContext);
		    // saveDeviceInfo(dv);
		    return dv;
		}
	    });

    public static DeviceInfo parse(DeviceUserContext deviceUserContext) {
	String useragent = deviceUserContext.useragent;
	Client uaClient = Parser.load().parse(useragent);
	int deviceType = PC;
	String deviceName = "PC";
	String deviceOs = uaClient.os.family;

	deviceType = getDeviceType(uaClient);
	deviceName = uaClient.device.family.split(" ")[0];
	String browserName = uaClient.userAgent.family;

	return new DeviceInfo(deviceType, deviceName, deviceOs, browserName);
    }

    public static DeviceInfo parseWithCache(String useragent) throws ExecutionException {
	DeviceUserContext k = new DeviceUserContext(useragent);
	DeviceInfo v = deviceInfoCache.get(k);
	return v;
    }

}
