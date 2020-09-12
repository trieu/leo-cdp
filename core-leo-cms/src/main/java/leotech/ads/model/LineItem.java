package leotech.ads.model;

import java.util.Date;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import rfx.core.util.DateTimeUtil;

/**
 * @author tantrieuf31 <br>
 * 
 *         Line Item is delivered to Internet audience
 */
// @Entity(value = "creative", noClassnameStored = true)
@Deprecated
public class LineItem extends AdItem {

	// Line Item Types
	public final static int TYPE_SPONSORSHIP = 1;
	public final static int TYPE_STANDARD = 2;
	public final static int TYPE_AD_NETWORK = 3;
	public final static int TYPE_BULK = 4;
	public final static int TYPE_PRICE_PRIORITY = 5;
	public final static int TYPE_HOUSE = 6;
	public final static int TYPE_CLICK_TRACKING = 7;
	public final static int TYPE_HEADER_BIDDING = 8;

	
	// popular ad duration time for Preroll-TVC
	public static final String TIME_00_00_30 = "00:00:30";
	public static final String TIME_00_00_15 = "00:00:15";
	public static final String TIME_00_00_05 = "00:00:05";
	public static final String TIME_00_00_06 = "00:00:06";
	public static final String TIME_00_00_00 = "00:00:00";

	@Expose
	@SerializedName("orderId")
	// @Indexed
	// @Property("orderId")
	private int orderId = 0;

	@Expose
	@SerializedName("status")
	// @Indexed
	private int status = AdStatus.ADSTATUS_PAUSED;// 0 is invalid, 1 is pending, 2 is
											// running, 4 is expired or
											// over-booking

	@Expose
	@SerializedName("cost")
	// @Indexed
	// @Property("cost")
	private int cost;

	@Expose
	@SerializedName("score")
	// @Indexed(IndexDirection.DESC)
	protected int score = 10;// 0 to unlimit

	@Expose(serialize = false)
	// @Indexed
	// @Property("expDate")
	protected Date expiredDate;// expired date

	@Expose
	@SerializedName("expDateL")

	protected long expiredDateLong;

	@Expose
	@SerializedName("skip")
	// @Property("skip")
	protected String skipoffset = TIME_00_00_05;

	@Expose
	@SerializedName("dura")
	// @Property("dura")
	protected String duration = TIME_00_00_15;

	@Expose
	@SerializedName("staTime")
	// @Property("staTime")
	protected String startTime = TIME_00_00_00;

	@Expose
	@SerializedName("cliThr")
	// @Property("cliThr")
	protected String clickThrough = "";

	@Expose
	@SerializedName("flId")
	// @Indexed
	// @Property("flId")
	protected int flightId;

	@Expose
	@SerializedName("w")
	// @Indexed
	// @Property("w")
	protected int width;

	@Expose
	@SerializedName("h")
	// @Indexed
	// @Property("h")
	protected int height;

	@Expose
	@SerializedName("fqcCap")
	// @Property("fqcCap")
	protected int frequencyCapping; // limit the maximum number of impressions
									// within a period of time

	@Expose
	@SerializedName("capPer")
	// @Property("capPer")
	protected int cappingPeriod = 0; // 0 = daily, 1 = weekly, 2 = monthly

	@Expose
	@SerializedName("media")
	// @Property("media")
	protected String media = "";

	@Expose
	@SerializedName("is3rdAd")
	// @Property("is3rdAd")
	protected boolean thirdPartyAd = false;

	@Expose
	@SerializedName("vastXml3rd")
	// @Property("vastXml3rd")
	protected String vastXml3rd = "";

	@Expose
	@SerializedName("discount")
	// @Property("discount")
	protected double discount = 0;

	@Expose
	@SerializedName("bid")
	// @Indexed
	// @Property("bid")
	protected double bidPrice;

	@Expose
	@SerializedName("dealId")
	// @Indexed
	// @Property("dealId")
	protected String dealId;

	@Expose
	@SerializedName("advId")
	// @Property("advId")
	// @Indexed
	private int advertiserId = 0;

	@Expose
	@SerializedName("totalRevenue")

	protected double totalRevenue = 0;

	@Expose
	@SerializedName("litypes")
	// @Indexed
	// @Property("litypes")
	protected int deliveryType = TYPE_HOUSE;

	@Expose
	// @Indexed
	private Date updatedDate; // modification time

	@Expose
	@SerializedName("crtId")
	// @Indexed
	// @Property("crtId")
	protected String creativeMediaId;

	protected void initDates(long creationUnixtime, long runUnixtime, long expireUnixtime) {
		this.createdDate = new Date(creationUnixtime);
		this.runDate = new Date(runUnixtime);
		this.expiredDate = new Date(expireUnixtime);

		this.createdDateLong = createdDate.getTime();
		this.runDateLong = runDate.getTime();
		this.expiredDateLong = expiredDate.getTime();
	}

	public LineItem() {
		super();
		long time = DateTimeUtil.currentUnixTimestamp();
		this.createdDate = new Date(time * 1000L);
		this.createdDateLong = createdDate.getTime();
		this.status = AdStatus.ADSTATUS_PENDING;
	}

	public void validateDataAfterJsonDeserialization() {
		if (this.runDateLong > 0 && this.runDate == null) {
			this.runDate = new Date(this.runDateLong);
		} else if (this.runDate == null) {
			this.runDate = new Date();
		}
		if (this.expiredDate == null) {
			this.expiredDate = new Date();
		}
	}

	public LineItem(int id, String name, String mediaFile, String clickThrough, boolean is3rdAd, int creationUnixtime,
			int runUnixtime, int expireUnixtime) {
		super();
		this.id = id;
		this.name = name;
		this.media = mediaFile;
		this.clickThrough = clickThrough;
		this.thirdPartyAd = is3rdAd;
		initDates(creationUnixtime * 1000L, runUnixtime * 1000L, expireUnixtime * 1000L);
	}

	public LineItem(Integer id, String name, String mediaFile, String clickThrough, boolean is3rdAd, Date createdDate,
			Date runDate, Date expiredDate) {
		super();
		this.id = id;
		this.name = name;
		this.media = mediaFile;
		this.clickThrough = clickThrough;
		this.thirdPartyAd = is3rdAd;
		initDates(createdDate.getTime(), runDate.getTime(), expiredDate.getTime());
	}

	public LineItem(Integer id, String name, String mediaFile, String clientName, Date createdDate, Date runDate,
			Date expiredDate) {
		super();
		this.id = id;
		this.name = name;
		this.media = mediaFile;
		this.clientName = clientName;
		initDates(createdDate.getTime(), runDate.getTime(), expiredDate.getTime());
	}

	public void computeRevenue() {
		if (this.pricingModel == 1) { // CPM
			this.totalRevenue = Math
					.round(Math.ceil((this.cost + (0.1 * this.cost)) * this.totalBooking * (1 - this.discount)));
		} else if (this.pricingModel == 2) { // CPV
			this.totalRevenue = Math
					.round(Math.ceil((this.cost + (0.1 * this.cost)) * this.totalBooking * (1 - this.discount)));
		} else if (this.pricingModel == 5) { // CPD
			this.totalRevenue = 0;
		}
	}

	public int getOrderId() {
		return orderId;
	}

	public int getStatus() {
		return status;
	}

	public int getScore() {
		return score;
	}

	public String getSkipoffset() {
		return skipoffset;
	}

	public String getDuration() {
		return duration;
	}

	public String getClickThrough() {
		return clickThrough;
	}

	public String getMedia() {
		return media;
	}

	public int getFlightId() {
		return flightId;
	}

	public int getFrequencyCapping() {
		return frequencyCapping;
	}

	public int getCappingPeriod() {
		return cappingPeriod;
	}

	public void setCappingPeriod(int cappingPeriod) {
		this.cappingPeriod = cappingPeriod;
	}

	public void setOrderId(int orderId) {
		this.orderId = orderId;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	@Override
	public void setAdType(int adType) {
		this.adType = adType;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		if (startTime != null) {
			this.startTime = startTime;
		}
	}

	public void setScore(int score) {
		this.score = score;
	}

	public void setExpiredDate(Date expiredDate) {
		this.expiredDateLong = expiredDate.getTime();
		this.expiredDate = new Date(expiredDateLong);
	}

	public Date getExpiredDate() {
		if (this.expiredDate == null && expiredDateLong > 0) {
			this.expiredDate = new Date(expiredDateLong);
		}
		return this.expiredDate;
	}

	private void setExpiredDateLong() {
		if (expiredDate != null) {
			this.expiredDateLong = expiredDate.getTime();
		}
	}

	public void setSkipoffset(String skipoffset) {
		this.skipoffset = skipoffset;
	}

	public void setDuration(String duration) {
		this.duration = duration;
	}

	public void setClickThrough(String clickThrough) {
		this.clickThrough = clickThrough;
	}

	public void setMedia(String media) {
		this.media = media;
	}

	public void setCampaignId(int campaignId) {
		this.orderId = campaignId;
	}

	public void setFlightId(int flightId) {
		this.flightId = flightId;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public boolean isThirdPartyAd() {
		return thirdPartyAd;
	}

	public void setThirdPartyAd(boolean thirdPartyAd) {
		this.thirdPartyAd = thirdPartyAd;
	}

	public String getVastXml3rd() {
		return vastXml3rd;
	}

	public void setVastXml3rd(String vastXml3rd) {
		this.vastXml3rd = vastXml3rd;
	}

	public int getCost() {
		return cost;
	}

	public void setCost(int cost) {
		this.cost = cost;
	}

	public void setFrequencyCapping(int frequencyCapping) {
		this.frequencyCapping = frequencyCapping;
	}

	public long getExpiredDateLong() {
		return expiredDateLong;
	}

	public double getTotalRevenue() {
		if (totalRevenue <= 0) {
			computeRevenue();
		}
		return totalRevenue;
	}

	public void setTotalRevenue(double totalRevenue) {
		this.totalRevenue = totalRevenue;
	}

	public double getBidPrice() {
		return bidPrice;
	}

	public void setBidPrice(double bidPrice) {
		this.bidPrice = bidPrice;
	}

	public String getDealId() {
		if (dealId == null) {
			return "hd1li-" + this.id;
		}
		return dealId;
	}

	public void setDealId(String dealId) {
		this.dealId = dealId;
	}

	public double getDiscount() {
		return discount;
	}

	public void setDiscount(double discount) {
		this.discount = discount;
	}

	public void setExpiredDateLong(long expiredDateLong) {
		this.expiredDateLong = expiredDateLong;
		this.expiredDate = new Date(expiredDateLong);
	}

	public boolean isTvcPrerollAd() {
		return TIME_00_00_00.equals(this.startTime);
	}

	public boolean isTvcMidrollAd() {
		return !isTvcPrerollAd();
	}

	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public int getDeliveryType() {
		return deliveryType;
	}

	public void setDeliveryType(int deliveryType) {
		this.deliveryType = deliveryType;
	}

	public int getAdvertiserId() {
		return advertiserId;
	}

	public void setAdvertiserId(int advertiserId) {
		this.advertiserId = advertiserId;
	}

	public String getCreativeMediaId() {
		return creativeMediaId;
	}

	public void setCreativeMediaId(String creativeMediaId) {
		this.creativeMediaId = creativeMediaId;
	}

	@Override
	public String toJson(Gson gson) {
		return gson.toJson(this);
	}

	@Override
	public String toJson() {
		setCreatedDateLong();
		setRunDateLong();
		setExpiredDateLong();
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		return toJson(gson);
	}

	@Override
	// @PrePersist
	public void prePersist() {
		this.createdDate = (createdDate == null) ? new Date() : createdDate;
		this.runDate = (runDate == null) ? new Date() : runDate;
	}

	@Override
	public String toString() {
		return new Gson().toJson(this);
	}
}
