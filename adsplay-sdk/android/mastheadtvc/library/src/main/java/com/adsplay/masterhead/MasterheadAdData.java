package com.adsplay.masterhead;

/**
 * Created by trieu on 10/30/16.
 */

public class MasterheadAdData {
    String media;
    String title;

    public MasterheadAdData(String media, String title) {
        this.media = media;
        this.title = title;
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
}
