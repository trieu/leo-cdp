package net.adsplay.common;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by trieu on 10/30/16.
 */
public class AdData {

    public static final int ADTYPE_IMAGE_DISPLAY_AD = 6;// static banner: jpeg, gif, png
    public static final int ADTYPE_VIDEO_INPAGE_AD = 7;//Video Popup Ad in Content Marketing
    public static final int ADTYPE_MASTER_HEAD_AD = 11;//master head for mobile app
    public static final int ADTYPE_INFEED_AD = 12;//infeed for mobile app

    protected String media;
    protected String clickthroughUrl;
    protected String clickActionText;
    protected String title;
    protected int adId;
    protected String adBeacon;
    protected int adType = 0;
    protected int width = 0;
    protected int height = 0;
    protected int placementId = 0;
    protected String adCode = "";
    protected List<String> tracking3rdUrls = new ArrayList<>();

    public AdData(int adId, String media, String title, String clickthroughUrl) {
        this.adId = adId;
        this.media = media;
        this.title = title;
        this.clickthroughUrl = clickthroughUrl;
    }

    public AdData(int adId, String media, String clickthroughUrl) {
        this.adId = adId;
        this.media = media;
        this.clickthroughUrl = clickthroughUrl;
        this.title = "";
    }

    public int getAdId() {
        return adId;
    }

    public void setAdId(int adId) {
        this.adId = adId;
    }

    public String getMedia() {
        return media;
    }

    public String getTitle() {
        return title;
    }

    public void setMedia(String media) {
        this.media = media;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getClickthroughUrl() {
        return clickthroughUrl;
    }

    public void setClickthroughUrl(String clickthroughUrl) {
        this.clickthroughUrl = clickthroughUrl;
    }

    public String getClickActionText() {
        return clickActionText;
    }

    public void setClickActionText(String clickActionText) {
        this.clickActionText = clickActionText;
    }

    public String getAdBeacon() {
        return adBeacon;
    }

    public void setAdBeacon(String adBeacon) {
        this.adBeacon = adBeacon;
    }

    public int getAdType() {
        return adType;
    }

    public void setAdType(int adType) {
        this.adType = adType;
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

    public int getPlacementId() {
        return placementId;
    }

    public void setPlacementId(int placementId) {
        this.placementId = placementId;
    }

    public String getAdCode() {
        return adCode;
    }

    public void setAdCode(String adCode) {
        this.adCode = adCode;
    }

    public List<String> getTracking3rdUrls() {
        return tracking3rdUrls;
    }

    public void setTracking3rdUrls(List<String> tracking3rdUrls) {
        this.tracking3rdUrls = tracking3rdUrls;
    }

    @Override
    public String toString() {
        return "adId: "+adId + " media: "+media;
    }
}
