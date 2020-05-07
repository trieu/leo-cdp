package leotech.crawler.dao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoCursor;
import com.arangodb.ArangoDBException;
import com.arangodb.ArangoDatabase;
import com.google.gson.Gson;

import leotech.crawler.model.CrawledYouTubeVideo;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbQuery.CallbackQuery;
import leotech.system.util.database.ArangoDbUtil;

public class CrawledYouTubeVideoDaoUtil {

    private static final String AQL_FIND_BY_ID_AQL =  "FOR v in " + CrawledYouTubeVideo.COLLECTION_NAME + " FILTER v.videoID == @videoID RETURN v";
    
    final static String AQL_LIST_VIDEOS = "FOR v in crawledyoutubevideo LIMIT @startIndex,@numberResult RETURN v";

    public static CrawledYouTubeVideo getByVideoID(String videoID) {
	Map<String, Object> bindKeys = new HashMap<>();
	bindKeys.put("videoID", videoID);
	ArangoCursor<CrawledYouTubeVideo> cursor2 = ArangoDbUtil.getActiveArangoDbInstance().query(AQL_FIND_BY_ID_AQL, bindKeys, null, CrawledYouTubeVideo.class);
	while (cursor2.hasNext()) {
	    try {
		CrawledYouTubeVideo v = cursor2.next();
		return v;
	    } catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
		System.err.println("videoID "+videoID);
	    }
	}
	return null;
    }

    public static String save(CrawledYouTubeVideo video) {
	if (video.isReadyForSave()) {
	    try {
		ArangoCollection col = video.getCollection();
		if (col != null) {
		String videoID = video.getVideoID();
		video.setModificationTime(System.currentTimeMillis());
		CrawledYouTubeVideo data = getByVideoID(videoID);
		if (data == null) {
		    col.insertDocument(video);
		} else {
		    //delete old ata
		    col.deleteDocument(data.getKey());
		    
		    //union old data with the new one
		    List<String> keywords1 = data.getKeywords();
		    List<String> keywords2 = video.getKeywords();
		    Set<String> set = new HashSet<String>();
		    set.addAll(keywords1);
		    set.addAll(keywords2);
		    video.setKeywords(new ArrayList<String>(set));
		    
		    //re-insert
		    col.insertDocument(video);
		}
		return videoID;

		}
	    } catch (ArangoDBException e) {		
		e.printStackTrace();
		System.err.println(new Gson().toJson(video));
	    }
	}
	return "";
    }

    public static List<CrawledYouTubeVideo> list(int startIndex, int numberResult) {
	ArangoDatabase db = ArangoDbUtil.getActiveArangoDbInstance();
	Map<String, Object> bindVars = new HashMap<>(2);
	bindVars.put("startIndex", startIndex);
	bindVars.put("numberResult", numberResult);
	List<CrawledYouTubeVideo> list = new ArangoDbQuery<CrawledYouTubeVideo>(db, AQL_LIST_VIDEOS, bindVars, CrawledYouTubeVideo.class, new CallbackQuery<CrawledYouTubeVideo>() {
	    public CrawledYouTubeVideo apply(CrawledYouTubeVideo obj) {
		// update score or ranking here
		obj.getSocialStatistics().computeDefaultScore();
		return obj;
	    }
	}).getResultsAsList();
	Collections.sort(list);
	return list;
    }

}
