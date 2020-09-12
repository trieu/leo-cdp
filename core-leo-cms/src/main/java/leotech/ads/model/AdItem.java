package leotech.ads.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import rfx.core.util.DateTimeUtil;

@Deprecated
public abstract class AdItem {

	// pricing model
	public static final int PRICING_MODEL_CPV = 1;// Cost per True View (6
													// seconds)
	public static final int PRICING_MODEL_CPM = 2;// Cost per Mile (1000
													// impressions)
	public static final int PRICING_MODEL_CPC = 3;// Cost Per Click
	public static final int PRICING_MODEL_CPE = 4;// Cost Per Engagement
													// (downloading, searching
													// or booking,...)
	public static final int PRICING_MODEL_CPD = 5;// Cost Per Day
	public static final int PRICING_MODEL_CPL = 6;// Cost Per Lead



	@Expose
	// @Id
	protected Integer id;

	@Expose(serialize = false)
//	@Indexed
	// @Property("crtDate")
	protected Date createdDate;// created date

	@Expose(serialize = false)
	// @Indexed(IndexDirection.DESC)
	// @Property("runDate")
	protected Date runDate;// running date

	@Expose
	@SerializedName("name")
	// @Indexed
	protected String name = "";

	@Expose
	@SerializedName("desc")
	// @Property("desc")
	protected String description = "";

	@Expose
	@SerializedName("cliName")
	// @Indexed
	// @Property("cliName")
	protected String clientName;

	@Expose
	@SerializedName("crtDateL")

	protected long createdDateLong;

	@Expose
	@SerializedName("runDateL")

	protected long runDateLong;

	// ----------------------- booking data ---------------------------

	@Expose
	@SerializedName("adType")

	protected int adType = 0;

	@Expose
	@SerializedName("prcModel")
	// @Indexed
	// @Property("prcModel")
	protected int pricingModel;

	@Expose
	@SerializedName("tBk")
	// @Property("tBk")
	protected int totalBooking;

	@Expose
	@SerializedName("dBk")
	// @Property("dBk")
	protected int dailyBooking;

	@Expose
	@SerializedName("hBk")
	// @Property("hBk")
	protected int hourlyBooking;

	@Expose
	@SerializedName("tBg")
	// @Property("tBg")
	protected long totalBudget;

	// ----------------------- filtering ad fields ---------------------------
	@Expose
	@SerializedName("tgpfs")
//	@Indexed
	// @Property("tgpfs")
	protected List<Integer> targetedPlatforms; // for filter by platforms :
												// mobile, tablet or desktop PC

	@Expose
	@SerializedName("tgdvos")
	// @Indexed
	// @Property("tgdvos")
	protected List<String> targetedOperatingSystem; // for query by device OS:
													// iOS, Android, WebOS,
													// Tizen, MacOS,
	// Windows,...

	@Expose
	@SerializedName("tgdvs")
	// @Indexed
	// @Property("tgdvs")
	protected List<String> targetedDevices; // for query by device: iPhone,
											// iPad, Samsung, ...

	@Expose
	@SerializedName("tgbrs")
	// @Indexed
	// @Property("tgbrs")
	protected List<String> targetedBrowsers; // for query by browser: Chrome,
												// Chrome Mobile, Safari, Chrome
												// Webview,
	// ....

	@Expose
	@SerializedName("tgpms")
	// @Indexed
	// @Property("tgpms")
	protected List<Integer> targetedPlacements; // for query by placements

	@Expose
	@SerializedName("pmadfms")
	// @Indexed
	// @Property("pmadfms")
	protected Map<Integer, Integer> placementAdFormats; // for publisher billing

	/**
	 * for Dayparts filtering: by specific time of day. Syntax: ["evd-09h", "evd-20h"] means everyday at 09:00 and 20:00 
	 * or ["30052018-20h"] means at 30 May 2018 at 20:00
	 */
	@Expose
	@SerializedName("tgdps")
	// @Indexed
	// @Property("tgdps")
	protected List<String> targetedDayParts;

	@Expose
	@SerializedName("tgisp")
	// @Indexed
	// @Property("tgisp")
	protected List<String> targetedISP; // for query by IP

	// ----------------------- boosting ad fields ---------------------------

	@Expose
	@SerializedName("tgcats")
	// @Indexed
	// @Property("tgcats")
	protected List<String> contentTopics; // IAB keyword for URL Topic

	@Expose
	@SerializedName("tginkws")
	// @Indexed
	// @Property("tginkws")
	protected List<String> includedKeywords; // positive keywords for better KPI

	@Expose
	@SerializedName("tgexkws")
	// @Indexed
	// @Property("tgexkws")
	protected List<String> excludedKeywords; // negative keywords for
												// brand-safety

	@Expose
	@SerializedName("tglocs")
	// @Indexed
	// @Property("tglocs")
	protected List<String> geoLocations; // geo locations

	@Expose
	@SerializedName("tgsegs")
	// @Indexed
	// @Property("tgsegs")
	protected List<String> audienceSegments; // audience segments of DMP

	@Expose
	@SerializedName("adformat")
	// @Indexed
	// @Property("adformat")
	protected int targetedAdFormat; // for query by ad format

	public void initDates() {
		long time = DateTimeUtil.currentUnixTimestamp();
		if (this.createdDate != null) {
			this.createdDateLong = this.createdDate.getTime();
		} else {
			this.createdDateLong = time;
		}

		if (this.runDate != null) {
			this.runDateLong = this.runDate.getTime();
		} else {
			this.runDateLong = time;
		}
	}

	protected void initDates(long creationUnixtime, long runUnixtime) {
		this.createdDate = new Date(creationUnixtime * 1000L);
		this.runDate = new Date(runUnixtime * 1000L);

		this.createdDateLong = createdDate.getTime();
		this.runDateLong = runDate.getTime();
	}

	public AdItem() {
		super();
		long time = DateTimeUtil.currentUnixTimestamp();
		initDates(time, time);
	}

	public AdItem(int id, String name, int creationUnixtime, int runUnixtime) {
		super();
		this.id = id;
		this.name = name;
		initDates(creationUnixtime, runUnixtime);
	}

	public AdItem(Integer id, String name, Date createdDate, Date runDate) {
		super();
		this.id = id;
		this.name = name;
		initDates(createdDate.getTime(), runDate.getTime());
	}

	public AdItem(Integer id, String name, String clientName, Date createdDate, Date runDate) {
		super();
		this.id = id;
		this.name = name;
		this.clientName = clientName;
		initDates(createdDate.getTime(), runDate.getTime());
	}

	public Integer getId() {
		return id;
	}

	public int getPricingModel() {
		return pricingModel;
	}

	public Date getRunDate() {
		if (runDate == null && runDateLong > 0) {
			this.runDate = new Date(runDateLong);
		}
		return runDate;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public String getClientName() {
		return clientName;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public void setPricingModel(int pricingModel) {
		this.pricingModel = pricingModel;
	}

	public void setRunDate(Date runDate) {
		this.runDateLong = runDate.getTime();
		this.runDate = new Date(runDateLong);
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDateLong = createdDate.getTime();
		this.createdDate = new Date(createdDateLong);
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

	public long getCreatedDateLong() {
		setCreatedDateLong();
		return createdDateLong;
	}

	public long getRunDateLong() {
		setRunDateLong();
		return runDateLong;
	}

	protected void setCreatedDateLong() {
		this.createdDateLong = createdDate.getTime();
	}

	protected void setRunDateLong() {
		if (runDate != null) {
			this.runDateLong = runDate.getTime();
		}
	}

	public List<Integer> getTargetedPlatforms() {
		if (targetedPlatforms == null) {
			targetedPlatforms = new ArrayList<>(0);
		}
		return targetedPlatforms;
	}

	public void setTargetedPlatforms(List<Integer> targetedPlatforms) {
		this.targetedPlatforms = targetedPlatforms;
	}

	public void setCreatedDateLong(long createdDateLong) {
		this.createdDateLong = createdDateLong;
	}

	public void setRunDateLong(long runDateLong) {
		if (runDateLong > 0) {
			this.runDateLong = runDateLong;
			this.runDate = new Date(runDateLong);
		}
	}

	public List<Integer> getTargetedPlacements() {
		if (targetedPlacements == null) {
			targetedPlacements = new ArrayList<>(0);
		}
		return targetedPlacements;
	}

	public void setTargetedPlacements(List<Integer> targetedPlacements) {
		this.targetedPlacements = targetedPlacements;
	}

	public List<String> getGeoLocations() {
		if (geoLocations == null) {
			this.geoLocations = new ArrayList<>(0);
		}
		return geoLocations;
	}

	public void setGeoLocations(List<String> targetedLocations) {
		this.geoLocations = targetedLocations;
	}

	public void setAdType(int adType) {
		this.adType = adType;
	}

	public int getAdType() {
		return this.adType;
	}

	public int getTotalBooking() {
		return totalBooking;
	}

	public void setTotalBooking(int totalBooking) {
		this.totalBooking = totalBooking;
	}

	public int getDailyBooking() {
		return dailyBooking;
	}

	public int getHourlyBooking() {
		return hourlyBooking;
	}

	public void setTotalBookingInCPM(int totalBooking) {
		this.totalBooking = totalBooking * 1000;
	}

	public void setDailyBooking(int dailyBooking) {
		this.dailyBooking = dailyBooking;
	}

	public void setHourlyBooking(int hourlyBooking) {
		this.hourlyBooking = hourlyBooking;
	}

	public void setHourlyBookingInCPM(int hourlyBooking) {
		this.hourlyBooking = hourlyBooking * 1000;
	}

	public long getTotalBudget() {
		return totalBudget;
	}

	public void setTotalBudget(long totalBudget) {
		this.totalBudget = totalBudget;
	}

	public List<String> getExcludedKeywords() {
		if (excludedKeywords == null) {
			excludedKeywords = new ArrayList<>(0);
		}
		return excludedKeywords;
	}

	public void setExcludedKeywords(List<String> exludedKeywords) {
		this.excludedKeywords = exludedKeywords;
	}

	public List<String> getAudienceSegments() {
		if (audienceSegments == null) {
			audienceSegments = new ArrayList<>(0);
		}
		return audienceSegments;
	}

	public void setAudienceSegments(List<String> targetedSegments) {
		this.audienceSegments = targetedSegments;
	}

	public List<String> getTargetedBrowsers() {
		if (targetedBrowsers == null) {
			targetedBrowsers = new ArrayList<>(0);
		}
		return targetedBrowsers;
	}

	public void setTargetedBrowsers(List<String> targetedBrowsers) {
		this.targetedBrowsers = targetedBrowsers;
	}

	public List<String> getTargetedISP() {
		if (targetedISP == null) {
			targetedISP = new ArrayList<>(0);
		}
		return targetedISP;
	}

	public void setTargetedISP(List<String> targetedISP) {
		this.targetedISP = targetedISP;
	}

	public List<String> getTargetedDevices() {
		if (targetedDevices == null) {
			targetedDevices = new ArrayList<>(0);
		}
		return targetedDevices;
	}

	public void setTargetedDevices(List<String> targetedDevices) {
		this.targetedDevices = targetedDevices;
	}

	public List<String> getContentTopics() {
		if (contentTopics == null) {
			contentTopics = new ArrayList<>(0);
		}
		return contentTopics;
	}

	public void setContentTopics(List<String> targetedTopics) {
		this.contentTopics = targetedTopics;
	}

	public List<String> getIncludedKeywords() {
		if (includedKeywords == null) {
			includedKeywords = new ArrayList<>(0);
		}
		return includedKeywords;
	}

	public void setIncludedKeywords(List<String> includedKeywords) {
		this.includedKeywords = includedKeywords;
	}

	public List<String> getTargetedDayParts() {
		if (targetedDayParts == null) {
			targetedDayParts = new ArrayList<>(0);
		}
		return targetedDayParts;
	}

	public void setTargetedDayParts(List<String> targetedDayParts) {
		this.targetedDayParts = targetedDayParts;
	}

	public List<String> getTargetedOperatingSystem() {
		if (targetedOperatingSystem == null) {
			targetedOperatingSystem = new ArrayList<>(0);
		}
		return targetedOperatingSystem;
	}

	public void setTargetedOperatingSystem(List<String> targetedOperatingSystem) {
		this.targetedOperatingSystem = targetedOperatingSystem;
	}

	public Map<Integer, Integer> getPlacementAdFormats() {
		if (placementAdFormats == null) {
			placementAdFormats = new HashMap<>(0);
		}
		return placementAdFormats;
	}

	public void setPlacementAdFormats(Map<Integer, Integer> placementAdFormats) {
		this.placementAdFormats = placementAdFormats;
	}

	public int getTargetedAdFormat() {
		return targetedAdFormat;
	}

	public void setTargetedAdFormat(int targetedAdFormat) {
		this.targetedAdFormat = targetedAdFormat;
	}

	public String toJson(Gson gson) {
		return gson.toJson(this);
	}

	public String toJson() {
		setCreatedDateLong();
		setRunDateLong();
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		return toJson(gson);
	}

//	@PrePersist
	public void prePersist() {
		this.createdDate = (createdDate == null) ? new Date() : createdDate;
		this.runDate = (runDate == null) ? new Date() : runDate;
	}

	@Override
	public String toString() {
		return new Gson().toJson(this);
	}
}
