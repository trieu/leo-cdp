package leotech.crawler.util;

import java.util.concurrent.TimeUnit;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import de.l3s.boilerpipe.BoilerpipeExtractor;
import de.l3s.boilerpipe.extractors.CommonExtractors;
import de.l3s.boilerpipe.sax.HTMLDocument;
import de.l3s.boilerpipe.sax.HTMLHighlighter;
import leotech.crawler.model.ArticleData;
import rfx.core.util.FileUtils;
import rfx.core.util.HttpClientUtil;

public class ArticleDataCrawler {

    static final LoadingCache<String, ArticleData> cache = CacheBuilder.newBuilder().maximumSize(100000).expireAfterWrite(2, TimeUnit.HOURS)
	    .build(new CacheLoader<String, ArticleData>() {
		public ArticleData load(String url) {
		    ArticleData a = null;
		    try {
			a = processWithRules(url);
		    } catch (Exception e) {
			e.printStackTrace();
		    }
		    return a;
		}
	    });

  

    public static ArticleData process(String url) throws Exception {

	ArticleData articleData = cache.get(url);

	return articleData;
    }

    protected static ArticleData processWithRules(String url) {

	String html = HttpClientUtil.executeGet(url);
	Document doc = Jsoup.parse(html);

	// TODO load from database here
	
	

	String title = "";
	Element metaOgTitle = doc.selectFirst("meta[property=\"og:title\"]");
	if (metaOgTitle != null) {
	    title = metaOgTitle.attr("content");
	}
	
	String headlineImage = "";
	Element headlineImageNode = doc.selectFirst("meta[property=\"og:image\"]");
	if (headlineImageNode != null) {
	    headlineImage = headlineImageNode.attr("content");
	}
	
	Element titleNode = doc.selectFirst("title");
	if (titleNode != null) {
	    title = titleNode.text();
	}

	String patternIf = "medium-com";
	String contentSelector = "article";
	String content = "";
	if (html.contains(patternIf)) {
	    Element ele = doc.selectFirst(contentSelector);
	    if (ele != null) {
		String cssHref = "<link href=\"https://cdn-static-1.medium.com/_/fp/css/main-branding-base.sMRbh_65n82B91860QdvTg.css\" rel=\"stylesheet\" type=\"text/css\" >";
		content = cssHref + ele.outerHtml();
	    } else {
		content = extractContent(html);
	    }
	}
	
	String jsonLinkedData = "";
	Element jsonLinkedDataNode = doc.selectFirst("script[type='application/ld+json']");
	if (jsonLinkedDataNode != null) {
	    jsonLinkedData = jsonLinkedDataNode.html();
	}

	return new ArticleData(title, headlineImage, content, url, jsonLinkedData);
    }

    protected static String extractContent(String html) {
	try {
	    BoilerpipeExtractor extractor = CommonExtractors.ARTICLE_EXTRACTOR;
	    boolean includeImages = true;
	    boolean bodyOnly = true;
	    final HTMLHighlighter hh = HTMLHighlighter.newExtractingInstance(includeImages, bodyOnly);
	    HTMLDocument doc = new HTMLDocument(html);
	    String extractedHtml = hh.process(doc, extractor);
	    return extractedHtml;
	} catch (Exception e) {
	    e.printStackTrace();
	}
	return "";
    }

    public static void main(String[] args) throws Exception {
	String urlStr = "https://productcoalition.com/a-product-managers-approach-to-building-integrations-for-saas-software-b4d5b8c2e9c6";

	ArticleData articleData = ArticleDataCrawler.process(urlStr);
	 articleData = ArticleDataCrawler.process(urlStr);

	System.out.println(articleData.title);
	System.out.println(articleData.url);
	System.out.println(articleData.jsonLinkedData);
	System.out.println(articleData.headlineImage);
	
	FileUtils.writeStringToFile("./BUILD-OUTPUT/test2.html", articleData.content);

	// List<FacebookEngagementData> list =
	// FacebookDataCrawler.getLinkShareStats(Arrays.asList(urlStr));
	//
	// System.out.println(list);

    }
}
