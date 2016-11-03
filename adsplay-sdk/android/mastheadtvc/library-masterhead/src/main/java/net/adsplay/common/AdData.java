package net.adsplay.common;

/**
 * Created by trieu on 10/30/16.
 */
public class AdData {
    String media;
    String title;
    long adId;
    String clickthroughUrl;

    public AdData(long adId, String media, String title, String clickthroughUrl) {
        this.adId = adId;
        this.media = media;
        this.title = title;
        this.clickthroughUrl = clickthroughUrl;
    }

    public AdData(long adId, String media, String clickthroughUrl) {
        this.adId = adId;
        this.media = media;
        this.clickthroughUrl = clickthroughUrl;
        this.title = "";
    }

    public long getAdId() {
        return adId;
    }

    public void setAdId(long adId) {
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

    @Override
    public String toString() {
        return "adId: "+adId + " media: "+media;
    }
}
