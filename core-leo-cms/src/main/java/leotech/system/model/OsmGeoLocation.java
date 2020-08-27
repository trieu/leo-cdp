package leotech.system.model;

/**
 * for API of openstreetmap <br>
 * E.g https://nominatim.openstreetmap.org/reverse?format=json&lat=59.9358091&lon=30.3126222
 * 
 * @author tantrieuf31
 *
 */
public class OsmGeoLocation {
	
	public static final class  Address {
		String road = "";
		String state= "";
		String region= "";
		String country= "";
		String country_code= "";
		String suburb = "";
		
		public Address() {
			// TODO Auto-generated constructor stub
		}
		
		public String getRoad() {
			return road;
		}
		public void setRoad(String road) {
			this.road = road;
		}
		public String getState() {
			return state;
		}
		public void setState(String state) {
			this.state = state;
		}
		public String getRegion() {
			return region;
		}
		public void setRegion(String region) {
			this.region = region;
		}
		public String getCountry() {
			return country;
		}
		public void setCountry(String country) {
			this.country = country;
		}
		public String getCountry_code() {
			return country_code;
		}
		public void setCountry_code(String country_code) {
			this.country_code = country_code;
		}

		public String getSuburb() {
			return suburb;
		}

		public void setSuburb(String suburb) {
			this.suburb = suburb;
		}
			
	}

	String place_id = "";
	String lat= "";
	String lon= "";
	String display_name= "";
	Address address = new Address();
	
	
	public OsmGeoLocation() {
		
	}
	
	public String getLocationName() {
		return this.display_name;
	}

	public String getPlace_id() {
		return place_id;
	}

	public void setPlace_id(String place_id) {
		this.place_id = place_id;
	}
	
	public String getLat() {
		return lat;
	}

	public void setLat(String lat) {
		this.lat = lat;
	}

	public String getLon() {
		return lon;
	}

	public void setLon(String lon) {
		this.lon = lon;
	}

	public String getDisplay_name() {
		return display_name;
	}

	public void setDisplay_name(String display_name) {
		this.display_name = display_name;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}
	
	
}
