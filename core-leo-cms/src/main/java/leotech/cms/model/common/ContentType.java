package leotech.cms.model.common;

public abstract class ContentType {


    /**
     * basic HTML text
     */
    public static final int HTML_TEXT = 1;

    /**
     * rich media info-graphics with HTML5 canvas (using HTML5 Zip File Uploader)
     */
    public static final int HTML_RICH_MEDIA = 2;

    /**
     * Word/Excel/PDF document
     */
    public static final int OFFICE_DOCUMENT = 3;

    /**
     * VIDEO: mp4 or embedded URL from YouTube, FaceBook, ..
     */
    public static final int VIDEO = 4;
    
    /**
     * MP3 file or embedded URL from SoundCloud, ..
     */
    public static final int AUDIO = 5;

    /**
     * HTML5 Slide
     */
    public static final int HTML_SLIDE_SHOW = 6;

    /**
     * HTML5 Epub ebook
     */
    public static final int EPUB_EBOOK = 7;
    
    /**
     * Image Slide show
     */
    public static final int IMAGE_SLIDESHOW = 8;    
    
}
