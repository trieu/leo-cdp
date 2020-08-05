package leotech.crawler.util;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import rfx.core.util.HttpClientUtil;
import rfx.core.util.StringPool;

public class FacebookDataCrawler {

	public static final class FacebookEngagementData {
		public final String url;
		public final int shareCount;
		public final int commentCount;
		public final int reactionCount;

		public FacebookEngagementData(String url, int reactionCount, int shareCount, int commentCount) {
			super();
			this.url = url;
			this.reactionCount = reactionCount;
			this.shareCount = shareCount;
			this.commentCount = commentCount;
		}

		@Override
		public String toString() {
			return new Gson().toJson(this);
		}
	}

	public static List<FacebookEngagementData> getLinkShareStats(List<String> urls) {
		String access_token = "EAAX4bGPZARAcBAHFpYQPlXUqiXKwo0nqDjCiNDdcgy6jasiPe03jBJT99uFkatfSjkpOgSaZABOPt4VP3TQqrATHlwuPPl04TQ1Hq8EXlsIM8eb7Dtx6wFg4Ue6ZAIj2p20gHaesJkZAYgUWVJJiVNZAjWEg6vKF5TeYlg6aZB2Rx8vT8XKKMsoj5yw6sb3MHQJmpKBjZC2TSLlGrFr9QKW";
		StringBuilder baseUrl = new StringBuilder("https://graph.facebook.com/?access_token=").append(access_token);
		List<FacebookEngagementData> list = new ArrayList<>();

		JsonObject obj = null;
		try {
			String ids = String.join(",", urls);
			baseUrl.append("&ids=").append(URLEncoder.encode(ids, StringPool.UTF_8)).append("&fields=engagement");
			obj = new Gson().fromJson(HttpClientUtil.executeGet(baseUrl.toString()), JsonObject.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (obj != null) {
			Set<Entry<String, JsonElement>> entries = obj.entrySet();
			for (Map.Entry<String, JsonElement> entry : entries) {
				String url = entry.getKey();
				System.out.println((entry));
				JsonObject engagementInfo = obj.getAsJsonObject(url).getAsJsonObject("engagement");
				int commentCount = engagementInfo.get("comment_count").getAsInt();
				int shareCount = engagementInfo.get("share_count").getAsInt();
				int reactionCount = engagementInfo.get("reaction_count").getAsInt();
				FacebookEngagementData stats = new FacebookEngagementData(url, reactionCount, shareCount,
						commentCount);
				list.add(stats);
			}
		}

		return list;
	}

	public static void main(String[] args) {
//		List<FacebookEngagementData> list = getLinkShareStats(Arrays.asList(
//				"http://kenh14.vn/khoa-pug-len-tieng-sau-khi-nhan-duoc-mail-xin-loi-tu-resort-aroma-mong-cong-dong-ngung-danh-gia-1-sao-tiet-duong-song-cua-ho-20190407010015746.chn",
//				"http://kenh14.vn/cong-ty-dia-oc-hung-thinh-len-tieng-ve-thong-tin-youtuber-khoa-pug-la-con-trai-chu-tich-nguyen-dinh-hung-20190407151301402.chn"));
//		for (FacebookEngagementData stat : list) {
//			System.out.println(stat.url);
//			System.out.println("commentCount " + stat.commentCount);
//			System.out.println("shareCount " + stat.shareCount);
//		}
		
		String url = "https://m.facebook.com/tantrieuf31";
		String html = HttpClientUtil.executeGet(url);
		System.out.println(html);
		Document doc = Jsoup.parse(html);
		Element node =  doc.getElementById("cover-name-root");
		System.out.println(node.text());

	}
}
