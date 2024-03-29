package leotech.system.model;

import com.google.gson.Gson;

public class GeoLocation {

	String cityName;
	int geoNameId = 0;
	String country;
	double latitude, longitude;
	String ip;
	String locationCode;

	public GeoLocation(String cityName, int geoNameId) {
		super();
		this.cityName = cityName;
		this.geoNameId = geoNameId;
	}

	public GeoLocation() {
		this.cityName = "";
		this.geoNameId = 0;
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

	public int getGeoNameId() {
		return geoNameId;
	}

	public void setGeoNameId(int geoNameId) {
		this.geoNameId = geoNameId;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public String getLocationCode() {
		return locationCode;
	}

	public void setLocationCode(String locationCode) {
		this.locationCode = locationCode;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	@Override
	public String toString() {
		return new Gson().toJson(this);
	}

}
