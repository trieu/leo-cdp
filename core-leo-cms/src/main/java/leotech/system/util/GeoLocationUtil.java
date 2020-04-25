package leotech.system.util;

import static io.vertx.core.http.HttpHeaders.COOKIE;

import java.io.File;
import java.net.InetAddress;
import java.net.URLDecoder;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.openlocationcode.OpenLocationCode;
import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.model.CityResponse;
import com.maxmind.geoip2.record.City;
import com.maxmind.geoip2.record.Location;

import io.netty.handler.codec.http.cookie.Cookie;
import io.netty.handler.codec.http.cookie.DefaultCookie;
import io.netty.handler.codec.http.cookie.ServerCookieDecoder;
import io.netty.handler.codec.http.cookie.ServerCookieEncoder;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.http.HttpServerResponse;
import leotech.cms.router.DeliveryApiRouter;
import leotech.system.model.GeoLocation;
import rfx.core.configs.WorkerConfigs;
import rfx.core.util.HttpRequestUtil;
import rfx.core.util.StringUtil;

public class GeoLocationUtil {

    static final int CACHE_TIME = 10;
    static final LoadingCache<String, GeoLocation> geoLocationCache = CacheBuilder.newBuilder().maximumSize(9000000)
	    .expireAfterWrite(CACHE_TIME, TimeUnit.MINUTES).build(new CacheLoader<String, GeoLocation>() {
		public GeoLocation load(String ip) {
		    return findGeoLocation(ip);
		}
	    });

    public static final String COOKIE_DOMAIN = "";//TODO
    public static final String COOKIE_LOCATION_ID = "leogeoid";
    public static final String COOKIE_LOCATION_CITY = "leogeoname";

    static String pathGeoIP = WorkerConfigs.load().getCustomConfig("pathGeoIP");
    static DatabaseReader mmdbReader = null;
    static {
	try {
	    // A File object pointing to your GeoIP2 or GeoLite2 database
	    File database = new File(pathGeoIP);
	    mmdbReader = new DatabaseReader.Builder(database).build();
	} catch (Exception e) {
	    e.printStackTrace();
	}
    }

    public static final String getCityLocation(String ip) {
	DatabaseReader reader = mmdbReader;
	String rs = "";
	if (reader != null) {
	    try {
		InetAddress ipAddress = InetAddress.getByName(ip);
		CityResponse response = mmdbReader.city(ipAddress);
		City city = response.getCity();
		// System.out.println(city.getName());
		rs = city.getGeoNameId() + "__" + city.getName();
	    } catch (Exception e) {
		e.printStackTrace();
	    }
	}
	return rs;
    }

    public static GeoLocation getValueFromCookie(HttpServerRequest req) {
	GeoLocation loc = new GeoLocation();
	String cookieString = req.headers().get(COOKIE);
	// System.out.println(cookieString);
	if (cookieString != null) {
	    try {
		cookieString = URLDecoder.decode(cookieString, "UTF-8");
		Set<Cookie> cookies = ServerCookieDecoder.LAX.decode(cookieString);
		// System.out.println("cookies "+cookies);
		for (Cookie cookie : cookies) {
		    String name = cookie.name();
		    if (name.equals(COOKIE_LOCATION_ID)) {
			int id = StringUtil.safeParseInt(cookie.value());
			loc.setGeoNameId(id);
		    } else if (name.equals(COOKIE_LOCATION_CITY)) {
			String v = StringUtil.safeString(cookie.value());
			loc.setCityName(v);
		    }
		}
	    } catch (Exception e) {
		e.printStackTrace();
	    }
	}
	return loc;
    }

    public static GeoLocation processCookieGeoLocation(HttpServerRequest req, HttpServerResponse resp) {
	GeoLocation loc = getValueFromCookie(req);
	if (loc.getGeoNameId() == 0) {
	    String ip = RequestInfoUtil.getRemoteIP(req);
	    loc = getGeoLocation(ip);

	    Cookie cookie = new DefaultCookie(COOKIE_LOCATION_ID, String.valueOf(loc.getGeoNameId()));
	    cookie.setHttpOnly(false);
	    cookie.setMaxAge(DeliveryApiRouter.COOKIE_AGE_1_WEEK);
	    cookie.setPath("/");
	    cookie.setDomain(COOKIE_DOMAIN);
	    resp.headers().add("Set-Cookie", ServerCookieEncoder.LAX.encode(cookie));

	    Cookie cookie2 = new DefaultCookie(COOKIE_LOCATION_CITY, String.valueOf(loc.getCityName()));
	    cookie2.setHttpOnly(false);
	    cookie2.setMaxAge(DeliveryApiRouter.COOKIE_AGE_1_WEEK);
	    cookie2.setPath("/");
	    cookie2.setDomain(COOKIE_DOMAIN);
	    resp.headers().add("Set-Cookie", ServerCookieEncoder.LAX.encode(cookie2));
	}
	return loc;
    }

    public static final int getGeoNameId(String ip) {
	DatabaseReader reader = mmdbReader;
	int geoNameId = 0;
	if (reader != null) {
	    try {
		InetAddress ipAddress = InetAddress.getByName(ip);
		CityResponse response = mmdbReader.city(ipAddress);
		City city = response.getCity();
		System.out.println(city.getName());
		geoNameId = city.getGeoNameId();
	    } catch (Exception e) {
		e.printStackTrace();
	    }
	}
	return geoNameId;
    }

    public static final GeoLocation getGeoLocation(String ip) {
	try {
	    if (!ip.equals("127.0.0.1")) {
		return geoLocationCache.get(ip);
	    }
	} catch (ExecutionException e) {
	    e.printStackTrace();
	}
	return new GeoLocation("", 1566083);
    }

    public static final GeoLocation findGeoLocation(String ip) {
	GeoLocation geoLoc = new GeoLocation("", 0);
	try {
	    InetAddress ipAddress = InetAddress.getByName(ip);
	    CityResponse response = mmdbReader.city(ipAddress);
	    if (response != null) {
		City city = response.getCity();
		if (city.getGeoNameId() != null) {
		    geoLoc.setCityName(city.getName());
		    geoLoc.setGeoNameId(city.getGeoNameId());
		    Location location = response.getLocation();
		    geoLoc.setLatitude(location.getLatitude());
		    geoLoc.setLongitude(location.getLongitude());
		    
		    String locationCode = OpenLocationCode.encode(location.getLatitude(), location.getLongitude());
		    geoLoc.setLocationCode(locationCode);

		    geoLoc.setCountry(response.getCountry().getName());
		}
	    }
	} catch (Throwable e) {
	    e.printStackTrace();
	}
	return geoLoc;
    }

    public static void main(String[] args) throws Exception {

	System.out.println(getGeoLocation("14.161.21.142"));
    }
}
