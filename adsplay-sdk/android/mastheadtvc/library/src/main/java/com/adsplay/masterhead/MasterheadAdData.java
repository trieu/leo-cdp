package com.adsplay.masterhead;

/**
 * Created by trieu on 10/30/16.
 */

public class MasterheadAdData {
    String media;
    String title;
    long adId;

    public MasterheadAdData(long adId, String media, String title) {
        this.adId = adId;
        this.media = media;
        this.title = title;
    }

    public MasterheadAdData(long adId,String media) {
        this.adId = adId;
        this.media = media;
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

    @Override
    public String toString() {
        return "adId: "+adId + " media: "+media;
    }
}
