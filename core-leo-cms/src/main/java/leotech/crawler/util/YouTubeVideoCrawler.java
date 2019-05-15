package leotech.crawler.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.ResourceId;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import com.google.api.services.youtube.model.SearchResultSnippet;
import com.google.api.services.youtube.model.Thumbnail;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoSnippet;
import com.google.api.services.youtube.model.VideoStatistics;
import com.google.api.services.youtube.model.VideoTopicDetails;

import leotech.crawler.model.Auth;
import leotech.crawler.model.CrawledYouTubeVideo;
import leotech.crawler.model.SocialStatistics;
import rfx.core.util.RandomUtil;

public class YouTubeVideoCrawler {

    private static final String YOUTUBE_BASE_URL = "https://www.youtube.com/embed/";

    private static final String YOUTUBE_VIDEO = "youtube#video";

    /**
     * Define a global variable that identifies the name of a file that contains the
     * developer's API key.
     */
    private static final String PROPERTIES_FILENAME = "./configs/youtube.properties";

    private static final int NUMBER_OF_VIDEOS_RETURNED = 50;

    /**
     * Define a global instance of a Youtube object, which will be used to make
     * YouTube Data API requests.
     */
    private static YouTube youtube;
    static Properties properties = new Properties();

    static {
	init();
    }

    public static void init() {
	if (youtube != null) {
	    return;
	}
	// Read the developer key from the properties file.
	try {
	    InputStream in = new FileInputStream(new File(PROPERTIES_FILENAME));
	    properties.load(in);
	} catch (IOException e) {
	    System.err.println("There was an error reading " + PROPERTIES_FILENAME + ": " + e.getCause() + " : " + e.getMessage());
	}
	try {
	    // This object is used to make YouTube Data API requests.
	    youtube = new YouTube.Builder(Auth.HTTP_TRANSPORT, Auth.JSON_FACTORY, new HttpRequestInitializer() {
		public void initialize(HttpRequest request) throws IOException {
		    //
		}
	    }).setApplicationName("youtube-video-crawler").build();

	} catch (Throwable t) {
	    t.printStackTrace();
	}
    }

    protected static String getApiKey() {
	return properties.getProperty("youtube.apikey");
    }

    static YouTube.Search.List buildSearchQuery(String q, int maxResults, String pageToken, String channelId) throws Exception {
	// Define the API request for retrieving search results.
	YouTube.Search.List search = youtube.search().list("id,snippet");

	// Set your developer key
	String apiKey = getApiKey();
	search.setKey(apiKey);
	search.setQ(q);
	search.setSafeSearch("strict");
	search.setVideoEmbeddable("true"); // Only retrieve embeddable videos.
	search.setOrder("viewCount");

	// Restrict the search results to only include videos. See:
	// https://developers.google.com/youtube/v3/docs/search/list#type
	search.setType("video"); // channel , playlist , video

	// To increase efficiency, only retrieve the fields that the application
	// uses.
	// search.setFields("items(id/kind,id/videoId,snippet/title,snippet/thumbnails/default/url)");
	search.setMaxResults(1L * maxResults);
	if (pageToken != null) {
	    search.setPageToken(pageToken);
	}
	if (channelId != null) {
	    search.setChannelId(channelId);
	}
	return search;
    }

    public static CrawledYouTubeVideo querySingle(String q) {
	List<CrawledYouTubeVideo> results = query(q, NUMBER_OF_VIDEOS_RETURNED, NUMBER_OF_VIDEOS_RETURNED, null);
	int s = results.size();
	if (s > 0) {
	    int i = RandomUtil.getRandomInteger(s, 0);
	    return results.get(i);
	}
	return null;
    }

    public static List<CrawledYouTubeVideo> query(String q) {
	return query(q, NUMBER_OF_VIDEOS_RETURNED);
    }

    public static List<CrawledYouTubeVideo> query(String q, int maxResults) {
	return query(q, NUMBER_OF_VIDEOS_RETURNED, maxResults, null);
    }

    public static CrawledYouTubeVideo get(String videoID) {
	try {
	    YouTube.Videos.List list = youtube.videos().list("snippet,statistics,topicDetails");
	    list.setId(videoID);
	    String apiKey = getApiKey();
	    list.setKey(apiKey);
	    List<Video> items = list.execute().getItems();
	    if (items != null) {
		if (items.size() == 1) {
		    Video singleVideo = items.get(0);
		    VideoSnippet vdSnippet = singleVideo.getSnippet();

		    long publishedAt = vdSnippet.getPublishedAt().getValue();
		    Thumbnail thumbnail = vdSnippet.getThumbnails().getMedium();

		    String fullUrl = YOUTUBE_BASE_URL + videoID;

		    CrawledYouTubeVideo v = new CrawledYouTubeVideo(videoID, vdSnippet.getTitle(), vdSnippet.getDescription(), publishedAt, thumbnail.getUrl(), fullUrl,
			    vdSnippet.getChannelId(), vdSnippet.getChannelTitle());
		    VideoTopicDetails topicDetails = singleVideo.getTopicDetails();
		    if (topicDetails != null) {
			v.setTopicCategories(topicDetails.getTopicCategories());
		    }

		    VideoStatistics statistics = singleVideo.getStatistics();
		    long view = statistics.getViewCount() != null ? statistics.getViewCount().longValue() : 0;
		    long like = statistics.getLikeCount() != null ? statistics.getLikeCount().longValue() : 0;
		    long bookmark = statistics.getFavoriteCount() != null ? statistics.getFavoriteCount().longValue() : 0;
		    long comment = statistics.getCommentCount() != null ? statistics.getCommentCount().longValue() : 0;

		    SocialStatistics socialStatistics = new SocialStatistics(like, bookmark, comment, view);
		    v.setSocialStatistics(socialStatistics);
		    return v;
		}
	    }

	} catch (Exception e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return null;
    }
    
    public static List<CrawledYouTubeVideo> query(String keyword, int maxResultsPerQuery, int totalResults) {
	return query(keyword, maxResultsPerQuery, totalResults, null);
    }

    public static List<CrawledYouTubeVideo> query(String keyword, int maxResultsPerQuery, int totalResults, String channelId) {
	List<CrawledYouTubeVideo> results = new ArrayList<>(totalResults);
	try {
	    // Call the API for first query
	    String nextPageToken = null;
	    int counter = totalResults;
	    SearchListResponse searchResponse = buildSearchQuery(keyword, maxResultsPerQuery, nextPageToken, channelId).execute();

	    while (counter > 0 && searchResponse != null) {
		List<SearchResult> searchResultList = searchResponse.getItems();

		Iterator<SearchResult> iteratorSearchResults = searchResultList.iterator();
		if (!iteratorSearchResults.hasNext()) {
		    System.out.println(" There aren't any results for your query.");
		}

		while (iteratorSearchResults.hasNext()) {
		    SearchResult singleVideo = iteratorSearchResults.next();
		    ResourceId rId = singleVideo.getId();

		    // Confirm that the result represents a video.
		    // Otherwise, the item will not contain a video ID.
		    if (rId.getKind().equals(YOUTUBE_VIDEO)) {
			SearchResultSnippet vdSnippet = singleVideo.getSnippet();
			long publishedAt = vdSnippet.getPublishedAt().getValue();
			Thumbnail thumbnail = vdSnippet.getThumbnails().getHigh();
			String videoId = rId.getVideoId();
			String fullUrl = YOUTUBE_BASE_URL + videoId;

			
			CrawledYouTubeVideo v = new CrawledYouTubeVideo(videoId, vdSnippet.getTitle(), vdSnippet.getDescription(), publishedAt, thumbnail.getUrl(), fullUrl,
				vdSnippet.getChannelId(), vdSnippet.getChannelTitle());

			YouTube.Videos.List list = youtube.videos().list("statistics,topicDetails");
			list.setId(videoId);
			String apiKey = getApiKey();
			list.setKey(apiKey);
			Video youtubeVideo = list.execute().getItems().get(0);

			//set keywords and topicDetails
			List<String> keywords = new ArrayList<>();
			keywords.add(keyword);
			VideoTopicDetails topicDetails = youtubeVideo.getTopicDetails();
			if (topicDetails != null) {
			    List<String> topicCategories = topicDetails.getTopicCategories();
			    v.setTopicCategories(topicCategories);			    
			    for (String topic : topicCategories) {
				String name = topic.substring(topic.lastIndexOf("/")+1).toLowerCase().trim();
				keywords.add(name);
			    }
			}
			v.setKeywords(keywords);

			VideoStatistics statistics = youtubeVideo.getStatistics();
			long view = statistics.getViewCount() != null ? statistics.getViewCount().longValue() : 0;
			long like = statistics.getLikeCount() != null ? statistics.getLikeCount().longValue() : 0;
			long bookmark = statistics.getFavoriteCount() != null ? statistics.getFavoriteCount().longValue() : 0;
			long comment = statistics.getCommentCount() != null ? statistics.getCommentCount().longValue() : 0;

			SocialStatistics socialStatistics = new SocialStatistics(like, bookmark, comment, view);
			v.setSocialStatistics(socialStatistics);
			results.add(v);
			counter--;

			// System.out.println(" Video Id: " + videoId);
			// System.out.println(" ChannelId: " + vdSnippet.getChannelId());
			// System.out.println(" ChannelTitle: " + vdSnippet.getChannelTitle());
			// System.out.println(" Title: " + vdSnippet.getTitle());
			// System.out.println(" Description: " + vdSnippet.getDescription());
			// System.out.println(" PublishedAt: " + publishedAt);
			// System.out.println(" Thumbnail: " + thumbnail.getUrl());
			// System.out.println(" socialStatistics: " + socialStatistics);
			// System.out.println("\n-------------------------------------------------------------\n");
		    }
		}

		nextPageToken = searchResponse.getNextPageToken();
		if (nextPageToken == null) {
		    break;
		}
		searchResponse = buildSearchQuery(keyword, maxResultsPerQuery, nextPageToken, channelId).execute();

		//TODO debug log here
//		System.out.println("nextPageToken " + nextPageToken);
//		System.out.println("counter " + counter);
//		System.out.println("searchResponse " + searchResponse);
	    }

	} catch (Exception e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return results;
    }

}
