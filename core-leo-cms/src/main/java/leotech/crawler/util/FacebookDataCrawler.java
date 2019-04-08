package leotech.crawler.util;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import rfx.core.util.HttpClientUtil;
import rfx.core.util.StringPool;

public class FacebookDataCrawler {

    public static final class LinkShareStats {
	public String url;
	public int shareCount;
	public int commentCount;

	public LinkShareStats(String url, int shareCount, int commentCount) {
	    super();
	    this.url = url;
	    this.shareCount = shareCount;
	    this.commentCount = commentCount;
	}

	@Override
	public String toString() {
	    return new Gson().toJson(this);
	}
    }

    public static List<LinkShareStats> getLinkInfoOnFacebook(List<String> urls) {
	String baseUrl = "http://graph.facebook.com/?ids=";
	List<LinkShareStats> list = new ArrayList<>();

	JsonObject obj = null;
	try {
	    String ids = String.join(",", urls);
	    baseUrl = baseUrl + URLEncoder.encode(ids, StringPool.UTF_8);
	    obj = new Gson().fromJson(HttpClientUtil.executeGet(baseUrl), JsonObject.class);
	} catch (Exception e) {
	    e.printStackTrace();
	}
	if (obj != null) {
	    Set<Entry<String, JsonElement>> entries = obj.entrySet();
	    for (Map.Entry<String, JsonElement> entry : entries) {
		String url = entry.getKey();
		System.out.println((entry));
		JsonObject shareInfo = obj.getAsJsonObject(url).getAsJsonObject("share");
		int commentCount = shareInfo.get("comment_count").getAsInt();
		int shareCount = shareInfo.get("share_count").getAsInt();
		LinkShareStats stats = new LinkShareStats(url, shareCount, commentCount);
		list.add(stats);
	    }
	   
	}

	return list;
    }

    public static void main(String[] args) {
	List<LinkShareStats> list = getLinkInfoOnFacebook(Arrays.asList(
		"http://kenh14.vn/khoa-pug-len-tieng-sau-khi-nhan-duoc-mail-xin-loi-tu-resort-aroma-mong-cong-dong-ngung-danh-gia-1-sao-tiet-duong-song-cua-ho-20190407010015746.chn",
		"http://kenh14.vn/cong-ty-dia-oc-hung-thinh-len-tieng-ve-thong-tin-youtuber-khoa-pug-la-con-trai-chu-tich-nguyen-dinh-hung-20190407151301402.chn"));
	for (LinkShareStats stat : list) {
	    System.out.println(stat.url);
	    System.out.println("commentCount " + stat.commentCount);
	    System.out.println("shareCount " + stat.shareCount);
	}

    }
}
